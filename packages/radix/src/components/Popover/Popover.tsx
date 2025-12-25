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

interface PopoverContextValue {
  open: () => boolean;
  setOpen: (open: boolean) => void;
  triggerRef: () => HTMLElement | undefined;
  setTriggerRef: (ref: HTMLElement | undefined) => void;
  setContentElement: (el: HTMLElement | undefined) => void;
}

const PopoverContext = createContext<PopoverContextValue>();

export const usePopoverContext = () => {
  const context = useContext(PopoverContext);
  if (!context) {
    throw new Error("Popover components must be used within Popover");
  }
  return context;
};

export interface PopoverProps extends JSX.HTMLAttributes<HTMLDivElement> {
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

const PopoverBase: Component<PopoverProps> = (props) => {
  const [local] = splitProps(props, [
    "open",
    "defaultOpen",
    "onOpenChange",
    "children",
  ]);

  const [internalOpen, setInternalOpen] = createSignal(
    local.open ?? local.defaultOpen ?? false,
  );
  const [triggerRef, setTriggerRef] = createSignal<HTMLElement | undefined>();

  const isControlled = () => local.open !== undefined;
  const open = () => (isControlled() ? local.open! : internalOpen());

  const handleOpenChange = (newOpen: boolean) => {
    if (!isControlled()) {
      setInternalOpen(newOpen);
    }
    local.onOpenChange?.(newOpen);
  };

  // 点击外部关闭
  let contentElement: HTMLElement | undefined;
  const setContentElement = (el: HTMLElement | undefined) => {
    contentElement = el;
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (open() && !isServer) {
      const target = e.target as HTMLElement;
      const trigger = triggerRef();

      if (trigger && contentElement) {
        if (!trigger.contains(target) && !contentElement.contains(target)) {
          handleOpenChange(false);
        }
      }
    }
  };

  createEffect(() => {
    if (!isServer) {
      if (open()) {
        // 延迟添加事件监听器，确保 DOM 已更新
        setTimeout(() => {
          document.addEventListener("mousedown", handleClickOutside);
        }, 0);
      } else {
        document.removeEventListener("mousedown", handleClickOutside);
      }
    }
  });

  onCleanup(() => {
    if (!isServer) {
      document.removeEventListener("mousedown", handleClickOutside);
    }
  });

  const contextValue: PopoverContextValue = {
    open,
    setOpen: handleOpenChange,
    triggerRef,
    setTriggerRef,
    setContentElement,
  };

  return (
    <PopoverContext.Provider value={contextValue}>
      {local.children}
    </PopoverContext.Provider>
  );
};

export interface PopoverComponent extends Component<PopoverProps> {
  Trigger: Component<PopoverTriggerProps>;
  Content: Component<PopoverContentProps>;
}

export const Popover = Object.assign(PopoverBase, {
  Trigger: null as unknown as Component<PopoverTriggerProps>,
  Content: null as unknown as Component<PopoverContentProps>,
}) as PopoverComponent;

export interface PopoverTriggerProps
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

export const PopoverTrigger: Component<PopoverTriggerProps> = (props) => {
  const [local, others] = splitProps(props, [
    "children",
    "asChild",
    "class",
    "onClick",
  ]);
  const context = usePopoverContext();
  let triggerElement: HTMLButtonElement | undefined;

  const handleClick: JSX.EventHandler<HTMLButtonElement, MouseEvent> = (e) => {
    if (typeof local.onClick === "function") {
      local.onClick(e);
    }
    context.setOpen(!context.open());
  };

  onMount(() => {
    if (triggerElement) {
      context.setTriggerRef(triggerElement);
    }
  });

  return (
    <button
      type="button"
      ref={triggerElement}
      class={local.class}
      onClick={handleClick}
      {...others}
    >
      {local.children}
    </button>
  );
};

export interface PopoverContentProps
  extends JSX.HTMLAttributes<HTMLDivElement> {
  /**
   * 子元素
   */
  children?: JSX.Element;
}

export const PopoverContent: Component<PopoverContentProps> = (props) => {
  const [local, others] = splitProps(props, ["class", "children"] as const);
  const context = usePopoverContext();
  let contentElement: HTMLDivElement | undefined;

  const updatePosition = () => {
    if (!isServer && contentElement && context.triggerRef()) {
      const trigger = context.triggerRef()!;
      const rect = trigger.getBoundingClientRect();
      const contentRect = contentElement.getBoundingClientRect();

      // 默认在触发元素下方显示
      const top = rect.bottom + 8;
      const left = rect.left;

      // 检查是否会超出视口
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let finalTop = top;
      let finalLeft = left;

      // 如果右侧超出，则左对齐
      if (left + contentRect.width > viewportWidth) {
        finalLeft = viewportWidth - contentRect.width - 16;
      }

      // 如果下方超出，则在上方显示
      if (top + contentRect.height > viewportHeight) {
        finalTop = rect.top - contentRect.height - 8;
      }

      contentElement.style.top = `${finalTop}px`;
      contentElement.style.left = `${finalLeft}px`;
    }
  };

  onMount(() => {
    if (contentElement) {
      context.setContentElement(contentElement);
    }
  });

  createEffect(() => {
    if (context.open() && !isServer) {
      // 延迟一帧确保 DOM 已渲染
      requestAnimationFrame(() => {
        updatePosition();
      });
    }
  });

  return (
    <Show when={context.open()}>
      <Portal mount={!isServer ? document.body : undefined}>
        <div
          ref={contentElement}
          role="dialog"
          class={`fixed z-50 ${local.class || ""}`}
          data-state={context.open() ? "open" : "closed"}
          style={{ top: "0px", left: "0px" }}
          {...others}
        >
          {local.children}
        </div>
      </Portal>
    </Show>
  );
};

Popover.Trigger = PopoverTrigger;
Popover.Content = PopoverContent;
