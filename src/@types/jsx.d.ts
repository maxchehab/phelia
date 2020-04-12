declare namespace JSX {
  type ComponentType =
    | "actions"
    | "button"
    | "checkboxes"
    | "confirm"
    | "context"
    | "divider"
    | "home"
    | "image-block"
    | "image"
    | "input"
    | "message"
    | "modal"
    | "multi-select-menu"
    | "option-group"
    | "option"
    | "overflow"
    | "radio-buttons"
    | "section"
    | "select-menu"
    | "text-field"
    | "text";

  type ToSlackElement = (
    props: any,
    reconcile: (
      element: React.FunctionComponentElement<any>
    ) => [any, Promise<any>[]],
    promises: Promise<any>[]
  ) => any | ((props: any) => any);

  interface ComponentProps {
    componentType: ComponentType;
    toSlackElement: ToSlackElement;
  }

  interface IntrinsicElements {
    component: ComponentProps;
  }
}
