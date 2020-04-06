declare namespace JSX {
  interface IntrinsicElements {
    slackActions: { children: JSX.Element[] | JSX.Element };
    slackButton: {
      children: string;
      onClick?: (user: {
        id: string;
        username: string;
        name: string;
        team_id: string;
      }) => void;
      value?: string;
    };
    slackSection: { children: JSX.Element[] | JSX.Element };
    slackText: { children: any };
  }
}
