import { expect, test } from "vitest";
import calculateLegendWidth from "../chart.js";
import * as aq from "arquero";
const table = aq.from([
  { name: "P11", percent: -2, category: "first_category" },
  { name: "P14", percent: -2, category: "second_category" },
  { name: "P2", percent: -5.19230769230769, category: "third_category" },
  { name: "P7", percent: 44, category: "fourth_category" },
]);
const categories = table.objects();
test("calculateLegendWidth check max length", () => {
  expect(calculateLegendWidth(categories)).toBe(150);
});
