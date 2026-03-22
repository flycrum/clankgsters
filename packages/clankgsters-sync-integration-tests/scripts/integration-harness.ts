/**
 * Integration harness for @clankgsters/sync — expand with cases and sandboxes over time.
 * Run: vp run --filter @clankgsters/sync-integration-tests test
 */

import chalk from "chalk";
import { greeting } from "../../clankgsters-sync/src/index.js";

async function main(): Promise<void> {
  const value = greeting();
  if (value !== "clankgsters-sync") {
    console.error(chalk.red("unexpected greeting:"), value);
    process.exit(1);
  }
  console.log(chalk.green("integration harness: ok"), value);
}

main().catch((err: unknown) => {
  console.error(chalk.red("integration harness failed"), err);
  process.exit(1);
});
