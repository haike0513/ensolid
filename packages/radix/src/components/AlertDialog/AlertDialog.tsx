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

interface AlertDialogContextValue {
  open: () => boolean;
  setOpen: (open: boolean) => void;
}

const AlertDialogContext = createContext<AlertDialogContextValue>();

export const useAlertDialogContext = () => {
  const context = useContext(AlertDialogContext);
  if (!context) {
    throw new Error("AlertDialog components must be used within AlertDialog");
  }
  return context;
};

export interface AlertDialogProps extends JSX.HTMLAttributes<HTMLDivElement> {
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
   * 子元素
   */
  children?: JSX.Element;
}

const AlertDialogBase: Component<AlertDialogProps> = (props) => {
  const [local] = splitProps(props, [
    "open",
    "defaultOpen",
    "onOpenChange",
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

  const contextValue: AlertDialogContextValue = {
    open,
    setOpen: handleOpenChange,
  };

  return (
    <AlertDialogContext.Provider value={contextValue}>
      {local.children}
    </AlertDialogContext.Provider>
  );
};

export interface AlertDialogComponent extends Component<AlertDialogProps> {
  Trigger: Component<AlertDialogTriggerProps>;
  Overlay: Component<AlertDialogOverlayProps>;
  Content: Component<AlertDialogContentProps>;
  Title: Component<AlertDialogTitleProps>;
  Description: Component<AlertDialogDescriptionProps>;
  Action: Component<AlertDialogActionProps>;
  Cancel: Component<AlertDialogCancelProps>;
}

export const AlertDialog = Object.assign(AlertDialogBase, {
  Trigger: null as unknown as Component<AlertDialogTriggerProps>,
  Overlay: null as unknown as Component<AlertDialogOverlayProps>,
  Content: null as unknown as Component<AlertDialogContentProps>,
  Title: null as unknown as Component<AlertDialogTitleProps>,
  Description: null as unknown as Component<AlertDialogDescriptionProps>,
  Action: null as unknown as Component<AlertDialogActionProps>,
  Cancel: null as unknown as Component<AlertDialogCancelProps>,
}) as AlertDialogComponent;

export interface AlertDialogTriggerProps
  extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * 子元素
   */
  children?: JSX.Element;
  /**
   * 是否作为子元素传递
   */
  asChild?: boolean;
}

export const AlertDialogTrigger: Component<AlertDialogTriggerProps> = (
  props,
) => {
  const [local, others] = splitProps(props, [
    "children",
    "asChild",
    "class",
    "onClick",
  ]);
  const context = useAlertDialogContext();

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

export interface AlertDialogContentProps
  extends JSX.HTMLAttributes<HTMLDivElement> {
  /**
   * 子元素
   */
  children?: JSX.Element;
}

export interface AlertDialogOverlayProps
  extends JSX.HTMLAttributes<HTMLDivElement> {
  /**
   * 子元素
   */
  children?: JSX.Element;
}

export const AlertDialogOverlay: Component<AlertDialogOverlayProps> = (
  props,
) => {
  const [local, others] = splitProps(props, ["children", "class", "onClick"]);
  const context = useAlertDialogContext();

  const handleClick: JSX.EventHandler<HTMLDivElement, MouseEvent> = (e) => {
    if (typeof local.onClick === "function") {
      local.onClick(e);
    }
    // AlertDialog 不允许点击遮罩层关闭
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

export const AlertDialogContent: Component<AlertDialogContentProps> = (
  props,
) => {
  const [local, others] = splitProps(props, ["class", "children"] as const);
  const context = useAlertDialogContext();

  return (
    <Show when={context.open()}>
      <Portal mount={!isServer ? document.body : undefined}>
        <AlertDialogOverlay class="fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <div
          class={local.class}
          role="alertdialog"
          aria-modal="true"
          data-state={context.open() ? "open" : "closed"}
          {...others}
        >
          {local.children}
        </div>
      </Portal>
    </Show>
  );
};

export interface AlertDialogTitleProps
  extends JSX.HTMLAttributes<HTMLHeadingElement> {
  /**
   * 标题文本
   */
  children?: JSX.Element;
}

export const AlertDialogTitle: Component<AlertDialogTitleProps> = (props) => {
  const [local, others] = splitProps(props, ["children", "class"] as const);

  return (
    <h2 class={local.class} {...others}>
      {local.children}
    </h2>
  );
};

export interface AlertDialogDescriptionProps
  extends JSX.HTMLAttributes<HTMLParagraphElement> {
  /**
   * 描述文本
   */
  children?: JSX.Element;
}

export const AlertDialogDescription: Component<AlertDialogDescriptionProps> = (
  props,
) => {
  const [local, others] = splitProps(props, ["children", "class"] as const);

  return (
    <p class={local.class} {...others}>
      {local.children}
    </p>
  );
};

export interface AlertDialogActionProps
  extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * 子元素
   */
  children?: JSX.Element;
}

export const AlertDialogAction: Component<AlertDialogActionProps> = (props) => {
  const [local, others] = splitProps(
    props,
    ["children", "class", "onClick"] as const,
  );
  const context = useAlertDialogContext();

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

export interface AlertDialogCancelProps
  extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * 子元素
   */
  children?: JSX.Element;
}

export const AlertDialogCancel: Component<AlertDialogCancelProps> = (props) => {
  const [local, others] = splitProps(
    props,
    ["children", "class", "onClick"] as const,
  );
  const context = useAlertDialogContext();

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

AlertDialog.Trigger = AlertDialogTrigger;
AlertDialog.Overlay = AlertDialogOverlay;
AlertDialog.Content = AlertDialogContent;
AlertDialog.Title = AlertDialogTitle;
AlertDialog.Description = AlertDialogDescription;
AlertDialog.Action = AlertDialogAction;
AlertDialog.Cancel = AlertDialogCancel;
