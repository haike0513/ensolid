import {
  Component,
  createContext,
  createEffect,
  createSignal,
  onCleanup,
  onMount,
  Show,
  splitProps,
  useContext,
} from "solid-js";
import { Portal } from "solid-js/web";
import { isServer } from "solid-js/web";
import type { JSX } from "solid-js";

interface DialogContextValue {
  open: () => boolean;
  setOpen: (open: boolean) => void;
  modal: boolean;
}

const DialogContext = createContext<DialogContextValue>();

export const useDialogContext = () => {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error("Dialog components must be used within Dialog");
  }
  return context;
};

export interface DialogProps extends JSX.HTMLAttributes<HTMLDivElement> {
  /**
   * 是否打开
   */
  open?: boolean;
  /**
   * 默认打开状态
   */
  defaultOpen?: boolean;
  /**
   * 打开状态变化回调
   */
  onOpenChange?: (open: boolean) => void;
  /**
   * 是否模态对话框
   * @default true
   */
  modal?: boolean;
  /**
   * 子元素
   */
  children?: JSX.Element;
}

const DialogBase: Component<DialogProps> = (props) => {
  const [local] = splitProps(props, [
    "open",
    "defaultOpen",
    "onOpenChange",
    "modal",
    "class",
    "children",
  ]);

  const [internalOpen, setInternalOpen] = createSignal(
    local.open ?? local.defaultOpen ?? false,
  );

  const isControlled = () => local.open !== undefined;
  const open = () => (isControlled() ? local.open! : internalOpen());

  const handleOpenChange = (newOpen: boolean) => {
    if (!isControlled()) {
      setInternalOpen(newOpen);
    }
    local.onOpenChange?.(newOpen);
  };

  // ESC 键关闭
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape" && open()) {
      handleOpenChange(false);
    }
  };

  onMount(() => {
    if (!isServer && open()) {
      document.addEventListener("keydown", handleKeyDown);
      // 防止背景滚动
      document.body.style.overflow = "hidden";
    }
  });

  createEffect(() => {
    if (!isServer) {
      if (open()) {
        document.addEventListener("keydown", handleKeyDown);
        document.body.style.overflow = "hidden";
      } else {
        document.removeEventListener("keydown", handleKeyDown);
        document.body.style.overflow = "";
      }
    }
  });

  onCleanup(() => {
    if (!isServer) {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    }
  });

  const contextValue: DialogContextValue = {
    open,
    setOpen: handleOpenChange,
    modal: local.modal ?? true,
  };

  return (
    <DialogContext.Provider value={contextValue}>
      {local.children}
    </DialogContext.Provider>
  );
};

export interface DialogComponent extends Component<DialogProps> {
  Trigger: Component<DialogTriggerProps>;
  Overlay: Component<DialogOverlayProps>;
  Content: Component<DialogContentProps>;
  Title: Component<DialogTitleProps>;
  Description: Component<DialogDescriptionProps>;
  Close: Component<DialogCloseProps>;
}

export const Dialog = Object.assign(DialogBase, {
  Trigger: null as unknown as Component<DialogTriggerProps>,
  Overlay: null as unknown as Component<DialogOverlayProps>,
  Content: null as unknown as Component<DialogContentProps>,
  Title: null as unknown as Component<DialogTitleProps>,
  Description: null as unknown as Component<DialogDescriptionProps>,
  Close: null as unknown as Component<DialogCloseProps>,
}) as DialogComponent;

export interface DialogTriggerProps
  extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * 子元素
   */
  children?: JSX.Element;
  /**
   * 对话框实例（通过 asChild 模式传递）
   */
  asChild?: boolean;
}

export const DialogTrigger: Component<DialogTriggerProps> = (props) => {
  const [local, others] = splitProps(props, [
    "children",
    "asChild",
    "class",
    "onClick",
  ]);
  const context = useDialogContext();

  const handleClick: JSX.EventHandler<HTMLButtonElement, MouseEvent> = (e) => {
    if (typeof local.onClick === "function") {
      local.onClick(e);
    }
    context.setOpen(true);
  };

  return (
    <button type="button" class={local.class} onClick={handleClick} {...others}>
      {local.children}
    </button>
  );
};

export interface DialogContentProps extends JSX.HTMLAttributes<HTMLDivElement> {
  /**
   * 子元素
   */
  children?: JSX.Element;
}

export interface DialogOverlayProps extends JSX.HTMLAttributes<HTMLDivElement> {
  /**
   * 子元素
   */
  children?: JSX.Element;
}

export const DialogOverlay: Component<DialogOverlayProps> = (props) => {
  const [local, others] = splitProps(props, ["children", "class", "onClick"]);
  const context = useDialogContext();

  const handleClick: JSX.EventHandler<HTMLDivElement, MouseEvent> = (e) => {
    if (typeof local.onClick === "function") {
      local.onClick(e);
    }
    // 点击遮罩层关闭对话框
    if (e.target === e.currentTarget && context.modal) {
      context.setOpen(false);
    }
  };

  return (
    <div
      class={local.class}
      data-state={context.open() ? "open" : "closed"}
      onClick={handleClick}
      {...others}
    >
      {local.children}
    </div>
  );
};

export const DialogContent: Component<DialogContentProps> = (props) => {
  const [local, others] = splitProps(props, ["children", "class"]);
  const context = useDialogContext();

  return (
    <Show when={context.open()}>
      <Portal mount={!isServer ? document.body : undefined}>
        <DialogOverlay class="fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <div
          class={local.class}
          role="dialog"
          aria-modal={context.modal}
          data-state={context.open() ? "open" : "closed"}
          {...others}
        >
          {local.children}
        </div>
      </Portal>
    </Show>
  );
};

export interface DialogTitleProps
  extends JSX.HTMLAttributes<HTMLHeadingElement> {
  /**
   * 标题文本
   */
  children?: JSX.Element;
}

export const DialogTitle: Component<DialogTitleProps> = (props) => {
  const [local, others] = splitProps(props, ["children", "class"]);

  return (
    <h2 class={local.class} {...others}>
      {local.children}
    </h2>
  );
};

export interface DialogDescriptionProps
  extends JSX.HTMLAttributes<HTMLParagraphElement> {
  /**
   * 描述文本
   */
  children?: JSX.Element;
}

export const DialogDescription: Component<DialogDescriptionProps> = (props) => {
  const [local, others] = splitProps(props, ["children", "class"]);

  return (
    <p class={local.class} {...others}>
      {local.children}
    </p>
  );
};

export interface DialogCloseProps
  extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * 子元素
   */
  children?: JSX.Element;
}

export const DialogClose: Component<DialogCloseProps> = (props) => {
  const [local, others] = splitProps(props, ["children", "class", "onClick"]);
  const context = useDialogContext();

  const handleClick: JSX.EventHandler<HTMLButtonElement, MouseEvent> = (e) => {
    if (typeof local.onClick === "function") {
      local.onClick(e);
    }
    context.setOpen(false);
  };

  return (
    <button type="button" class={local.class} onClick={handleClick} {...others}>
      {local.children}
    </button>
  );
};

Dialog.Trigger = DialogTrigger;
Dialog.Overlay = DialogOverlay;
Dialog.Content = DialogContent;
Dialog.Title = DialogTitle;
Dialog.Description = DialogDescription;
Dialog.Close = DialogClose;
