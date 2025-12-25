import { splitProps, Show, createSignal, createContext, useContext } from 'solid-js';
import type { Component, JSX } from 'solid-js';

interface AvatarContextValue {
  imageLoadingStatus: () => 'loading' | 'loaded' | 'error';
  setImageLoadingStatus: (status: 'loading' | 'loaded' | 'error') => void;
}

const AvatarContext = createContext<AvatarContextValue>();

const useAvatarContext = () => {
  const context = useContext(AvatarContext);
  if (!context) {
    throw new Error('Avatar components must be used within Avatar');
  }
  return context;
};

export interface AvatarProps extends JSX.HTMLAttributes<HTMLDivElement> {
  /**
   * 子元素
   */
  children?: JSX.Element;
}

export interface AvatarComponent extends Component<AvatarProps> {
  Image: Component<AvatarImageProps>;
  Fallback: Component<AvatarFallbackProps>;
}

export const AvatarBase: Component<AvatarProps> = (props) => {
  const [local, others] = splitProps(props, ['class', 'children']);
  const [imageLoadingStatus, setImageLoadingStatus] = createSignal<'loading' | 'loaded' | 'error'>('loading');

  const contextValue: AvatarContextValue = {
    imageLoadingStatus,
    setImageLoadingStatus,
  };

  return (
    <AvatarContext.Provider value={contextValue}>
      <div
        class={local.class}
        {...others}
      >
        {local.children}
      </div>
    </AvatarContext.Provider>
  );
};

export const Avatar = Object.assign(AvatarBase, {
  Image: null as unknown as Component<AvatarImageProps>,
  Fallback: null as unknown as Component<AvatarFallbackProps>,
}) as AvatarComponent;

export interface AvatarImageProps extends JSX.ImgHTMLAttributes<HTMLImageElement> {
  /**
   * 图片源地址
   */
  src?: string;
  /**
   * 图片加载失败时的替代文本
   */
  alt?: string;
  /**
   * 加载状态变化回调
   */
  onLoadingStatusChange?: (status: 'loading' | 'loaded' | 'error') => void;
}

export const AvatarImage: Component<AvatarImageProps> = (props) => {
  const [local, others] = splitProps(props, [
    'src',
    'alt',
    'class',
    'onLoadingStatusChange',
    'onLoad',
    'onError',
  ]);
  const context = useAvatarContext();

  const handleLoad: JSX.EventHandler<HTMLImageElement, Event> = (e) => {
    if (typeof local.onLoad === 'function') {
      local.onLoad(e);
    }
    context.setImageLoadingStatus('loaded');
    local.onLoadingStatusChange?.('loaded');
  };

  const handleError: JSX.EventHandler<HTMLImageElement, Event> = (e) => {
    if (typeof local.onError === 'function') {
      local.onError(e as any);
    }
    context.setImageLoadingStatus('error');
    local.onLoadingStatusChange?.('error');
  };

  return (
    <Show when={local.src && context.imageLoadingStatus() !== 'error'}>
      <img
        src={local.src}
        alt={local.alt}
        class={local.class}
        onLoad={handleLoad}
        onError={handleError}
        {...others}
      />
    </Show>
  );
};

export interface AvatarFallbackProps extends JSX.HTMLAttributes<HTMLDivElement> {
  /**
   * 延迟显示时间（毫秒）
   * @default 0
   */
  delayMs?: number;
  /**
   * 子元素
   */
  children?: JSX.Element;
}

export const AvatarFallback: Component<AvatarFallbackProps> = (props) => {
  const [local, others] = splitProps(props, ['delayMs', 'class', 'children']);
  const context = useAvatarContext();

  // 如果图片加载失败，或者没有图片源，或者延迟时间后仍然在加载，显示 fallback
  const shouldShow = () => {
    const status = context.imageLoadingStatus();
    return status === 'error' || status === 'loading';
  };

  return (
    <Show when={shouldShow()}>
      <div
        class={local.class}
        {...others}
      >
        {local.children}
      </div>
    </Show>
  );
};

Avatar.Image = AvatarImage;
Avatar.Fallback = AvatarFallback;

