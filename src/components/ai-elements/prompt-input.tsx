/**
 * PromptInput 组件 - 移植自 Vercel AI Elements
 * 
 * 一个功能完整的提示输入组件，支持附件、语音输入等功能
 */

import type { Component, JSX } from "solid-js";
import {
  createContext,
  useContext,
  createSignal,
  createEffect,
  createMemo,
  onCleanup,
  splitProps,
  Show,
  For,
} from "solid-js";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/components/ui/utils";
import type { ChatStatus, FileUIPart } from "ai";

// 简单的 ID 生成函数（如果 nanoid 不可用）
function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// 图标组件
const CornerDownLeftIcon = (props: { size?: number; class?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.size || 16}
    height={props.size || 16}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    class={props.class}
  >
    <polyline points="9 10 4 15 9 20" />
    <path d="M20 4v7a4 4 0 0 1-4 4H4" />
  </svg>
);

const Loader2Icon = (props: { size?: number; class?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.size || 16}
    height={props.size || 16}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    class={cn("animate-spin", props.class)}
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

const SquareIcon = (props: { size?: number; class?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.size || 16}
    height={props.size || 16}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    class={props.class}
  >
    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
  </svg>
);

const XIcon = (props: { size?: number; class?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.size || 16}
    height={props.size || 16}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    class={props.class}
  >
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

const ImageIcon = (props: { size?: number; class?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.size || 16}
    height={props.size || 16}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    class={props.class}
  >
    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
    <circle cx="9" cy="9" r="2" />
    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
  </svg>
);

const PaperclipIcon = (props: { size?: number; class?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.size || 16}
    height={props.size || 16}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    class={props.class}
  >
    <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
  </svg>
);

const PlusIcon = (props: { size?: number; class?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.size || 16}
    height={props.size || 16}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    class={props.class}
  >
    <path d="M5 12h14" />
    <path d="M12 5v14" />
  </svg>
);

const MicIcon = (props: { size?: number; class?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.size || 16}
    height={props.size || 16}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    class={props.class}
  >
    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3Z" />
    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
    <line x1="12" x2="12" y1="19" y2="23" />
    <line x1="8" x2="16" y1="23" y2="23" />
  </svg>
);

// ============================================================================
// Provider Context & Types
// ============================================================================

export type AttachmentsContext = {
  files: () => (FileUIPart & { id: string })[];
  add: (files: File[] | FileList) => void;
  remove: (id: string) => void;
  clear: () => void;
  openFileDialog: () => void;
  fileInputRef: () => HTMLInputElement | null;
};

export type TextInputContext = {
  value: () => string;
  setInput: (v: string) => void;
  clear: () => void;
};

export type PromptInputControllerProps = {
  textInput: TextInputContext;
  attachments: AttachmentsContext;
  __registerFileInput: (
    ref: () => HTMLInputElement | null,
    open: () => void
  ) => void;
};

const PromptInputController = createContext<PromptInputControllerProps>();
const ProviderAttachmentsContext = createContext<AttachmentsContext>();

export const usePromptInputController = () => {
  const context = useContext(PromptInputController);
  if (!context) {
    throw new Error(
      "Wrap your component inside <PromptInputProvider> to use usePromptInputController()."
    );
  }
  return context;
};

const useOptionalPromptInputController = () => useContext(PromptInputController);

export const useProviderAttachments = () => {
  const context = useContext(ProviderAttachmentsContext);
  if (!context) {
    throw new Error(
      "Wrap your component inside <PromptInputProvider> to use useProviderAttachments()."
    );
  }
  return context;
};

const useOptionalProviderAttachments = () => useContext(ProviderAttachmentsContext);

export type PromptInputProviderProps = {
  initialInput?: string;
  children?: JSX.Element;
};

export const PromptInputProvider: Component<PromptInputProviderProps> = (props) => {
  const [textInput, setTextInput] = createSignal(props.initialInput || "");
  const clearInput = () => setTextInput("");

  const [attachmentFiles, setAttachmentFiles] = createSignal<
    (FileUIPart & { id: string })[]
  >([]);
  let fileInputRef: HTMLInputElement | null = null;
  let openRef: (() => void) | null = null;

  const add = (files: File[] | FileList) => {
    const incoming = Array.from(files);
    if (incoming.length === 0) {
      return;
    }

    setAttachmentFiles((prev) =>
      prev.concat(
        incoming.map((file) => ({
          id: generateId(),
          type: "file" as const,
          url: URL.createObjectURL(file),
          mediaType: file.type,
          filename: file.name,
        }))
      )
    );
  };

  const remove = (id: string) => {
    setAttachmentFiles((prev) => {
      const found = prev.find((f) => f.id === id);
      if (found?.url) {
        URL.revokeObjectURL(found.url);
      }
      return prev.filter((f) => f.id !== id);
    });
  };

  const clear = () => {
    setAttachmentFiles((prev) => {
      for (const f of prev) {
        if (f.url) {
          URL.revokeObjectURL(f.url);
        }
      }
      return [];
    });
  };

  // Cleanup blob URLs on unmount
  onCleanup(() => {
    for (const f of attachmentFiles()) {
      if (f.url) {
        URL.revokeObjectURL(f.url);
      }
    }
  });

  const openFileDialog = () => {
    openRef?.();
  };

  const attachments: AttachmentsContext = {
    files: attachmentFiles,
    add,
    remove,
    clear,
    openFileDialog,
    fileInputRef: () => fileInputRef,
  };

  const __registerFileInput = (
    ref: () => HTMLInputElement | null,
    open: () => void
  ) => {
    fileInputRef = ref() || null;
    openRef = open;
  };

  const controller: PromptInputControllerProps = {
    textInput: {
      value: textInput,
      setInput: setTextInput,
      clear: clearInput,
    },
    attachments,
    __registerFileInput,
  };

  return (
    <PromptInputController.Provider value={controller}>
      <ProviderAttachmentsContext.Provider value={attachments}>
        {props.children}
      </ProviderAttachmentsContext.Provider>
    </PromptInputController.Provider>
  );
};

// ============================================================================
// Component Context & Hooks
// ============================================================================

const LocalAttachmentsContext = createContext<AttachmentsContext>();

export const usePromptInputAttachments = () => {
  const provider = useOptionalProviderAttachments();
  const local = useContext(LocalAttachmentsContext);
  const context = provider || local;
  if (!context) {
    throw new Error(
      "usePromptInputAttachments must be used within a PromptInput or PromptInputProvider"
    );
  }
  return context;
};

export type PromptInputAttachmentProps = JSX.HTMLAttributes<HTMLDivElement> & {
  data: FileUIPart & { id: string };
};

export const PromptInputAttachment: Component<PromptInputAttachmentProps> = (props) => {
  const attachments = usePromptInputAttachments();
  const [local, others] = splitProps(props, ["data", "class"]);

  const filename = local.data.filename || "";
  const mediaType =
    local.data.mediaType?.startsWith("image/") && local.data.url ? "image" : "file";
  const isImage = mediaType === "image";
  const attachmentLabel = filename || (isImage ? "Image" : "Attachment");

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div
          class={cn(
            "group relative flex h-8 cursor-pointer select-none items-center gap-1.5 rounded-md border border-border px-1.5 font-medium text-sm transition-all hover:bg-accent hover:text-accent-foreground",
            local.class
          )}
          {...others}
        >
          <div class="relative size-5 shrink-0">
            <div class="absolute inset-0 flex size-5 items-center justify-center overflow-hidden rounded bg-background transition-opacity group-hover:opacity-0">
              <Show
                when={isImage}
                fallback={
                  <div class="flex size-5 items-center justify-center text-muted-foreground">
                    <PaperclipIcon size={12} />
                  </div>
                }
              >
                <img
                  alt={filename || "attachment"}
                  class="size-5 object-cover"
                  height={20}
                  src={local.data.url}
                  width={20}
                />
              </Show>
            </div>
            <Button
              aria-label="Remove attachment"
              class="absolute inset-0 size-5 cursor-pointer rounded p-0 opacity-0 transition-opacity group-hover:pointer-events-auto group-hover:opacity-100 [&>svg]:size-2.5"
              onClick={(e) => {
                e.stopPropagation();
                attachments.remove(local.data.id);
              }}
              type="button"
              variant="ghost"
            >
              <XIcon />
              <span class="sr-only">Remove</span>
            </Button>
          </div>
          <span class="flex-1 truncate">{attachmentLabel}</span>
        </div>
      </HoverCardTrigger>
      <HoverCardContent class="w-auto p-2">
        <div class="w-auto space-y-3">
          <Show when={isImage}>
            <div class="flex max-h-96 w-96 items-center justify-center overflow-hidden rounded-md border">
              <img
                alt={filename || "attachment preview"}
                class="max-h-full max-w-full object-contain"
                height={384}
                src={local.data.url}
                width={448}
              />
            </div>
          </Show>
          <div class="flex items-center gap-2.5">
            <div class="min-w-0 flex-1 space-y-1 px-0.5">
              <h4 class="truncate font-semibold text-sm leading-none">
                {filename || (isImage ? "Image" : "Attachment")}
              </h4>
              <Show when={local.data.mediaType}>
                <p class="truncate font-mono text-muted-foreground text-xs">
                  {local.data.mediaType}
                </p>
              </Show>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export type PromptInputAttachmentsProps = Omit<
  JSX.HTMLAttributes<HTMLDivElement>,
  "children"
> & {
  children: (attachment: FileUIPart & { id: string }) => JSX.Element;
};

export const PromptInputAttachments: Component<PromptInputAttachmentsProps> = (props) => {
  const attachments = usePromptInputAttachments();
  const [local, others] = splitProps(props, ["children", "class"]);

  if (attachments.files().length === 0) {
    return null;
  }

  return (
    <div
      class={cn("flex flex-wrap items-center gap-2 p-3 w-full", local.class)}
      {...others}
    >
      <For each={attachments.files()}>
        {(file) => local.children(file)}
      </For>
    </div>
  );
};

export type PromptInputActionAddAttachmentsProps = JSX.HTMLAttributes<HTMLDivElement> & {
  label?: string;
};

export const PromptInputActionAddAttachments: Component<PromptInputActionAddAttachmentsProps> = (
  props
) => {
  const attachments = usePromptInputAttachments();
  const [local, others] = splitProps(props, ["label", "onClick"]);

  return (
    <DropdownMenuItem
      {...others}
      onSelect={(e) => {
        e.preventDefault();
        attachments.openFileDialog();
      }}
    >
      <ImageIcon size={16} class="mr-2" /> {local.label || "Add photos or files"}
    </DropdownMenuItem>
  );
};

export type PromptInputMessage = {
  text: string;
  files: FileUIPart[];
};

export type PromptInputProps = Omit<
  JSX.FormHTMLAttributes<HTMLFormElement>,
  "onSubmit" | "onError"
> & {
  accept?: string;
  multiple?: boolean;
  globalDrop?: boolean;
  syncHiddenInput?: boolean;
  maxFiles?: number;
  maxFileSize?: number;
  onError?: (err: {
    code: "max_files" | "max_file_size" | "accept";
    message: string;
  }) => void;
  onSubmit: (
    message: PromptInputMessage,
    event: Event & { currentTarget: HTMLFormElement }
  ) => void | Promise<void>;
};

export const PromptInput: Component<PromptInputProps> = (props) => {
  const controller = useOptionalPromptInputController();
  const usingProvider = !!controller;

  let inputRef: HTMLInputElement | undefined;
  let formRef: HTMLFormElement | undefined;

  const [items, setItems] = createSignal<(FileUIPart & { id: string })[]>([]);
  const files = createMemo(() =>
    usingProvider ? controller!.attachments.files() : items()
  );

  const openFileDialogLocal = () => {
    inputRef?.click();
  };

  const matchesAccept = (f: File) => {
    if (!props.accept || props.accept.trim() === "") {
      return true;
    }

    const patterns = props.accept
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    return patterns.some((pattern) => {
      if (pattern.endsWith("/*")) {
        const prefix = pattern.slice(0, -1);
        return f.type.startsWith(prefix);
      }
      return f.type === pattern;
    });
  };

  const addLocal = (fileList: File[] | FileList) => {
    const incoming = Array.from(fileList);
    const accepted = incoming.filter((f) => matchesAccept(f));
    if (incoming.length && accepted.length === 0) {
      props.onError?.({
        code: "accept",
        message: "No files match the accepted types.",
      });
      return;
    }
    const withinSize = (f: File) =>
      props.maxFileSize ? f.size <= props.maxFileSize : true;
    const sized = accepted.filter(withinSize);
    if (accepted.length > 0 && sized.length === 0) {
      props.onError?.({
        code: "max_file_size",
        message: "All files exceed the maximum size.",
      });
      return;
    }

    setItems((prev) => {
      const capacity =
        typeof props.maxFiles === "number"
          ? Math.max(0, props.maxFiles - prev.length)
          : undefined;
      const capped =
        typeof capacity === "number" ? sized.slice(0, capacity) : sized;
      if (typeof capacity === "number" && sized.length > capacity) {
        props.onError?.({
          code: "max_files",
          message: "Too many files. Some were not added.",
        });
      }
      const next: (FileUIPart & { id: string })[] = [];
      for (const file of capped) {
        next.push({
          id: generateId(),
          type: "file",
          url: URL.createObjectURL(file),
          mediaType: file.type,
          filename: file.name,
        });
      }
      return prev.concat(next);
    });
  };

  const removeLocal = (id: string) =>
    setItems((prev) => {
      const found = prev.find((file) => file.id === id);
      if (found?.url) {
        URL.revokeObjectURL(found.url);
      }
      return prev.filter((file) => file.id !== id);
    });

  const clearLocal = () =>
    setItems((prev) => {
      for (const file of prev) {
        if (file.url) {
          URL.revokeObjectURL(file.url);
        }
      }
      return [];
    });

  const add = usingProvider ? controller!.attachments.add : addLocal;
  const remove = usingProvider ? controller!.attachments.remove : removeLocal;
  const clear = usingProvider ? controller!.attachments.clear : clearLocal;
  const openFileDialog = usingProvider
    ? controller!.attachments.openFileDialog
    : openFileDialogLocal;

  createEffect(() => {
    if (!usingProvider) return;
    controller!.__registerFileInput(
      () => inputRef || null,
      () => inputRef?.click()
    );
  });

  createEffect(() => {
    if (props.syncHiddenInput && inputRef && files().length === 0) {
      inputRef.value = "";
    }
  });

  // Drag and drop handlers
  createEffect(() => {
    const form = formRef;
    if (!form) return;
    if (props.globalDrop) return;

    const onDragOver = (e: DragEvent) => {
      if (e.dataTransfer?.types?.includes("Files")) {
        e.preventDefault();
      }
    };
    const onDrop = (e: DragEvent) => {
      if (e.dataTransfer?.types?.includes("Files")) {
        e.preventDefault();
      }
      if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
        add(e.dataTransfer.files);
      }
    };
    form.addEventListener("dragover", onDragOver);
    form.addEventListener("drop", onDrop);
    onCleanup(() => {
      form.removeEventListener("dragover", onDragOver);
      form.removeEventListener("drop", onDrop);
    });
  });

  createEffect(() => {
    if (!props.globalDrop) return;

    const onDragOver = (e: DragEvent) => {
      if (e.dataTransfer?.types?.includes("Files")) {
        e.preventDefault();
      }
    };
    const onDrop = (e: DragEvent) => {
      if (e.dataTransfer?.types?.includes("Files")) {
        e.preventDefault();
      }
      if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
        add(e.dataTransfer.files);
      }
    };
    document.addEventListener("dragover", onDragOver);
    document.addEventListener("drop", onDrop);
    onCleanup(() => {
      document.removeEventListener("dragover", onDragOver);
      document.removeEventListener("drop", onDrop);
    });
  });

  onCleanup(() => {
    if (!usingProvider) {
      for (const f of files()) {
        if (f.url) URL.revokeObjectURL(f.url);
      }
    }
  });

  const handleChange = (event: Event) => {
    const target = event.currentTarget as HTMLInputElement;
    if (target.files) {
      add(target.files);
    }
    target.value = "";
  };

  const convertBlobUrlToDataUrl = async (
    url: string
  ): Promise<string | null> => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = () => resolve(null);
        reader.readAsDataURL(blob);
      });
    } catch {
      return null;
    }
  };

  const ctx: AttachmentsContext = {
    files: () => files().map((item) => ({ ...item, id: item.id })),
    add,
    remove,
    clear,
    openFileDialog,
    fileInputRef: () => inputRef || null,
  };

  const handleSubmit = (event: Event & { currentTarget: HTMLFormElement }) => {
    event.preventDefault();

    const form = event.currentTarget;
    const text = usingProvider
      ? controller!.textInput.value()
      : (() => {
          const formData = new FormData(form);
          return (formData.get("message") as string) || "";
        })();

    if (!usingProvider) {
      form.reset();
    }

    Promise.all(
      files().map(async ({ id, ...item }) => {
        if (item.url && item.url.startsWith("blob:")) {
          const dataUrl = await convertBlobUrlToDataUrl(item.url);
          return {
            ...item,
            url: dataUrl ?? item.url,
          };
        }
        return item;
      })
    )
      .then((convertedFiles: FileUIPart[]) => {
        try {
          const result = props.onSubmit({ text, files: convertedFiles }, event);

          if (result instanceof Promise) {
            result
              .then(() => {
                clear();
                if (usingProvider) {
                  controller!.textInput.clear();
                }
              })
              .catch(() => {
                // Don't clear on error
              });
          } else {
            clear();
            if (usingProvider) {
              controller!.textInput.clear();
            }
          }
        } catch {
          // Don't clear on error
        }
      })
      .catch(() => {
        // Don't clear on error
      });
  };

  const [local, others] = splitProps(props, [
    "class",
    "accept",
    "multiple",
    "globalDrop",
    "syncHiddenInput",
    "maxFiles",
    "maxFileSize",
    "onError",
    "onSubmit",
    "children",
  ]);

  const inner = (
    <>
      <input
        accept={local.accept}
        aria-label="Upload files"
        class="hidden"
        multiple={local.multiple}
        onChange={handleChange}
        ref={inputRef}
        title="Upload files"
        type="file"
      />
      <form
        class={cn("w-full", local.class)}
        onSubmit={handleSubmit}
        ref={formRef}
        {...others}
      >
        <div class="overflow-hidden flex flex-col gap-2">{local.children}</div>
      </form>
    </>
  );

  return usingProvider ? (
    inner
  ) : (
    <LocalAttachmentsContext.Provider value={ctx}>
      {inner}
    </LocalAttachmentsContext.Provider>
  );
};

