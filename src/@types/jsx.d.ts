declare namespace JSX {
  type ComponentType = "text" | "button" | "actions" | "section";

  interface IntrinsicElements {
    component: { children?: React.ReactNode; componentType: ComponentType };
  }
}
