import path from "path";
import fs from "fs-extra";
import { configSchema, type Config } from "../types";

export async function getConfig(cwd: string): Promise<Config | null> {
  const configPath = path.resolve(cwd, "ensolid.json");

  if (!fs.existsSync(configPath)) {
    return null;
  }

  try {
    const config = await fs.readJSON(configPath);
    return configSchema.parse(config);
  } catch (error) {
    return null;
  }
}