export type PromptInputBodyProps = JSX.HTMLAttributes<HTMLDivElement>;

export const PromptInputBody: Component<PromptInputBodyProps> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return <div class={cn("contents", local.class)} {...others} />;
};

export type PromptInputTextareaProps = JSX.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const PromptInputTextarea: Component<PromptInputTextareaProps> = (props) => {
  const controller = useOptionalPromptInputController();
  const attachments = usePromptInputAttachments();
  const [isComposing, setIsComposing] = createSignal(false);
  const [local, others] = splitProps(props, [
    "onChange",
    "class",
    "placeholder",
    "onCompositionStart",
    "onCompositionEnd",
    "onKeyDown",
    "onPaste",
  ]);

  const handleKeyDown: JSX.EventHandler<HTMLTextAreaElement, KeyboardEvent> = (e) => {
    if (e.key === "Enter") {
      if (isComposing()) {
        return;
      }
      if (e.shiftKey) {
        return;
      }
      e.preventDefault();

      const form = e.currentTarget.form;
      const submitButton = form?.querySelector(
        'button[type="submit"]'
      ) as HTMLButtonElement | null;
      if (submitButton?.disabled) {
        return;
      }

      form?.requestSubmit();
    }

    if (
      e.key === "Backspace" &&
      e.currentTarget.value === "" &&
      attachments.files().length > 0
    ) {
      e.preventDefault();
      const lastAttachment = attachments.files()[attachments.files().length - 1];
      if (lastAttachment) {
        attachments.remove(lastAttachment.id);
      }
    }

    if (local.onKeyDown && typeof local.onKeyDown === "function") {
      (local.onKeyDown as any)(e);
    }
  };

  const handlePaste: JSX.EventHandler<HTMLTextAreaElement, ClipboardEvent> = (event) => {
    const items = event.clipboardData?.items;

    if (!items) {
      return;
    }

    const fileList: File[] = [];

    for (const item of items) {
      if (item.kind === "file") {
        const file = item.getAsFile();
        if (file) {
          fileList.push(file);
        }
      }
    }

    if (fileList.length > 0) {
      event.preventDefault();
      attachments.add(fileList);
    }

    if (local.onPaste && typeof local.onPaste === "function") {
      (local.onPaste as any)(event);
    }
  };

  const controlledProps = controller
    ? {
        value: controller.textInput.value(),
        onInput: (e: Event) => {
          const target = e.currentTarget as HTMLTextAreaElement;
          controller.textInput.setInput(target.value);
          if (local.onChange && typeof local.onChange === "function") {
            (local.onChange as any)(e);
          }
        },
      }
    : {
        onChange: local.onChange,
      };

  return (
    <Textarea
      class={cn("field-sizing-content max-h-48 min-h-16 resize-none", local.class)}
      name="message"
      onCompositionEnd={(e) => {
        setIsComposing(false);
        if (local.onCompositionEnd && typeof local.onCompositionEnd === "function") {
          (local.onCompositionEnd as any)(e);
        }
      }}
      onCompositionStart={(e) => {
        setIsComposing(true);
        if (local.onCompositionStart && typeof local.onCompositionStart === "function") {
          (local.onCompositionStart as any)(e);
        }
      }}
      onKeyDown={handleKeyDown}
      onPaste={handlePaste}
      placeholder={local.placeholder || "What would you like to know?"}
      {...others}
      {...controlledProps}
    />
  );
};

