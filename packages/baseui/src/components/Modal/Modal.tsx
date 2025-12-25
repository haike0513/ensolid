import { splitProps, Component, JSX, createSignal, createContext, useContext, Show } from 'solid-js';

interface ModalContextValue {
  open: () => boolean;
  setOpen: (open: boolean) => void;
  onClose?: () => void;
}

const ModalContext = createContext<ModalContextValue>();

export const useModalContext = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('Modal components must be used within Modal');
  }
  return context;
};

export interface ModalProps extends JSX.HTMLAttributes<HTMLDivElement> {
  /**
   * 是否打开（受控）
   */
  open?: boolean;
  /**
   * 默认打开状态（非受控）
   */
  defaultOpen?: boolean;
  /**
   * 打开状态变化回调
   */
  onOpenChange?: (open: boolean) => void;
  /**
   * 关闭回调
   */
  onClose?: () => void;
  /**
   * 是否禁用背景点击关闭
   */
  disableBackdropClick?: boolean;
  /**
   * 是否禁用 ESC 关闭
   */
  disableEscapeKeyDown?: boolean;
  /**
   * 子元素
   */
  children?: JSX.Element;
}

const ModalBase: Component<ModalProps> = (props) => {
  const [local, others] = splitProps(props, [
    'open',
    'defaultOpen',
    'onOpenChange',
    'onClose',
    'disableBackdropClick',
    'disableEscapeKeyDown',
    'class',
    'children',
  ]);

  const isControlled = () => local.open !== undefined;
  const [internalOpen, setInternalOpen] = createSignal<boolean>(local.open ?? local.defaultOpen ?? false);

  const open = () => (isControlled() ? local.open ?? false : internalOpen());

  const handleOpenChange = (newOpen: boolean) => {
    if (!isControlled()) {
      setInternalOpen(newOpen);
    }
    local.onOpenChange?.(newOpen);
    if (!newOpen) {
      local.onClose?.();
    }
  };

  const handleBackdropClick: JSX.EventHandler<HTMLDivElement, MouseEvent> = (e) => {
    if (e.target === e.currentTarget && !local.disableBackdropClick) {
      handleOpenChange(false);
    }
  };

  const handleKeyDown: JSX.EventHandler<HTMLDivElement, KeyboardEvent> = (e) => {
    if (e.key === 'Escape' && !local.disableEscapeKeyDown) {
      handleOpenChange(false);
    }
  };

  const contextValue: ModalContextValue = {
    open,
    setOpen: handleOpenChange,
    onClose: local.onClose,
  };

  return (
    <Show when={open()}>
      <ModalContext.Provider value={contextValue}>
        <div
          class={local.class}
          data-open={open() ? '' : undefined}
          onClick={handleBackdropClick}
          onKeyDown={handleKeyDown}
          role="presentation"
          {...others}
        >
          {local.children}
        </div>
      </ModalContext.Provider>
    </Show>
  );
};

export interface ModalComponent extends Component<ModalProps> {
  Backdrop: Component<ModalBackdropProps>;
  Content: Component<ModalContentProps>;
  Title: Component<ModalTitleProps>;
  Description: Component<ModalDescriptionProps>;
  Close: Component<ModalCloseProps>;
}

export const Modal = Object.assign(ModalBase, {
  Backdrop: null as unknown as Component<ModalBackdropProps>,
  Content: null as unknown as Component<ModalContentProps>,
  Title: null as unknown as Component<ModalTitleProps>,
  Description: null as unknown as Component<ModalDescriptionProps>,
  Close: null as unknown as Component<ModalCloseProps>,
}) as ModalComponent;

export interface ModalBackdropProps extends JSX.HTMLAttributes<HTMLDivElement> {
  /**
   * 子元素
   */
  children?: JSX.Element;
}

export const ModalBackdrop: Component<ModalBackdropProps> = (props) => {
  const [local, others] = splitProps(props, ['children', 'class']);
  return (
    <div class={local.class} data-backdrop {...others}>
      {local.children}
    </div>
  );
};

export interface ModalContentProps extends JSX.HTMLAttributes<HTMLDivElement> {
  /**
   * 子元素
   */
  children?: JSX.Element;
}

export const ModalContent: Component<ModalContentProps> = (props) => {
  const [local, others] = splitProps(props, ['children', 'class', 'onClick']);

  const handleClick: JSX.EventHandler<HTMLDivElement, MouseEvent> = (e) => {
    e.stopPropagation();
    if (typeof local.onClick === 'function') {
      local.onClick(e);
    }
  };

  return (
    <div class={local.class} role="dialog" aria-modal="true" onClick={handleClick} {...others}>
      {local.children}
    </div>
  );
};

export interface ModalTitleProps extends JSX.HTMLAttributes<HTMLHeadingElement> {
  /**
   * 子元素
   */
  children?: JSX.Element;
}

export const ModalTitle: Component<ModalTitleProps> = (props) => {
  const [local, others] = splitProps(props, ['children', 'class']);
  return (
    <h2 class={local.class} {...others}>
      {local.children}
    </h2>
  );
};

export interface ModalDescriptionProps extends JSX.HTMLAttributes<HTMLParagraphElement> {
  /**
   * 子元素
   */
  children?: JSX.Element;
}

export const ModalDescription: Component<ModalDescriptionProps> = (props) => {
  const [local, others] = splitProps(props, ['children', 'class']);
  return (
    <p class={local.class} {...others}>
      {local.children}
    </p>
  );
};

export interface ModalCloseProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * 子元素
   */
  children?: JSX.Element;
}

export const ModalClose: Component<ModalCloseProps> = (props) => {
  const [local, others] = splitProps(props, ['children', 'class', 'onClick']);
  const context = useModalContext();

  const handleClick: JSX.EventHandler<HTMLButtonElement, MouseEvent> = (e) => {
    if (typeof local.onClick === 'function') {
      local.onClick(e);
    }
    context.setOpen(false);
  };

  return (
    <button type="button" class={local.class} onClick={handleClick} aria-label="关闭" {...others}>
      {local.children}
    </button>
  );
};

Modal.Backdrop = ModalBackdrop;
Modal.Content = ModalContent;
Modal.Title = ModalTitle;
Modal.Description = ModalDescription;
Modal.Close = ModalClose;

