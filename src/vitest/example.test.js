import { it, expect } from "vitest";
import * as aq from "arquero";
import { drawPlot, processData } from "../chart";

it("renders ", () => {
  const rawData = {
    chartData: aq.from([
      { name: "P1", percent: 10, category: "Cat1" },
      { name: "P2", percent: -5, category: "Cat2" },
      { name: "P3", percent: 15, category: "Cat1" },
    ]),
    settingsData: aq.from([
      { measure: "width", value: 1000 },
      { measure: "height", value: 600 },
      { measure: "label_x", value: "x" },
      { measure: "label_y", value: "y" },
    ]),
    stylesData: aq.from([
      { key: "Cat1", color: "red" },
      { key: "Cat2", color: "green" },
    ]),
  };

  const processedData = processData(rawData);

  const container = document.createElement("div");

  container.innerHTML = `
    <div>
      <div class="card">
        <div id="chart-container">
       
        </div>
      </div>
    </div>
  `;
  const chartContainer = container.querySelector("#chart-container");

  expect(drawPlot(processedData, chartContainer)).toBeTruthy();
  expect(chartContainer.querySelector("svg")).toBeTruthy();
  expect(chartContainer.innerHTML).toContain("svg");

  expect(chartContainer.innerHTML).toContain("rect");
  expect(chartContainer.innerHTML).toContain("text");
});
