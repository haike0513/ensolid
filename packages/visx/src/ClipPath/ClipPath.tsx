import { JSX, splitProps } from "solid-js";

export type ClipPathProps = {
  /** Unique id for the clipPath. */
  id: string;
  /** clipPath children. */
  children?: JSX.Element;
} & JSX.SvgSVGAttributes<SVGClipPathElement>;

/** Handles rendering of <defs> and <clipPath> elements for you, with any children you want. */
export function ClipPath(props: ClipPathProps) {
  const [local, rest] = splitProps(props, ["id", "children"]);

  return (
    <defs>
      <clipPath id={local.id} {...rest}>
        {local.children}
      </clipPath>
    </defs>
  );
}
