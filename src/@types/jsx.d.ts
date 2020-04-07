declare namespace JSX {
  type ComponentType = "text" | "button" | "actions" | "section" | "image";

  interface IntrinsicElements {
    component: { children?: React.ReactNode; componentType: ComponentType };
  }
}
