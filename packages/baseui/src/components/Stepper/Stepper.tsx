import {
    Component,
    createContext,
    JSX,
    splitProps,
    useContext,
} from "solid-js";

interface StepperContextValue {
    activeStep: () => number;
    orientation: () => "horizontal" | "vertical";
    alternativeLabel: () => boolean;
}

const StepperContext = createContext<StepperContextValue>();

export const useStepperContext = () => {
    const context = useContext(StepperContext);
    if (!context) {
        throw new Error("Stepper components must be used within Stepper");
    }
    return context;
};

export interface StepperProps extends JSX.HTMLAttributes<HTMLDivElement> {
    /**
     * 当前活动步骤（从0开始）
     */
    activeStep?: number;
    /**
     * 方向
     * @default 'horizontal'
     */
    orientation?: "horizontal" | "vertical";
    /**
     * 是否使用替代标签
     * @default false
     */
    alternativeLabel?: boolean;
    /**
     * 非线性格子
     */
    nonLinear?: boolean;
    /**
     * 步骤列表
     */
    steps?: Array<{
        label?: JSX.Element;
        description?: JSX.Element;
        optional?: JSX.Element;
        error?: boolean;
        completed?: boolean;
        disabled?: boolean;
    }>;
    /**
     * 子元素
     */
    children?: JSX.Element;
}

const StepperBase: Component<StepperProps> = (props) => {
    const [local, others] = splitProps(props, [
        "activeStep",
        "orientation",
        "alternativeLabel",
        "nonLinear",
        "steps",
        "class",
        "children",
    ]);

    const activeStep = () => local.activeStep ?? 0;
    const orientation = () => local.orientation ?? "horizontal";
    const alternativeLabel = () => local.alternativeLabel ?? false;
    const nonLinear = () => local.nonLinear ?? false;

    const contextValue: StepperContextValue = {
        activeStep,
        orientation,
        alternativeLabel,
    };

    return (
        <StepperContext.Provider value={contextValue}>
            <div
                class={local.class}
                data-orientation={orientation()}
                data-alternative-label={alternativeLabel() ? "" : undefined}
                data-non-linear={nonLinear() ? "" : undefined}
                {...others}
            >
                {local.children}
            </div>
        </StepperContext.Provider>
    );
};

export interface StepperComponent extends Component<StepperProps> {
    Step: Component<StepProps>;
    StepLabel: Component<StepLabelProps>;
    StepContent: Component<StepContentProps>;
}

export const Stepper = Object.assign(StepperBase, {
    Step: null as unknown as Component<StepProps>,
    StepLabel: null as unknown as Component<StepLabelProps>,
    StepContent: null as unknown as Component<StepContentProps>,
}) as StepperComponent;

export interface StepProps extends JSX.HTMLAttributes<HTMLDivElement> {
    /**
     * 步骤索引
     */
    index: number;
    /**
     * 是否完成
     */
    completed?: boolean;
    /**
     * 是否禁用
     */
    disabled?: boolean;
    /**
     * 是否有错误
     */
    error?: boolean;
    /**
     * 子元素
     */
    children?: JSX.Element;
}

export const Step: Component<StepProps> = (props) => {
    const [local, others] = splitProps(props, [
        "index",
        "completed",
        "disabled",
        "error",
        "class",
        "children",
    ]);
    const context = useStepperContext();

    const isActive = () => context.activeStep() === local.index;
    const isCompleted = () => local.completed ?? context.activeStep() > local.index;

    return (
        <div
            class={local.class}
            data-index={local.index}
            data-active={isActive() ? "" : undefined}
            data-completed={isCompleted() ? "" : undefined}
            data-disabled={local.disabled ? "" : undefined}
            data-error={local.error ? "" : undefined}
            {...others}
        >
            {local.children}
        </div>
    );
};

export interface StepLabelProps extends JSX.HTMLAttributes<HTMLLabelElement> {
    /**
     * 标签文本
     */
    label?: JSX.Element;
    /**
     * 可选标签
     */
    optional?: JSX.Element;
    /**
     * 子元素
     */
    children?: JSX.Element;
}

export const StepLabel: Component<StepLabelProps> = (props) => {
    const [local, others] = splitProps(props, [
        "label",
        "optional",
        "class",
        "children",
    ]);

    return (
        <label class={local.class} {...others}>
            {local.label}
            {local.optional && <span data-optional>{local.optional}</span>}
            {local.children}
        </label>
    );
};

export interface StepContentProps extends JSX.HTMLAttributes<HTMLDivElement> {
    /**
     * 子元素
     */
    children?: JSX.Element;
}

export const StepContent: Component<StepContentProps> = (props) => {
    const [local, others] = splitProps(props, ["children", "class"]);

    return (
        <div class={local.class} {...others}>
            {local.children}
        </div>
    );
};

Stepper.Step = Step;
Stepper.StepLabel = StepLabel;
Stepper.StepContent = StepContent;

