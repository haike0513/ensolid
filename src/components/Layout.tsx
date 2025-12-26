/**
 * Layout 组件 - 提供页面布局结构
 */

import type { Component } from "solid-js";
import { Header } from "./Header";

export const Layout: Component<{ children?: any }> = (props) => {
    return (
        <div class="min-h-screen bg-background">
            <Header />
            {props.children}
        </div>
    );
};
