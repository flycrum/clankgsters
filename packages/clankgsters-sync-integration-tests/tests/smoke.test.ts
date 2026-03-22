import { expect, test } from "vite-plus/test";
import { greeting } from "../../clankgsters-sync/src/index.js";

test("workspace link to @clankgsters/sync", () => {
  expect(greeting()).toBe("clankgsters-sync");
});