export type PromptInputHeaderProps = JSX.HTMLAttributes<HTMLDivElement>;

export const PromptInputHeader: Component<PromptInputHeaderProps> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <div class={cn("order-first flex-wrap gap-1 flex items-center", local.class)} {...others} />
  );
};

export type PromptInputFooterProps = JSX.HTMLAttributes<HTMLDivElement>;

export const PromptInputFooter: Component<PromptInputFooterProps> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <div class={cn("justify-between gap-1 flex items-center", local.class)} {...others} />
  );
};

export type PromptInputToolsProps = JSX.HTMLAttributes<HTMLDivElement>;

export const PromptInputTools: Component<PromptInputToolsProps> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return <div class={cn("flex items-center gap-1", local.class)} {...others} />;
};

export type PromptInputButtonProps = JSX.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon" | "icon-sm";
};

export const PromptInputButton: Component<PromptInputButtonProps> = (props) => {
  const [local, others] = splitProps(props, ["variant", "size", "class", "children"]);
  const newSize = local.size ?? (Array.isArray(local.children) && local.children.length > 1 ? "sm" : "icon");

  return (
    <Button
      class={cn(local.class)}
      size={newSize === "icon-sm" ? "icon" : newSize}
      type="button"
      variant={local.variant || "ghost"}
      {...others}
    >
      {local.children}
    </Button>
  );
};

