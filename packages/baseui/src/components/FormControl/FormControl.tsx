import { splitProps, Component, JSX, createContext, useContext } from 'solid-js';

interface FormControlContextValue {
  required: () => boolean;
  disabled: () => boolean;
  error: () => boolean;
  size: () => 'small' | 'medium' | 'large';
}

const FormControlContext = createContext<FormControlContextValue>();

export const useFormControlContext = () => {
  const context = useContext(FormControlContext);
  return context;
};

export interface FormControlProps extends JSX.HTMLAttributes<HTMLDivElement> {
  /**
   * 是否必填
   */
  required?: boolean;
  /**
   * 是否禁用
   */
  disabled?: boolean;
  /**
   * 是否错误
   */
  error?: boolean;
  /**
   * 大小
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * 子元素
   */
  children?: JSX.Element;
}

export const FormControl: Component<FormControlProps> = (props) => {
  const [local, others] = splitProps(props, [
    'required',
    'disabled',
    'error',
    'size',
    'class',
    'children',
  ]);

  const required = () => local.required ?? false;
  const disabled = () => local.disabled ?? false;
  const error = () => local.error ?? false;
  const size = () => local.size ?? 'medium';

  const contextValue: FormControlContextValue = {
    required,
    disabled,
    error,
    size,
  };

  return (
    <FormControlContext.Provider value={contextValue}>
      <div
        class={local.class}
        data-required={required() ? '' : undefined}
        data-disabled={disabled() ? '' : undefined}
        data-error={error() ? '' : undefined}
        data-size={size()}
        {...others}
      >
        {local.children}
      </div>
    </FormControlContext.Provider>
  );
};

export interface FormLabelProps extends JSX.LabelHTMLAttributes<HTMLLabelElement> {
  /**
   * 子元素
   */
  children?: JSX.Element;
}

export const FormLabel: Component<FormLabelProps> = (props) => {
  const [local, others] = splitProps(props, ['children', 'class']);
  const context = useFormControlContext();

  return (
    <label
      class={local.class}
      data-required={context?.required() ? '' : undefined}
      data-disabled={context?.disabled() ? '' : undefined}
      data-error={context?.error() ? '' : undefined}
      {...others}
    >
      {local.children}
    </label>
  );
};

export interface FormHelperTextProps extends JSX.HTMLAttributes<HTMLParagraphElement> {
  /**
   * 子元素
   */
  children?: JSX.Element;
}

export const FormHelperText: Component<FormHelperTextProps> = (props) => {
  const [local, others] = splitProps(props, ['children', 'class']);
  const context = useFormControlContext();

  return (
    <p
      class={local.class}
      data-error={context?.error() ? '' : undefined}
      {...others}
    >
      {local.children}
    </p>
  );
};

