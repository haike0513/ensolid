import {
    Component,
    JSX,
    onMount,
    onCleanup,
} from "solid-js";
import { render } from "solid-js/web";

export interface PortalProps {
    /**
     * 子元素
     */
    children?: JSX.Element;
    /**
     * 挂载的容器
     */
    container?: HTMLElement | (() => HTMLElement | null) | null;
    /**
     * 是否禁用 Portal
     */
    disablePortal?: boolean;
}

export const Portal: Component<PortalProps> = (props) => {
    let portalElement: HTMLDivElement | null = null;
    let dispose: (() => void) | null = null;

    onMount(() => {
        if (props.disablePortal) {
            return;
        }

        let targetContainer: HTMLElement | null = null;

        if (typeof props.container === "function") {
            targetContainer = props.container();
        } else if (props.container) {
            targetContainer = props.container;
        } else {
            targetContainer = document.body;
        }

        if (targetContainer) {
            portalElement = document.createElement("div");
            targetContainer.appendChild(portalElement);
            dispose = render(() => props.children, portalElement!);
        }
    });

    onCleanup(() => {
        if (dispose) {
            dispose();
        }
        if (portalElement && portalElement.parentNode) {
            portalElement.parentNode.removeChild(portalElement);
        }
    });

    if (props.disablePortal) {
        return <>{props.children}</>;
    }

    return null;
};

