import { expect, test } from "vite-plus/test";
import { greeting } from "../src/index.js";

test("greeting", () => {
  expect(greeting()).toBe("clankgsters-sync");
});
