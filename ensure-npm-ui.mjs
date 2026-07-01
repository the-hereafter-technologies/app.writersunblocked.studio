import { execSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const REAL_PACKAGE = "@the-hereafter-technologies/writersunblocked-ui";
const VANITY_PACKAGE = "@writersunblocked/ui";
const YALC_PATH = ".yalc/@the-hereafter-technologies/writersunblocked-ui";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const normalizeScript = join(scriptDir, "normalize-ui-yalc.mjs");
const consumerRoot = process.cwd();
const yalcPackagePath = join(consumerRoot, YALC_PATH);
const packageJsonPath = join(consumerRoot, "package.json");

function run(command) {
  execSync(command, { cwd: consumerRoot, stdio: "inherit" });
}

function isYalcLinked() {
  if (existsSync(yalcPackagePath)) {
    return true;
  }

  const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"));
  return packageJson.dependencies?.[VANITY_PACKAGE]?.startsWith("portal:");
}

if (!isYalcLinked()) {
  console.log("[ensure-npm-ui] UI already resolved from npm — skipping");
  process.exit(0);
}

console.log("[ensure-npm-ui] Reverting yalc link to published npm package");

if (existsSync(yalcPackagePath)) {
  run(`yalc remove ${REAL_PACKAGE}`);
}

run(`node ${normalizeScript}`);
run("yarn install");

console.log("[ensure-npm-ui] Done");
