/**
 * Image 组件 - 移植自 Vercel AI Elements
 * 
 * 用于显示 AI 生成的图片组件
 */

import type { Component, JSX } from "solid-js";
import { splitProps } from "solid-js";
import { cn } from "@/components/ui/utils";
import type { Experimental_GeneratedImage } from "ai";

export type ImageProps = Experimental_GeneratedImage & {
  class?: string;
  alt?: string;
};

export const Image: Component<ImageProps> = (props) => {
  const [local, others] = splitProps(props, [
    "base64",
    "uint8Array",
    "mediaType",
    "class",
    "alt",
  ]);

  return (
    <img
      {...others}
      alt={local.alt}
      class={cn(
        "h-auto max-w-full overflow-hidden rounded-md",
        local.class
      )}
      src={`data:${local.mediaType};base64,${local.base64}`}
    />
  );
};
