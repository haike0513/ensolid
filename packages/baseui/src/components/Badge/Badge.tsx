import { splitProps, Component, JSX, Show } from 'solid-js';

export interface BadgeProps extends JSX.HTMLAttributes<HTMLSpanElement> {
  /**
   * Badge 的根元素
   */
  slotProps?: {
    root?: JSX.HTMLAttributes<HTMLSpanElement>;
    badge?: JSX.HTMLAttributes<HTMLSpanElement>;
  };
  /**
   * 徽章内容
   */
  badgeContent?: JSX.Element;
  /**
   * 是否显示徽章（当 badgeContent 为 0 时）
   */
  showZero?: boolean;
  /**
   * 最大显示值
   */
  max?: number;
  /**
   * 徽章颜色
   */
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
  /**
   * 徽章变体
   */
  variant?: 'standard' | 'dot';
  /**
   * 是否重叠
   */
  overlap?: 'rectangular' | 'circular';
  /**
   * 锚点位置
   */
  anchorOrigin?: {
    vertical: 'top' | 'bottom';
    horizontal: 'left' | 'right';
  };
  /**
   * 子元素
   */
  children?: JSX.Element;
}

export const Badge: Component<BadgeProps> = (props) => {
  const [local, others] = splitProps(props, [
    'badgeContent',
    'showZero',
    'max',
    'color',
    'variant',
    'overlap',
    'anchorOrigin',
    'children',
    'slotProps',
    'class',
  ]);

  const color = () => local.color ?? 'primary';
  const variant = () => local.variant ?? 'standard';
  const overlap = () => local.overlap ?? 'rectangular';
  const anchorOrigin = () => local.anchorOrigin ?? { vertical: 'top', horizontal: 'right' };
  const max = () => local.max ?? 99;
  const showZero = () => local.showZero ?? false;

  const getBadgeContent = () => {
    const content = local.badgeContent;
    if (typeof content === 'number') {
      if (content === 0 && !showZero()) {
        return null;
      }
      return content > max() ? `${max()}+` : String(content);
    }
    return content;
  };

  const badgeContent = () => getBadgeContent();
  const shouldShow = () => {
    const content = badgeContent();
    if (variant() === 'dot') {
      return true;
    }
    return content !== null && content !== undefined && content !== '';
  };

  const rootSlotProps = () => local.slotProps?.root ?? {};
  const badgeSlotProps = () => local.slotProps?.badge ?? {};

  return (
    <span
      class={local.class}
      data-overlap={overlap()}
      {...rootSlotProps()}
      {...others}
    >
      {local.children}
      <Show when={shouldShow()}>
        <span
          data-badge
          data-variant={variant()}
          data-color={color()}
          data-anchor-vertical={anchorOrigin().vertical}
          data-anchor-horizontal={anchorOrigin().horizontal}
          {...badgeSlotProps()}
        >
          {variant() === 'standard' && badgeContent()}
        </span>
      </Show>
    </span>
  );
};

