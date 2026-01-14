import path from "path";
import fs from "fs-extra";
import type { Framework } from "../types";

interface ProjectInfo {
  framework: Framework;
  srcDir: boolean;
  appDir: boolean;
  isTsx: boolean;
  aliasPrefix: string;
  tailwindConfigFile: string | null;
  tailwindCssFile: string | null;
}

export async function getProjectInfo(cwd: string): Promise<ProjectInfo> {
  const [framework, isTsx, aliasPrefix, srcDir, tailwindConfigFile, tailwindCssFile] = await Promise.all([
    detectFramework(cwd),
    detectTypescript(cwd),
    detectAliasPrefix(cwd),
    detectSrcDir(cwd),
    findTailwindConfig(cwd),
    findTailwindCss(cwd),
  ]);

  return {
    framework,
    srcDir,
    appDir: false, // SolidJS doesn't use app directory pattern like Next.js
    isTsx,
    aliasPrefix,
    tailwindConfigFile,
    tailwindCssFile,
  };
}

async function detectFramework(cwd: string): Promise<Framework> {
  const packageJsonPath = path.resolve(cwd, "package.json");
  
  if (!fs.existsSync(packageJsonPath)) {
    return {
      name: "unknown",
      isSrcDir: fs.existsSync(path.resolve(cwd, "src")),
      isUsingTypeScript: await detectTypescript(cwd),
    };
  }

  try {
    const packageJson = await fs.readJSON(packageJsonPath);
    const deps = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies,
    };

    // Check for Solid Start
    if (deps["@solidjs/start"] || deps["solid-start"]) {
      return {
        name: "solid-start",
        isSrcDir: fs.existsSync(path.resolve(cwd, "src")),
        isUsingTypeScript: await detectTypescript(cwd),
      };
    }

    // Check for Vite + SolidJS
    if (deps["solid-js"] && (deps["vite"] || deps["vite-plugin-solid"])) {
      return {
        name: "vite-solid",
        isSrcDir: fs.existsSync(path.resolve(cwd, "src")),
        isUsingTypeScript: await detectTypescript(cwd),
      };
    }

    return {
      name: "unknown",
      isSrcDir: fs.existsSync(path.resolve(cwd, "src")),
      isUsingTypeScript: await detectTypescript(cwd),
    };
  } catch {
    return {
      name: "unknown",
      isSrcDir: false,
      isUsingTypeScript: false,
    };
  }
}

async function detectTypescript(cwd: string): Promise<boolean> {
  const tsconfigPath = path.resolve(cwd, "tsconfig.json");
  return fs.existsSync(tsconfigPath);
}

async function detectAliasPrefix(cwd: string): Promise<string> {
  // Check tsconfig.json for path aliases
  const tsconfigPath = path.resolve(cwd, "tsconfig.json");
  
  if (fs.existsSync(tsconfigPath)) {
    try {
      const tsconfig = await fs.readJSON(tsconfigPath);
      const paths = tsconfig.compilerOptions?.paths || {};
      
      // Look for common alias patterns
      if (paths["@/*"]) return "@";
      if (paths["~/*"]) return "~";
      if (paths["$/*"]) return "$";
    } catch {
      // Ignore errors
    }
  }
  
  // Check vite.config for aliases
  const viteConfigFiles = ["vite.config.ts", "vite.config.js", "vite.config.mts"];
  for (const configFile of viteConfigFiles) {
    const configPath = path.resolve(cwd, configFile);
    if (fs.existsSync(configPath)) {
      try {
        const content = await fs.readFile(configPath, "utf-8");
        if (content.includes("'@'") || content.includes('"@"')) return "@";
        if (content.includes("'~'") || content.includes('"~"')) return "~";
      } catch {
        // Ignore errors
      }
    }
  }
  
  return "@";
}

async function detectSrcDir(cwd: string): Promise<boolean> {
  return fs.existsSync(path.resolve(cwd, "src"));
}

async function findTailwindConfig(cwd: string): Promise<string | null> {
  const configFiles = [
    "tailwind.config.ts",
    "tailwind.config.js",
    "tailwind.config.mjs",
    "tailwind.config.cjs",
  ];

  for (const file of configFiles) {
    const filePath = path.resolve(cwd, file);
    if (fs.existsSync(filePath)) {
      return file;
    }
  }

  return null;
}

async function findTailwindCss(cwd: string): Promise<string | null> {
  const possiblePaths = [
    "src/index.css",
    "src/globals.css",
    "src/app.css",
    "src/styles/globals.css",
    "src/styles/index.css",
    "app/globals.css",
    "styles/globals.css",
  ];

  for (const cssPath of possiblePaths) {
    const fullPath = path.resolve(cwd, cssPath);
    if (fs.existsSync(fullPath)) {
      // Check if it imports tailwind
      try {
        const content = await fs.readFile(fullPath, "utf-8");
        if (content.includes("@tailwind") || content.includes("tailwindcss")) {
          return cssPath;
        }
      } catch {
        // Ignore read errors
      }
    }
  }

  // Just return the first existing CSS file
  for (const cssPath of possiblePaths) {
    if (fs.existsSync(path.resolve(cwd, cssPath))) {
      return cssPath;
    }
  }

  return null;
}

export async function hasSolidJs(cwd: string): Promise<boolean> {
  const packageJsonPath = path.resolve(cwd, "package.json");
  
  if (!fs.existsSync(packageJsonPath)) {
    return false;
  }

  try {
    const packageJson = await fs.readJSON(packageJsonPath);
    const deps = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies,
    };
    return !!deps["solid-js"];
  } catch {
    return false;
  }
}
