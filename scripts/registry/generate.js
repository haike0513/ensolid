import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.resolve(__dirname, "../../");
const UI_COMPONENTS_DIR = path.resolve(ROOT_DIR, "src/components/ui");
const PUBLIC_REGISTRY_DIR = path.resolve(ROOT_DIR, "public/registry");
const COMPONENTS_JSON_DIR = path.resolve(PUBLIC_REGISTRY_DIR, "components");

async function main() {
  console.log("🚀 Generating registry...");

  await fs.ensureDir(COMPONENTS_JSON_DIR);

  const files = await fs.readdir(UI_COMPONENTS_DIR);
  const registryIndex = [];

  for (const file of files) {
    if (file === "index.ts" || file === "utils.ts" || file === "README.md" || !file.endsWith(".tsx")) {
      continue;
    }

    const componentName = file.replace(".tsx", "");
    const filePath = path.join(UI_COMPONENTS_DIR, file);
    const content = await fs.readFile(filePath, "utf-8");

    // Basic dependency detection (can be improved)
    const dependencies = [];
    if (content.includes('from "clsx"')) dependencies.push("clsx");
    if (content.includes('from "tailwind-merge"')) dependencies.push("tailwind-merge");
    if (content.includes('@kobalte/core')) dependencies.push("@kobalte/core");
    if (content.includes('@ensolid/radix')) dependencies.push("@ensolid/radix");
    if (content.includes('lucide-solid')) dependencies.push("lucide-solid");

    const registryDependencies = [];
    // If it imports another local UI component
    const importMatches = content.match(/import.*from "\.\/([^"]*)"/g);
    if (importMatches) {
        importMatches.forEach(match => {
            const depName = match.match(/"\.\/([^"]*)"/)[1];
            if (depName !== "utils" && depName !== "index") {
                registryDependencies.push(depName);
            }
        });
    }

    const componentData = {
      name: componentName,
      type: "components:ui",
      dependencies,
      registryDependencies,
      files: [`${componentName}.tsx`],
    };

    // Save individual component JSON
    await fs.writeJSON(path.join(COMPONENTS_JSON_DIR, `${componentName}.json`), componentData, { spaces: 2 });
    
    // Copy the actual file to registry for download
    await fs.copy(filePath, path.join(PUBLIC_REGISTRY_DIR, `${componentName}.tsx`));

    registryIndex.push({
      name: componentName,
      files: [`${componentName}.tsx`],
    });
  }

  // Save index.json
  await fs.writeJSON(path.join(PUBLIC_REGISTRY_DIR, "index.json"), registryIndex, { spaces: 2 });

  // Also copy utils.ts and ensure it's in the registry
  await fs.copy(path.join(UI_COMPONENTS_DIR, "utils.ts"), path.join(PUBLIC_REGISTRY_DIR, "utils.ts"));

  console.log(`✅ Registry generated with ${registryIndex.length} components.`);
}

main().catch((err) => {
  console.error("❌ Error generating registry:", err);
  process.exit(1);
});
