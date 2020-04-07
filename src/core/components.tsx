import React, { ReactElement } from "react";
import { SlackUser } from "./phelia-client";

interface TextProps {
  children: React.ReactText | React.ReactText[];
  emoji?: boolean;
  type: "plain_text" | "mrkdwn";
  verbatim?: boolean;
}

const Text = (props: TextProps) => (
  <component componentType="text" {...props} />
);
Text.defaultProps = {
  type: "plain_text",
};

interface ButtonProps {
  children: string;
  emoji?: boolean;
  onClick?: (user: SlackUser) => void;
  style?: undefined | "danger" | "primary";
  url?: string;
  value?: string;
}

const Button = (props: ButtonProps) => (
  <component componentType={"button"} {...props} />
);
Button.defaultProps = {
  style: undefined,
};

type SectionProps =
  | {
      accessory?: ReactElement;
      text: ReactElement | ReactElement[];
    }
  | {
      accessory?: ReactElement;
      children: ReactElement | ReactElement[];
    };
const Section = (props: SectionProps) => (
  <component componentType="section" {...props} />
);

Section.defaultProps = {};

interface ActionsProps {
  children: ReactElement | ReactElement[];
}

const Actions = (props: ActionsProps) => (
  <component componentType="actions" {...props} />
);

export { Text, Section, Button, Actions };