export type PromptInputActionMenuProps = JSX.HTMLAttributes<HTMLDivElement>;

export const PromptInputActionMenu: Component<PromptInputActionMenuProps> = (props) => (
  <DropdownMenu {...props} />
);

export type PromptInputActionMenuTriggerProps = PromptInputButtonProps;

export const PromptInputActionMenuTrigger: Component<PromptInputActionMenuTriggerProps> = (
  props
) => {
  const [local, others] = splitProps(props, ["class", "children"]);
  return (
    <DropdownMenuTrigger asChild>
      <PromptInputButton class={local.class} {...others}>
        {local.children ?? <PlusIcon size={16} />}
      </PromptInputButton>
    </DropdownMenuTrigger>
  );
};

export type PromptInputActionMenuContentProps = JSX.HTMLAttributes<HTMLDivElement>;

export const PromptInputActionMenuContent: Component<PromptInputActionMenuContentProps> = (
  props
) => {
  const [local, others] = splitProps(props, ["class"]);
  return <DropdownMenuContent class={cn(local.class)} {...others} />;
};

export type PromptInputActionMenuItemProps = JSX.HTMLAttributes<HTMLDivElement>;

export const PromptInputActionMenuItem: Component<PromptInputActionMenuItemProps> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return <DropdownMenuItem class={cn(local.class)} {...others} />;
};

