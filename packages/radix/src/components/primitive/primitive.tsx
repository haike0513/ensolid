import { splitProps, type ComponentProps, type ValidComponent, type JSX } from 'solid-js';
import { Dynamic } from 'solid-js/web';

const NODES = [
  'a',
  'button',
  'div',
  'form',
  'h2',
  'h3',
  'img',
  'input',
  'label',
  'li',
  'nav',
  'ol',
  'p',
  'select',
  'span',
  'svg',
  'ul',
] as const;

type PrimitivePropsWithRef<E extends ValidComponent> = ComponentProps<E> & {
  asChild?: boolean;
};

type Primitives = { [E in (typeof NODES)[number]]: (props: PrimitivePropsWithRef<E>) => JSX.Element };

/* -------------------------------------------------------------------------------------------------
 * Primitive
 * -----------------------------------------------------------------------------------------------*/

const Primitive = NODES.reduce((primitive, node) => {
  const Node = (props: PrimitivePropsWithRef<typeof node>) => {
    const [local, others] = splitProps(props, ['asChild']);

    if (typeof window !== 'undefined') {
      (window as any)[Symbol.for('radix-ui')] = true;
    }

    // SolidJS adapter note: 'asChild' / Slot pattern is not directly supported in this simplified port.
    // We render the node directly using Dynamic.
    
    return <Dynamic component={node} {...others} />;
  };

  return { ...primitive, [node]: Node };
}, {} as Primitives);

/* -------------------------------------------------------------------------------------------------
 * Utils
 * -----------------------------------------------------------------------------------------------*/

/**
 * Flush custom event dispatch
 *
 * In SolidJS, reactivity is fine-grained and doesn't suffer from the same batching issues as React 18
 * for custom events, but we keep this utility signature for compatibility.
 */
function dispatchDiscreteCustomEvent<E extends CustomEvent>(target: E['target'], event: E) {
  if (target) target.dispatchEvent(event);
}

/* -----------------------------------------------------------------------------------------------*/

const Root = Primitive;

export {
  Primitive,
  //
  Root,
  //
  dispatchDiscreteCustomEvent,
};
export type { PrimitivePropsWithRef };