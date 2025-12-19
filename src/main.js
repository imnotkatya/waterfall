import { drawPlot, processFile, processData } from "./chart.js";
import { setupFileUpload } from "./upload";

const STYLES = `
  @font-face {
    font-family: 'SymbolsNerdFontMono-Regular';
    src: url('./SymbolsNerdFontMono-Regular.ttf') format('truetype');
    font-weight: normal;
    font-style: normal;
    font-display: block;
  }
  body {
    margin: 0;
    padding: 0;
  }
  .app-container {
    min-height: 100vh;
    background: white;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    cursor: pointer;
  }
  .header {
    text-align: center;
    background: #f8f9fa;
    margin-bottom: 0;
  }
  .header h1 {
    font-weight: normal;
    color: #2c3e50;
    margin: 0;
    padding: 20px 0;
  }
  .upload-section {
    text-align: center;
    padding: 40px;
  }
  .upload-text {
    font-size: 18pt;
    color: #495057;
    margin-bottom: 1rem;
  }
  .upload-subtext {
    font-size: 12pt;
    color: #6c757d;
  }
  .images {
    display: flex;
    flex-direction: row;
    gap: 120px;
    margin-top: 20px;
  }
  .hidden {
    display: none;
  }
  img {
    width: 500px;
    height: 300px;
    border: 1px solid #dee2e6;
  }

  .instructions {
    margin-top: 30px;
    text-align: left;
    max-width: 1200px;
    margin-left: auto;
    margin-right: auto;
  }
  #text-instructions p {
    font-size: 16pt;
    color: #495057;
    margin-bottom: 20px;
  }
  #drop-zone {
    background: #f8f9fa;
    border: 2px dashed #dee2e6;
    border-radius: 8px;
    padding: 3rem 2rem;
    margin: 0 auto;
    max-width: 500px;
    transition: all 0.3s ease;
  }


`;

const APP_TEMPLATE = `
  <div class="app-container">
    <div class="header">
      <h1>Waterfall Plot</h1>
    </div>
    
    <div class="upload-section">
      <div id="drop-zone">
        <div class="upload-text">Нажмите в любом месте или перетащите Excel файл</div>
        <div class="upload-subtext">Поддерживаются файлы .xlsx, .xls</div>
      </div>
      <div class="instructions">
        <div id="text-instructions">
          <p>Для работы с данной программой нужно...</p>
          <div class="images">
            <div id="excel-template">
            <a href="waterfall.xlsx" download>
               <img src="./data.png" alt="Пример данных Excel">
                <p><center>Пример данных Excel</center></p>
              </a>
            </div>
            <div id="plot-template">
             <img src="./result.png" alt="Пример графика">
              <p><center>Пример графика</center></p>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div id="chartContent"></div>
    
    <input type="file" id="excelFile" accept=".xlsx, .xls" class="hidden" />
  </div>
`;

export function main(container) {
  const style = document.createElement("style");
  style.textContent = STYLES;
  document.head.appendChild(style);

  container.innerHTML = `
    <div>
      <div class="card">
        <div id="chart-container">
          ${APP_TEMPLATE}
        </div>
      </div>
    </div>
  `;

  const chartContainer = container.querySelector("#chart-container");

  setupFileUpload(chartContainer, async (file) => {
    await drawPlot(
      processData(await processFile(file)),
      chartContainer.querySelector("#chartContent")
    );
  });
}

const container = document.querySelector("#app");
main(container);