export type PromptInputSubmitProps = JSX.ButtonHTMLAttributes<HTMLButtonElement> & {
  status?: ChatStatus;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon" | "icon-sm";
};

export const PromptInputSubmit: Component<PromptInputSubmitProps> = (props) => {
  const [local, others] = splitProps(props, ["status", "variant", "size", "class", "children"]);
  
  let Icon: JSX.Element = <CornerDownLeftIcon size={16} />;

  if (local.status === "submitted") {
    Icon = <Loader2Icon size={16} />;
  } else if (local.status === "streaming") {
    Icon = <SquareIcon size={16} />;
  } else if (local.status === "error") {
    Icon = <XIcon size={16} />;
  }

  return (
    <Button
      aria-label="Submit"
      class={cn(local.class)}
      size={local.size === "icon-sm" ? "icon" : local.size || "icon"}
      type="submit"
      variant={local.variant || "default"}
      {...others}
    >
      {local.children ?? Icon}
    </Button>
  );
};

// 语音输入相关类型和组件（简化版，需要浏览器支持）
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onresult: ((this: SpeechRecognition, ev: any) => any) | null;
  onerror: ((this: SpeechRecognition, ev: any) => any) | null;
}

declare global {
  interface Window {
    SpeechRecognition?: {
      new (): SpeechRecognition;
    };
    webkitSpeechRecognition?: {
      new (): SpeechRecognition;
    };
  }
}

