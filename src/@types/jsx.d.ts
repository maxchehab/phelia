declare namespace JSX {
  type ComponentType =
    | "actions"
    | "button"
    | "confirm"
    | "context"
    | "divider"
    | "image-block"
    | "image"
    | "section"
    | "text";

  interface IntrinsicElements {
    component: { children?: React.ReactNode; componentType: ComponentType };
  }
}
