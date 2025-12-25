import { Component, splitProps, createSignal, createContext, useContext, Show, onMount, onCleanup, createEffect } from 'solid-js';
import { Portal } from 'solid-js/web';
import { isServer } from 'solid-js/web';
import type { JSX } from 'solid-js';

interface AlertDialogContextValue {
  open: () => boolean;
  setOpen: (open: boolean) => void;
}

const AlertDialogContext = createContext<AlertDialogContextValue>();

export const useAlertDialogContext = () => {
  const context = useContext(AlertDialogContext);
  if (!context) {
    throw new Error('AlertDialog components must be used within AlertDialog');
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

export const AlertDialog: Component<AlertDialogProps> = (props) => {
  const [local] = splitProps(props, [
    'open',
    'defaultOpen',
    'onOpenChange',
    'children',
  ]);

  const [internalOpen, setInternalOpen] = createSignal(
    local.open ?? local.defaultOpen ?? false
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
    if (e.key === 'Escape' && open()) {
      handleOpenChange(false);
    }
  };

  onMount(() => {
    if (!isServer && open()) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
  });

  createEffect(() => {
    if (!isServer) {
      if (open()) {
        document.addEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'hidden';
      } else {
        document.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = '';
      }
    }
  });

  onCleanup(() => {
    if (!isServer) {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
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

export interface AlertDialogTriggerProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * 子元素
   */
  children?: JSX.Element;
  /**
   * 是否作为子元素传递
   */
  asChild?: boolean;
}

export const AlertDialogTrigger: Component<AlertDialogTriggerProps> = (props) => {
  const [local, others] = splitProps(props, ['children', 'asChild', 'class', 'onClick']);
  const context = useAlertDialogContext();

  const handleClick: JSX.EventHandler<HTMLButtonElement, MouseEvent> = (e) => {
    if (typeof local.onClick === 'function') {
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

export interface AlertDialogContentProps extends JSX.HTMLAttributes<HTMLDivElement> {
  /**
   * 子元素
   */
  children?: JSX.Element;
}

export const AlertDialogContent: Component<AlertDialogContentProps> = (props) => {
  const [local, others] = splitProps(props, ['class', 'children'] as const);
  const context = useAlertDialogContext();

  return (
    <Show when={context.open()}>
      <Portal mount={!isServer ? document.body : undefined}>
        <div
          class={local.class}
          role="alertdialog"
          aria-modal="true"
          data-state={context.open() ? 'open' : 'closed'}
          {...others}
        >
          {local.children}
        </div>
      </Portal>
    </Show>
  );
};

export interface AlertDialogTitleProps extends JSX.HTMLAttributes<HTMLHeadingElement> {
  /**
   * 标题文本
   */
  children?: JSX.Element;
}

export const AlertDialogTitle: Component<AlertDialogTitleProps> = (props) => {
  const [local, others] = splitProps(props, ['children', 'class'] as const);

  return (
    <h2 class={local.class} {...others}>
      {local.children}
    </h2>
  );
};

export interface AlertDialogDescriptionProps extends JSX.HTMLAttributes<HTMLParagraphElement> {
  /**
   * 描述文本
   */
  children?: JSX.Element;
}

export const AlertDialogDescription: Component<AlertDialogDescriptionProps> = (props) => {
  const [local, others] = splitProps(props, ['children', 'class'] as const);

  return (
    <p class={local.class} {...others}>
      {local.children}
    </p>
  );
};

export interface AlertDialogActionProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * 子元素
   */
  children?: JSX.Element;
}

export const AlertDialogAction: Component<AlertDialogActionProps> = (props) => {
  const [local, others] = splitProps(props, ['children', 'class', 'onClick'] as const);
  const context = useAlertDialogContext();

  const handleClick: JSX.EventHandler<HTMLButtonElement, MouseEvent> = (e) => {
    if (typeof local.onClick === 'function') {
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

export interface AlertDialogCancelProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * 子元素
   */
  children?: JSX.Element;
}

export const AlertDialogCancel: Component<AlertDialogCancelProps> = (props) => {
  const [local, others] = splitProps(props, ['children', 'class', 'onClick'] as const);
  const context = useAlertDialogContext();

  const handleClick: JSX.EventHandler<HTMLButtonElement, MouseEvent> = (e) => {
    if (typeof local.onClick === 'function') {
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

(AlertDialog as any).Trigger = AlertDialogTrigger;
(AlertDialog as any).Content = AlertDialogContent;
(AlertDialog as any).Title = AlertDialogTitle;
(AlertDialog as any).Description = AlertDialogDescription;
(AlertDialog as any).Action = AlertDialogAction;
(AlertDialog as any).Cancel = AlertDialogCancel;

