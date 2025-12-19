import * as d3 from "d3";
import * as aq from "arquero";
import * as XLSX from "xlsx";
function handleJsonUpload(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const jsonData = JSON.parse(e.target.result);
      let stylesData, settingsData, chartData;
      if (jsonData.styles && jsonData.settings && jsonData.data) {
        stylesData = jsonData.styles;
        settingsData = jsonData.settings;
        chartData = jsonData.data;
      }

      resolve({
        stylesTable: aq.from(stylesData),
        settingsTable: aq.from(settingsData),
        chartData: aq.from(chartData),
      });
    };
    reader.onerror = () => reject(new Error("Ошибка чтения файла"));
    reader.readAsText(file);
  });
}
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
        settingsTable: toTable("settings"),
        chartData: toTable("data"),
      });
    };

    reader.onerror = () => reject(new Error("Ошибка чтения файла"));
    reader.readAsArrayBuffer(file);
  });
}

function calculateLegendWidth(uniqueCategories) {
  return (
    aq
      .from(uniqueCategories)
      .derive({ label_length: aq.escape((d) => String(d.category).length) })
      .rollup({ max_length: aq.op.max("label_length") })
      .object().max_length * 10
  );
}

function createScale(colors, property) {
  return d3
    .scaleOrdinal()
    .domain(colors.map((c) => c.key))
    .range(colors.map((c) => c[property]));
}

function processData(raw) {
  const { stylesData, chartData, settingsData } = raw;

  const settings = settingsData.reduce((acc, d) => {
    acc[d.measure] = d.value;
    return acc;
  }, {});

  const dataset = chartData.objects();

  const styles = stylesData.objects();

  const baseSettings = {
    width: settings.width || 1600,
    height: settings.height || 900,
    label_x: settings.label_x || "",
    label_y: settings.label_y || "",
  };

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
    baseSettings,
    dataset,
    baseSettings,
  };
}

function drawChart(processedData, container) {
  const { scales, dataset, baseSettings } = processedData;
  const { width, height } = baseSettings;

  const uniqueCategories = aq
    .from(dataset)
    .dedupe("category")
    .filter((d) => d.category !== "")
    .objects();

  container.innerHTML = "";

  const marginLeft = 120;
  const marginBottom = 100;
  const marginTop = 50;
  const marginRight = calculateLegendWidth(uniqueCategories);
  console.log(uniqueCategories);
  console.log(calculateLegendWidth(uniqueCategories));
  console.log(marginRight);
  const settingsContext = {
    width,
    height,
    marginTop,
    marginRight,
    marginBottom,
    marginLeft,
  };
  const sortedData = aq.from(dataset).orderby(aq.desc("percent")).objects();
  const sortedNames = sortedData.map((d) => d.name);

  const svg = d3
    .select(container)
    .append("svg")
    .attr("width", width + calculateLegendWidth(uniqueCategories))
    .attr("height", height);

  const y = d3
    .scaleLinear()
    .domain([-100, 100])
    .range([height - marginBottom, marginTop]);

  const x = d3
    .scaleBand()
    .domain(sortedNames)
    .range([marginLeft, width - marginRight])
    .padding(0.2);

  svg
    .append("text")
    .attr("class", "x-label")
    .attr("text-anchor", "middle")
    .attr("x", width / 2)
    .attr("y", height - marginBottom / 2)
    .style("font-size", "18px")
    .style("fill", "#333")
    .text(baseSettings.label_x);
  svg
    .append("text")
    .attr("class", "y-label")
    .attr("text-anchor", "middle")
    .attr(
      "transform",
      `translate(${marginLeft - 60}, ${height / 2}) rotate(-90)`
    )
    .style("font-size", "18px")
    .style("fill", "#333")
    .text(baseSettings.label_y);
  const zeroY = y(0);

  svg
    .append("g")
    .attr("transform", `translate(0,${zeroY})`)
    .call(d3.axisBottom(x).tickFormat(""))
    .style("font-size", "15px")
    .selectAll(".tick line")
    .remove();
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
    .style("font-size", "15px")
    .style("font-weight", "bold")
    .style("fill", "#333")
    .text((d) => d.name);
  drawLegend(svg, scales, settingsContext, uniqueCategories);
  return svg.node();
}

function drawLegend(svg, scales, settingsContext, uniqueCategories) {
  const { marginTop, marginRight, width } = settingsContext;
  const legendGroup = svg
    .append("g")
    .attr("class", "legend")
    .attr("transform", `translate(${width - marginRight + 20}, ${marginTop})`);

  const legendItemHeight = 35;

  legendGroup
    .selectAll(".legend-rect")
    .data(uniqueCategories)
    .enter()
    .append("rect")
    .attr("class", "legend-rect")
    .attr("x", 0)
    .attr("y", (d, i) => i * legendItemHeight)
    .attr("width", 25)
    .attr("height", 25)
    .attr("fill", (d) => scales.color(d))
    .attr("opacity", 0.8)
    .attr("stroke", "#333")
    .attr("stroke-width", 1)
    .attr("rx", 3);

  legendGroup
    .selectAll(".legend-label")
    .data(uniqueCategories)
    .enter()
    .append("text")
    .attr("class", "legend-label")
    .attr("x", 30)
    .attr("y", (d, i) => i * legendItemHeight + 10)
    .attr("dy", "10px")
    .style("font-size", "18px")
    .style("fill", "#333")
    .style("font-weight", "normal")
    .text((d) => d.category);
}

export async function drawPlot(file, chartContainer) {
  try {
    const fileName = file.name.toLowerCase();
    let excelData;
    if (fileName.endsWith(".json")) {
      excelData = await handleJsonUpload(file);
    } else if (fileName.endsWith(".xlsx") || fileName.endsWith(".xls")) {
      excelData = await handleExcelUpload(file);
    }

    const raw = {
      chartData: excelData.chartData,
      settingsData: excelData.settingsTable.objects(),
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