export type PromptInputSpeechButtonProps = PromptInputButtonProps & {
  textareaRef?: () => HTMLTextAreaElement | null;
  onTranscriptionChange?: (text: string) => void;
};

export const PromptInputSpeechButton: Component<PromptInputSpeechButtonProps> = (props) => {
  const [isListening, setIsListening] = createSignal(false);
  const [recognition, setRecognition] = createSignal<SpeechRecognition | null>(null);
  let recognitionRef: SpeechRecognition | null = null;
  const [local, others] = splitProps(props, [
    "class",
    "textareaRef",
    "onTranscriptionChange",
  ]);

  createEffect(() => {
    if (
      typeof window !== "undefined" &&
      ("SpeechRecognition" in window || "webkitSpeechRecognition" in window)
    ) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) return;
      
      const speechRecognition = new SpeechRecognition();

      speechRecognition.continuous = true;
      speechRecognition.interimResults = true;
      speechRecognition.lang = "en-US";

      speechRecognition.onstart = () => {
        setIsListening(true);
      };

      speechRecognition.onend = () => {
        setIsListening(false);
      };

      speechRecognition.onresult = (event: any) => {
        let finalTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            finalTranscript += result[0]?.transcript ?? "";
          }
        }

        if (finalTranscript && local.textareaRef?.()) {
          const textarea = local.textareaRef();
          if (textarea) {
            const currentValue = textarea.value;
            const newValue =
              currentValue + (currentValue ? " " : "") + finalTranscript;

            textarea.value = newValue;
            textarea.dispatchEvent(new Event("input", { bubbles: true }));
            local.onTranscriptionChange?.(newValue);
          }
        }
      };

      speechRecognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };

      recognitionRef = speechRecognition;
      setRecognition(speechRecognition);
    }

    onCleanup(() => {
      if (recognitionRef) {
        recognitionRef.stop();
      }
    });
  });

  const toggleListening = () => {
    const rec = recognition();
    if (!rec) {
      return;
    }

    if (isListening()) {
      rec.stop();
    } else {
      rec.start();
    }
  };

  return (
    <PromptInputButton
      class={cn(
        "relative transition-all duration-200",
        isListening() && "animate-pulse bg-accent text-accent-foreground",
        local.class
      )}
      disabled={!recognition()}
      onClick={toggleListening}
      {...others}
    >
      <MicIcon size={16} />
    </PromptInputButton>
  );
};

