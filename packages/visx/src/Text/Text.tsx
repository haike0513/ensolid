import { Component, JSX, splitProps, mergeProps, createMemo } from 'solid-js';

export type TextProps = JSX.TextSVGAttributes<SVGTextElement> & {
  children?: string | number;
  width?: number;
  scaleToFit?: boolean;
  verticalAnchor?: 'start' | 'middle' | 'end';
  textAnchor?: 'start' | 'middle' | 'end' | 'inherit';
  lineHeight?: number | string; // em if string
  capHeight?: number | string; // em if string
};

export const Text: Component<TextProps> = (rawProps) => {
    const props = mergeProps({
        verticalAnchor: 'end' as const,
        textAnchor: 'start' as const,
        lineHeight: '1em',
        capHeight: '0.71em',
        scaleToFit: false
    }, rawProps);

  const [local, rest] = splitProps(props, [
    'children',
    'verticalAnchor',
    'width',
    'scaleToFit',
    'lineHeight',
    'capHeight',
    'dy'
  ]);

  const dy = createMemo(() => {
     let startDy = local.dy;
     // Simple vertical anchor logic for single line text basically
     // For multiline or wrapping, it's more complex, but this is a start
     if (local.verticalAnchor === 'start') {
         return '0.71em'; // Approximate cap height offset
     } else if (local.verticalAnchor === 'middle') {
         return '0.35em';
     }
     return startDy ?? 0;
  });

  return (
    <text
        dy={dy()}
        {...rest}
    >
      {local.children}
    </text>
  );
};
