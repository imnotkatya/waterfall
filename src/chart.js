import * as d3 from "d3";
import * as aq from "arquero";
import * as XLSX from "xlsx";
import sort from "./sort";
function handleExcelUpload(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const workbook = XLSX.read(e.target.result, { type: "array" });
      const toTable = (sheet) =>
        aq.from(
          XLSX.utils.sheet_to_json(workbook.Sheets[sheet], { defval: "" })
        );

      resolve({
        stylesTable: toTable("styles"),
        data: toTable("data"),
      });
    };

    reader.onerror = () => reject(new Error("Ошибка чтения файла"));
    reader.readAsArrayBuffer(file);
  });
}

function createScale(colors, property) {
  return d3
    .scaleOrdinal()
    .domain(colors.map((c) => c.key))
    .range(colors.map((c) => c[property]));
}

function processData(raw) {
  const { stylesData, data } = raw;
  const dataset = data.objects();
  const styles = stylesData.objects ? stylesData.objects() : stylesData;

  const colors = styles.map((d) => ({
    key: d.key,
    color: d.color,
  }));

  const scales = {
    color: createScale(colors, "color"),
  };

  return {
    colors,
    scales,
    dataset: dataset,
    baseSettings: {
      width: 1200,
      height: 1000,
      marginTop: 230,
      marginRight: 250,
      marginBottom: 100,
      marginLeft: 150,
    },
  };
}

function drawChart(processedData, container) {
  const { scales, dataset, baseSettings, colors } = processedData;
  const { width, height, marginTop, marginRight, marginBottom, marginLeft } =
    baseSettings;

  container.innerHTML = "";

  const svg = d3
    .select(container)
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  const sortedData = sort(dataset);
  const sortedNames = sortedData.map((d) => d.name);

  const y = d3
    .scaleLinear()
    .domain([-100, 100])
    .range([height - marginBottom, marginTop]);

  const x = d3
    .scaleBand()
    .domain(sortedNames)
    .range([marginLeft, width - marginRight])
    .padding(0.2);

  const zeroY = y(0);

  svg
    .append("g")
    .attr("transform", `translate(0,${zeroY})`)
    .call(d3.axisBottom(x).tickFormat(""))
    .style("font-size", "15px");

  svg
    .append("g")
    .attr("transform", `translate(${marginLeft},0)`)
    .call(d3.axisLeft(y).ticks(10))
    .style("font-size", "15px");

  svg
    .selectAll(".bars")
    .data(sortedData)
    .enter()
    .append("rect")
    .attr("class", "bars")
    .attr("x", (d) => x(d.name))
    .attr("y", (d) => {
      const value = d.percent;
      return value >= 0 ? zeroY - Math.abs(y(value) - y(0)) : zeroY;
    })
    .attr("width", x.bandwidth())
    .attr("height", (d) => {
      const value = d.percent;
      return Math.abs(y(value) - y(0));
    })
    .attr("fill", (d) => {
      return scales.color(d.category);
    })
    .attr("opacity", 0.8)
    .attr("stroke", "#333")
    .attr("stroke-width", 1)
    .attr("rx", 2);

  svg
    .selectAll(".bar-labels")
    .data(sortedData)
    .enter()
    .append("text")
    .attr("class", "bar-labels")
    .attr("x", (d) => x(d.name) + x.bandwidth() / 2)
    .attr("y", (d) => {
      const value = d.percent;

      if (value >= 0) {
        return zeroY - Math.abs(y(value) - y(0)) - 5;
      } else {
        return zeroY + Math.abs(y(value) - y(0)) + 15;
      }
    })
    .attr("text-anchor", "middle")
    .style("font-size", "12px")
    .style("font-weight", "bold")
    .style("fill", "#333")
    .text((d) => d.name);

  const legendGroup = svg
    .append("g")
    .attr("class", "legend")
    .attr("transform", `translate(${width - marginRight + 20}, ${marginTop})`);

  const uniqueCategories = [...new Set(dataset.map((d) => d.category))];

  const legendData = uniqueCategories.filter(
    (d) => scales.color(d) !== undefined
  );

  const legendItemHeight = 28;

  legendGroup
    .selectAll(".legend-rect")
    .data(legendData)
    .enter()
    .append("rect")
    .attr("class", "legend-rect")
    .attr("x", 0)
    .attr("y", (d, i) => i * legendItemHeight)
    .attr("width", 20)
    .attr("height", 20)
    .attr("fill", (d) => scales.color(d))
    .attr("opacity", 0.8)
    .attr("stroke", "#333")
    .attr("stroke-width", 1)
    .attr("rx", 3);

  legendGroup
    .selectAll(".legend-label")
    .data(legendData)
    .enter()
    .append("text")
    .attr("class", "legend-label")
    .attr("x", 30)
    .attr("y", (d, i) => i * legendItemHeight + 10)
    .attr("dy", "0.35em")
    .style("font-size", "14px")
    .style("fill", "#333")
    .style("font-weight", "normal")
    .text((d) => d);

  return svg.node();
}

export async function drawPlot(file, chartContainer) {
  try {
    const excelData = await handleExcelUpload(file);
    const raw = {
      data: excelData.data,
      stylesData: excelData.stylesTable,
    };

    const processedData = processData(raw);
    drawChart(processedData, chartContainer);
  } catch (error) {
    console.error("Ошибка при построении графика:", error);
    chartContainer.innerHTML = `<div >
      Ошибка: ${error.message}<br/><br/>
    
    </div>`;
  }
}