// Select 相关组件（简化版，直接使用现有的 Select 组件）
export type PromptInputSelectProps = JSX.HTMLAttributes<HTMLDivElement>;

export const PromptInputSelect: Component<PromptInputSelectProps> = (props) => (
  <Select {...props} />
);

export type PromptInputSelectTriggerProps = JSX.HTMLAttributes<HTMLButtonElement>;

export const PromptInputSelectTrigger: Component<PromptInputSelectTriggerProps> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <SelectTrigger
      class={cn(
        "border-none bg-transparent font-medium text-muted-foreground shadow-none transition-colors",
        "hover:bg-accent hover:text-foreground aria-expanded:bg-accent aria-expanded:text-foreground",
        local.class
      )}
      {...others}
    />
  );
};

export type PromptInputSelectContentProps = JSX.HTMLAttributes<HTMLDivElement>;

export const PromptInputSelectContent: Component<PromptInputSelectContentProps> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return <SelectContent class={cn(local.class)} {...others} />;
};

export type PromptInputSelectItemProps = JSX.HTMLAttributes<HTMLDivElement> & {
  value?: string;
};

export const PromptInputSelectItem: Component<PromptInputSelectItemProps> = (props) => {
  const [local, others] = splitProps(props, ["class", "value"]);
  return <SelectItem value={local.value || ""} class={cn(local.class)} {...others} />;
};

