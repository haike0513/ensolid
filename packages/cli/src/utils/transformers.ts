import type { Config } from "../types";

/**
 * Transform import paths in component source code
 * Replace registry paths with project-specific aliases
 */
export function transformImportPaths(content: string, config: Config): string {
  let transformed = content;

  // Replace utils import
  // e.g., from "./utils" or from "../lib/utils" -> from "@/lib/utils"
  transformed = transformed.replace(
    /from\s+["']\.\/utils["']/g,
    `from "${config.aliases.utils}"`
  );
  transformed = transformed.replace(
    /from\s+["']\.\.\/lib\/utils["']/g,
    `from "${config.aliases.utils}"`
  );
  transformed = transformed.replace(
    /from\s+["']@\/lib\/utils["']/g,
    `from "${config.aliases.utils}"`
  );

  // Replace UI component imports
  // e.g., from "./button" -> from "@/components/ui/button"
  if (config.aliases.ui) {
    const uiPath = config.aliases.ui;
    // Match relative imports like from "./button" in UI components
    transformed = transformed.replace(
      /from\s+["']\.\/([a-z-]+)["']/g,
      (match, component) => {
        // Only replace if it looks like a UI component import
        if (isUIComponent(component)) {
          return `from "${uiPath}/${component}"`;
        }
        return match;
      }
    );
  }

  // Replace components imports
  // e.g., from "../components/ui/button" -> from "@/components/ui/button"
  if (config.aliases.components) {
    transformed = transformed.replace(
      /from\s+["']\.\.\/components\/([^"']+)["']/g,
      `from "${config.aliases.components}/$1"`
    );
  }

  // Replace lib imports
  if (config.aliases.lib) {
    transformed = transformed.replace(
      /from\s+["']\.\.\/lib\/([^"']+)["']/g,
      `from "${config.aliases.lib}/$1"`
    );
  }

  // Replace hooks imports
  if (config.aliases.hooks) {
    transformed = transformed.replace(
      /from\s+["']\.\.\/hooks\/([^"']+)["']/g,
      `from "${config.aliases.hooks}/$1"`
    );
  }

  return transformed;
}

/**
 * Check if a name looks like a UI component
 */
function isUIComponent(name: string): boolean {
  // Common UI component names
  const uiComponents = [
    "accordion",
    "alert",
    "alert-dialog",
    "aspect-ratio",
    "avatar",
    "badge",
    "button",
    "calendar",
    "card",
    "checkbox",
    "collapsible",
    "command",
    "context-menu",
    "dialog",
    "dropdown-menu",
    "form",
    "hover-card",
    "input",
    "label",
    "menubar",
    "navigation-menu",
    "popover",
    "progress",
    "radio-group",
    "scroll-area",
    "select",
    "separator",
    "sheet",
    "skeleton",
    "slider",
    "switch",
    "table",
    "tabs",
    "textarea",
    "toast",
    "toaster",
    "toggle",
    "toggle-group",
    "toolbar",
    "tooltip",
    "utils",
  ];

  return uiComponents.includes(name.toLowerCase());
}

/**
 * Transform TypeScript to JavaScript (basic conversion)
 */
export function transformTsToJs(content: string): string {
  // Remove type imports
  let transformed = content.replace(/import\s+type\s+\{[^}]+\}\s+from\s+["'][^"']+["'];?\n?/g, "");
  
  // Remove type annotations
  transformed = transformed.replace(/:\s*[A-Z][a-zA-Z<>[\],\s|]+(?=[,)\s=])/g, "");
  
  // Remove generic type parameters
  transformed = transformed.replace(/<[A-Z][a-zA-Z<>[\],\s|]+>/g, "");
  
  // Remove 'as' type assertions
  transformed = transformed.replace(/\s+as\s+[A-Z][a-zA-Z<>[\],\s|]+/g, "");
  
  return transformed;
}

/**
 * Add CSS variables prefix if configured
 */
export function transformCssPrefix(content: string, prefix: string): string {
  if (!prefix) return content;
  
  // Add prefix to CSS class names
  return content.replace(
    /className=\{cn\(([^)]+)\)/g,
    (match, classes) => {
      // This is a simplified version - full implementation would need proper parsing
      return match;
    }
  );
}

/**
 * Resolve the actual file path from an alias path
 */
export function resolveAliasPath(aliasPath: string, config: Config, cwd: string): string {
  const prefix = aliasPath.charAt(0);
  
  if (prefix === "@" || prefix === "~" || prefix === "$") {
    // Parse alias and convert to relative path
    const basePath = aliasPath.startsWith("@/") ? "src" : "";
    return aliasPath.replace(/^[@~$]\//, basePath ? `${basePath}/` : "");
  }
  
  return aliasPath;
}
