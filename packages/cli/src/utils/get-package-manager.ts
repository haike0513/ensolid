import path from "path";
import fs from "fs-extra";

export async function getPackageManager(cwd: string): Promise<"pnpm" | "npm" | "yarn" | "bun"> {
  if (fs.existsSync(path.resolve(cwd, "pnpm-lock.yaml"))) return "pnpm";
  if (fs.existsSync(path.resolve(cwd, "yarn.lock"))) return "yarn";
  if (fs.existsSync(path.resolve(cwd, "bun.lockb"))) return "bun";
  return "npm";
}