export type PromptInputSelectValueProps = JSX.HTMLAttributes<HTMLSpanElement>;

export const PromptInputSelectValue: Component<PromptInputSelectValueProps> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return <SelectValue class={cn(local.class)} {...others} />;
};

// HoverCard 相关组件（直接使用现有的）
export type PromptInputHoverCardProps = JSX.HTMLAttributes<HTMLDivElement> & {
  openDelay?: number;
  closeDelay?: number;
};

export const PromptInputHoverCard: Component<PromptInputHoverCardProps> = (props) => {
  const [local, others] = splitProps(props, ["openDelay", "closeDelay"]);
  return (
    <HoverCard openDelay={local.openDelay || 0} closeDelay={local.closeDelay || 0} {...others} />
  );
};

export type PromptInputHoverCardTriggerProps = JSX.HTMLAttributes<HTMLDivElement>;

export const PromptInputHoverCardTrigger: Component<PromptInputHoverCardTriggerProps> = (
  props
) => <HoverCardTrigger {...props} />;

export type PromptInputHoverCardContentProps = JSX.HTMLAttributes<HTMLDivElement> & {
  align?: "start" | "center" | "end";
};

export const PromptInputHoverCardContent: Component<PromptInputHoverCardContentProps> = (
  props
) => {
  const [local, others] = splitProps(props, ["align", "class"]);
  return <HoverCardContent class={cn(local.class)} {...others} />;
};

// Tabs 相关组件（简化版）
export type PromptInputTabsListProps = JSX.HTMLAttributes<HTMLDivElement>;

export const PromptInputTabsList: Component<PromptInputTabsListProps> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return <div class={cn(local.class)} {...others} />;
};

export type PromptInputTabProps = JSX.HTMLAttributes<HTMLDivElement>;

export const PromptInputTab: Component<PromptInputTabProps> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return <div class={cn(local.class)} {...others} />;
};

export type PromptInputTabLabelProps = JSX.HTMLAttributes<HTMLHeadingElement>;

export const PromptInputTabLabel: Component<PromptInputTabLabelProps> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <h3
      class={cn("mb-2 px-3 font-medium text-muted-foreground text-xs", local.class)}
      {...others}
    />
  );
};

export type PromptInputTabBodyProps = JSX.HTMLAttributes<HTMLDivElement>;

export const PromptInputTabBody: Component<PromptInputTabBodyProps> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return <div class={cn("space-y-1", local.class)} {...others} />;
};

export type PromptInputTabItemProps = JSX.HTMLAttributes<HTMLDivElement>;

export const PromptInputTabItem: Component<PromptInputTabItemProps> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <div
      class={cn("flex items-center gap-2 px-3 py-2 text-xs hover:bg-accent", local.class)}
      {...others}
    />
  );
};
