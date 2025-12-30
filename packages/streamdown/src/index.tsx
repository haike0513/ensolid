import type { Component, JSX } from "solid-js";
import {
  createContext,
  createEffect,
  createMemo,
  createSignal,
  For,
  Show,
} from "solid-js";
import type { MermaidConfig } from "mermaid";
import { harden } from "rehype-harden";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import remarkCjkFriendly from "remark-cjk-friendly";
import remarkCjkFriendlyGfmStrikethrough from "remark-cjk-friendly-gfm-strikethrough";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remend, { type RemendOptions } from "@ensolid/remend";
import type { BundledTheme } from "shiki";
import type { Pluggable } from "unified";
import { Markdown, type Options } from "./lib/markdown";
import { parseMarkdownIntoBlocks } from "./lib/parse-blocks";
import { cn } from "./lib/utils";

// Regex patterns defined at top level for performance
const MIDDLE_DOLLAR_PATTERN = /[^$]\$[^$]/;
const START_DOLLAR_PATTERN = /^\$[^$]/;
const END_DOLLAR_PATTERN = /[^$]\$$/;

export type { MermaidConfig } from "mermaid";
export type { RemendOptions } from "@ensolid/remend";
export type { BundledLanguageName } from "./lib/code-block/bundled-languages";

export {
  bundledLanguages,
  isBundledLanguage,
} from "./lib/code-block/bundled-languages";
export { parseMarkdownIntoBlocks } from "./lib/parse-blocks";

export type ControlsConfig =
  | boolean
  | {
      table?: boolean;
      code?: boolean;
      mermaid?:
        | boolean
        | {
            download?: boolean;
            copy?: boolean;
            fullscreen?: boolean;
            panZoom?: boolean;
          };
    };

export type MermaidErrorComponentProps = {
  error: string;
  chart: string;
  retry: () => void;
};

export type MermaidOptions = {
  config?: MermaidConfig;
  errorComponent?: Component<MermaidErrorComponentProps>;
};

export type StreamdownProps = Options & {
  mode?: "static" | "streaming";
  BlockComponent?: Component<BlockProps>;
  parseMarkdownIntoBlocksFn?: (markdown: string) => string[];
  parseIncompleteMarkdown?: boolean;
  class?: string;
  shikiTheme?: [BundledTheme, BundledTheme];
  mermaid?: MermaidOptions;
  controls?: ControlsConfig;
  isAnimating?: boolean;
  caret?: keyof typeof carets;
  cdnUrl?: string | null;
  remend?: RemendOptions;
  children?: string;
};

export const defaultRehypePlugins: Record<string, Pluggable> = {
  raw: rehypeRaw,
  sanitize: [rehypeSanitize, {}],
  katex: [rehypeKatex, { errorColor: "var(--color-muted-foreground)" }],
  harden: [
    harden,
    {
      allowedImagePrefixes: ["*"],
      allowedLinkPrefixes: ["*"],
      allowedProtocols: ["*"],
      defaultOrigin: undefined,
      allowDataImages: true,
    },
  ],
} as const;

export const defaultRemarkPlugins: Record<string, Pluggable> = {
  gfm: [remarkGfm, {}],
  math: [remarkMath, { singleDollarTextMath: false }],
  cjkFriendly: [remarkCjkFriendly, {}],
  cjkFriendlyGfmStrikethrough: [remarkCjkFriendlyGfmStrikethrough, {}],
} as const;

// Stable plugin arrays for cache efficiency - created once at module level
const defaultRehypePluginsArray = Object.values(defaultRehypePlugins);
const defaultRemarkPluginsArray = Object.values(defaultRemarkPlugins);

const carets = {
  block: " ▋",
  circle: " ●",
};

// Combined context for better performance
export type StreamdownContextType = {
  shikiTheme: [BundledTheme, BundledTheme];
  controls: ControlsConfig;
  isAnimating: boolean;
  mode: "static" | "streaming";
  mermaid?: MermaidOptions;
  cdnUrl?: string | null;
};

const defaultStreamdownContext: StreamdownContextType = {
  shikiTheme: ["github-light" as BundledTheme, "github-dark" as BundledTheme],
  controls: true,
  isAnimating: false,
  mode: "streaming",
  mermaid: undefined,
  cdnUrl: undefined,
};

export const StreamdownContext = createContext<StreamdownContextType>(
  defaultStreamdownContext
);

type BlockProps = Options & {
  content: string;
  shouldParseIncompleteMarkdown: boolean;
  index: number;
};

export const Block: Component<BlockProps> = (props) => {
  return <Markdown {...props}>{props.content}</Markdown>;
};

const defaultShikiTheme: [BundledTheme, BundledTheme] = [
  "github-light",
  "github-dark",
];

// Helper functions to reduce complexity
const checkKatexPlugin = (
  rehypePlugins: Pluggable[] | null | undefined
): boolean =>
  Array.isArray(rehypePlugins) &&
  rehypePlugins.some((plugin) =>
    Array.isArray(plugin) ? plugin[0] === rehypeKatex : plugin === rehypeKatex
  );

const checkSingleDollarEnabled = (
  remarkPlugins: Pluggable[] | null | undefined
): boolean => {
  if (!Array.isArray(remarkPlugins)) {
    return false;
  }

  const mathPlugin = remarkPlugins.find((plugin) =>
    Array.isArray(plugin) ? plugin[0] === remarkMath : plugin === remarkMath
  );

  if (mathPlugin && Array.isArray(mathPlugin) && mathPlugin[1]) {
    const config = mathPlugin[1] as { singleDollarTextMath?: boolean };
    return config.singleDollarTextMath === true;
  }

  return false;
};

