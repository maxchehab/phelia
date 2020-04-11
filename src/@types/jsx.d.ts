declare namespace JSX {
  type ComponentType =
    | "actions"
    | "button"
    | "confirm"
    | "context"
    | "divider"
    | "image-block"
    | "image"
    | "input"
    | "message"
    | "modal"
    | "section"
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
