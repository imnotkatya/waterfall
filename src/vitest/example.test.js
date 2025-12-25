import * as XLSX from "xlsx";
import * as fs from "fs";
import * as path from "path";
import { it, expect } from "vitest";

it("import correct file", () => {
  const filePath = path.resolve("dist/waterfall.xlsx");
  const fileBuffer = fs.readFileSync(filePath);
  const workbook = XLSX.read(fileBuffer, { type: "buffer" });

  const combinedJson = {};
  const sheetNames = [
    workbook.SheetNames[1],
    workbook.SheetNames[2],
    workbook.SheetNames[3],
  ];

  sheetNames.forEach((sheetName, index) => {
    const key = index + 1;
    combinedJson[key] = {
      name: sheetName,
      data: XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]),
    };
  });

  expect(sheetNames.length).toBe(3);
  expect(sheetNames[0]).toBe("data");
  expect(sheetNames[1]).toBe("settings");
  expect(sheetNames[2]).toBe("styles");
});