const checkMathSyntax = (
  content: string,
  singleDollarEnabled: boolean
): boolean => {
  const hasDoubleDollar = content.includes("$$");
  const hasSingleDollar =
    singleDollarEnabled &&
    (MIDDLE_DOLLAR_PATTERN.test(content) ||
      START_DOLLAR_PATTERN.test(content) ||
      END_DOLLAR_PATTERN.test(content));
  return hasDoubleDollar || hasSingleDollar;
};

const loadKatexCSS = (): void => {
  // Extract KaTeX version from package.json dependencies
  // For now, use a default version
  const katexCssVersion = "0.16.22";

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = `/cdn/katex/${katexCssVersion}/katex.min.css`;
  document.head.appendChild(link);
};

export const Streamdown: Component<StreamdownProps> = (props) => {
  // In SolidJS, props are accessed directly, not as functions
  const mode = () => props.mode ?? "streaming";
  const shouldParseIncompleteMarkdown = () =>
    props.parseIncompleteMarkdown ?? true;
  const BlockComponent = () => props.BlockComponent ?? Block;
  const parseMarkdownIntoBlocksFn = () =>
    props.parseMarkdownIntoBlocksFn ?? parseMarkdownIntoBlocks;
  const shikiTheme = () => props.shikiTheme ?? defaultShikiTheme;
  const controls = () => props.controls ?? true;
  const isAnimating = () => props.isAnimating ?? false;
  const caret = () => props.caret;
  const cdnUrl = () => props.cdnUrl;
  const mermaid = () => props.mermaid;
  const remendOptions = () => props.remend;
  const children = () => props.children ?? "";
  const className = () => props.class;

  // Apply remend to fix incomplete markdown BEFORE parsing into blocks
  const processedChildren = createMemo(() => {
    const content = children();
    if (typeof content !== "string") {
      return "";
    }
    return mode() === "streaming" && shouldParseIncompleteMarkdown()
      ? remend(content, remendOptions())
      : content;
  });

  const blocks = createMemo(() =>
    parseMarkdownIntoBlocksFn()(processedChildren())
  );

  const [displayBlocks, setDisplayBlocks] = createSignal<string[]>([]);

  // Update display blocks when blocks change - use createEffect for side effects
  createEffect(() => {
    const currentBlocks = blocks();
    if (mode() === "streaming") {
      // Use startTransition equivalent - just update directly for now
      setDisplayBlocks(currentBlocks);
    } else {
      setDisplayBlocks(currentBlocks);
    }
  });

  // Use displayBlocks for rendering
  const blocksToRender = createMemo(() =>
    mode() === "streaming" ? displayBlocks() : blocks()
  );

  // Combined context value
  const contextValue = createMemo<StreamdownContextType>(() => ({
    shikiTheme: shikiTheme(),
    controls: controls(),
    isAnimating: isAnimating(),
    mode: mode(),
    mermaid: mermaid(),
    cdnUrl: cdnUrl(),
  }));

  // Memoize merged components
  const mergedComponents = createMemo(() => ({
    ...props.components,
  }));

  // Only load KaTeX CSS when math syntax is detected in content - use createEffect for side effects
  createEffect(() => {
    const hasKatexPlugin = checkKatexPlugin(props.rehypePlugins);
    if (!hasKatexPlugin) {
      return;
    }

    const singleDollarEnabled = checkSingleDollarEnabled(props.remarkPlugins);
    const content = typeof children() === "string" ? children() : "";
    const hasMathSyntax = checkMathSyntax(content, singleDollarEnabled);

    if (hasMathSyntax && typeof document !== "undefined") {
      loadKatexCSS();
    }
  });

  const style = createMemo(() =>
    caret() && isAnimating()
      ? ({
          "--streamdown-caret": `"${carets[caret()!]}"`,
        } as JSX.CSSProperties)
      : undefined
  );

  // Static mode: simple rendering without streaming features
  return (
    <StreamdownContext.Provider value={contextValue()}>
      <div
        class={cn(
          "space-y-4 whitespace-normal *:first:mt-0 *:last:mb-0",
          caret()
            ? "*:last:after:inline *:last:after:align-baseline *:last:after:content-(--streamdown-caret)"
            : null,
          className()
        )}
        style={style()}
      >
        <Show
          when={mode() === "static"}
          fallback={
            // Streaming mode: parse into blocks - use For component for better performance

            <For each={blocksToRender()}>
              {(block, index) => {
                const BlockComp = BlockComponent();
                return (
                  <BlockComp
                    components={mergedComponents()}
                    content={block}
                    index={index()}
                    rehypePlugins={
                      props.rehypePlugins ?? defaultRehypePluginsArray
                    }
                    remarkPlugins={
                      props.remarkPlugins ?? defaultRemarkPluginsArray
                    }
                    shouldParseIncompleteMarkdown={shouldParseIncompleteMarkdown()}
                    remarkRehypeOptions={props.remarkRehypeOptions}
                  />
                );
              }}
            </For>
          }
        >
          <Markdown
            components={mergedComponents()}
            rehypePlugins={props.rehypePlugins ?? defaultRehypePluginsArray}
            remarkPlugins={props.remarkPlugins ?? defaultRemarkPluginsArray}
            remarkRehypeOptions={props.remarkRehypeOptions}
          >
            {children()}
          </Markdown>
        </Show>
      </div>
    </StreamdownContext.Provider>
  );
};
