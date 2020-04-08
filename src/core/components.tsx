import React, { ReactElement } from "react";
import { SlackUser } from "./phelia-client";
import {
  ActionsBlock,
  Button as SlackButton,
  ContextBlock,
  DividerBlock,
  ImageBlock as SlackImageBlock,
  ImageElement,
  SectionBlock,
} from "@slack/web-api";
import { XOR } from "ts-xor";

interface TextProps {
  children: React.ReactText | React.ReactText[];
  emoji?: boolean;
  type: "plain_text" | "mrkdwn";
  verbatim?: boolean;
}

export const Text = (props: TextProps) => (
  <component
    {...props}
    componentType="text"
    toSlackElement={(props: TextProps) => {
      const instance: any = { type: props.type, text: "" };

      if (props.type === "mrkdwn") {
        instance.verbatim = props.verbatim;
      } else if (props.type === "plain_text") {
        instance.emoji = props.emoji;
      }

      return instance;
    }}
  />
);

Text.defaultProps = {
  type: "plain_text",
};

interface ButtonBase {
  children: string;
  confirm?: ReactElement;
  emoji?: boolean;
  style?: undefined | "danger" | "primary";
  url?: string;
}

interface ButtonWithOnClick extends ButtonBase {
  onClick: (user: SlackUser) => void;
  value: string;
  children: string;
}

type ButtonProps = XOR<ButtonWithOnClick, ButtonBase>;

export const Button = (props: ButtonProps) => (
  <component
    {...props}
    componentType={"button"}
    toSlackElement={(props, reconcile): SlackButton => ({
      type: "button",
      value: props.value,
      style: props.style,
      url: props.url,
      confirm: reconcile(props.confirm)[0],
      text: { type: "plain_text", text: "", emoji: props.emoji },
    })}
  />
);

type SectionProps =
  | {
      accessory?: ReactElement;
      text: ReactElement | string;
    }
  | {
      accessory?: ReactElement;
      children: ReactElement | ReactElement[];
    };

export const Section = (props: SectionProps) => (
  <component
    {...props}
    componentType="section"
    toSlackElement={(props, reconcile): SectionBlock => {
      const instance: SectionBlock = {
        type: "section",
        accessory: reconcile(props.accessory)[0],
        text: reconcile(props.text)[0],
      };

      if (instance.text) {
        instance.text.type = "plain_text";
      }

      return instance;
    }}
  />
);

interface ActionsProps {
  children: ReactElement | ReactElement[];
}

export const Actions = (props: ActionsProps) => (
  <component
    {...props}
    componentType="actions"
    toSlackElement={(): ActionsBlock => ({
      type: "actions",
      elements: [],
    })}
  />
);

interface ImageProps {
  image_url: string;
  alt_text: string;
}

export const Image = (props: ImageProps) => (
  <component
    {...props}
    componentType="image"
    toSlackElement={(props): ImageElement => ({
      type: "image",
      image_url: props.image_url,
      alt_text: props.alt_text,
    })}
  />
);

interface ImageBlockProps {
  image_url: string;
  alt_text: string;
  emoji?: boolean;
  title?: string;
}

export const ImageBlock = (props: ImageBlockProps) => (
  <component
    {...props}
    componentType="image-block"
    toSlackElement={(props): SlackImageBlock => {
      const instance: any = {
        type: "image",
        image_url: props.image_url,
        alt_text: props.alt_text,
      };

      if (props.title) {
        instance.title = {
          type: "plain_text",
          text: props.title,
          emoji: props.emoji,
        };
      }

      return instance;
    }}
  />
);

export const Divider = () => (
  <component
    componentType="divider"
    toSlackElement={(): DividerBlock => ({ type: "divider" })}
  />
);

interface ContextProps {
  children: ReactElement | ReactElement[];
}

export const Context = (props: ContextProps) => (
  <component
    {...props}
    componentType="context"
    toSlackElement={(): ContextBlock => ({ type: "context", elements: [] })}
  />
);

interface ConfirmProps {
  children: ReactElement | string;
  confirm: ReactElement | string;
  deny: ReactElement | string;
  style?: undefined | "danger" | "primary";
  title: ReactElement | string;
}

export const Confirm = (props: ConfirmProps) => (
  <component
    {...props}
    componentType="confirm"
    toSlackElement={(props, reconcile) => {
      const instance: any = {
        // using a function so the appendInitialChild can determine the type of the component
        // whereas slack forbids a confirm object to have a 'type' property
        isConfirm: () => true,
        title: reconcile(props.title)[0],
        confirm: reconcile(props.confirm)[0],
        deny: reconcile(props.deny)[0],
        style: props.style,
      };

      instance.title.type = "plain_text";
      instance.confirm.type = "plain_text";
      instance.deny.type = "plain_text";

      return instance;
    }}
  />
);
