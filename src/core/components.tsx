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
      text: ReactElement | string;
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

interface ImageProps {
  image_url: string;
  alt_text: string;
}

const Image = (props: ImageProps) => (
  <component componentType="image" {...props} />
);

interface ImageBlock {
  image_url: string;
  alt_text: string;
  emoji?: boolean;
  title?: string;
}

const ImageBlock = (props: ImageBlock) => (
  <component componentType="image-block" {...props} />
);

const Divider = () => <component componentType="divider" />;

interface ContextProps {
  children: ReactElement | ReactElement[];
}

const Context = (props: ContextProps) => (
  <component componentType="context" {...props} />
);

export { Text, Section, Button, Actions, Image, ImageBlock, Divider, Context };
