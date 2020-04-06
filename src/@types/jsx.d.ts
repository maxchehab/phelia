declare namespace JSX {
  interface IntrinsicElements {
    slackActions: { children: JSX.Element[] | JSX.Element };
    slackButton: { children: string; onClick?: () => void; value?: string };
    slackSection: { children: JSX.Element[] | JSX.Element };
    slackText: { children: any };
  }
}
