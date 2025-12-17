import { test, expect, vi } from "vitest";
import { drawPlot } from "../chart.js";

test("проверка ошибки при неправильном файле", async () => {
  const OriginalFileReader = global.FileReader;
  global.FileReader = vi.fn(function () {
    this.readAsArrayBuffer = vi.fn(function () {
      setTimeout(() => {
        if (this.onerror) {
          const errorEvent = new Event("error");
          this.onerror(errorEvent);
        }
      }, 0);
    });

    return this;
  });

  const fileContent = "invalid data";
  const file = new File([fileContent], "test.xlsx");

  const container = {
    innerHTML: "",
  };

  await drawPlot(file, container);

  await new Promise((resolve) => setTimeout(resolve, 10));

  expect(container.innerHTML).toContain("Ошибка");

  global.FileReader = OriginalFileReader;
});
