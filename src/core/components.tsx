import React, { ReactElement } from "react";
import {
  ActionsBlock,
  Button as SlackButton,
  ContextBlock,
  Datepicker,
  DividerBlock,
  ImageBlock as SlackImageBlock,
  ImageElement,
  Option as SlackOption,
  SectionBlock,
  InputBlock,
  PlainTextInput
} from "@slack/web-api";
import { XOR } from "ts-xor";
import {
  InteractionEvent,
  SelectCheckboxesEvent,
  SelectDateEvent
} from "./interactive-message-handler";

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
  type: "plain_text"
};

interface ButtonBase {
  children: string;
  confirm?: ReactElement;
  emoji?: boolean;
  style?: undefined | "danger" | "primary";
  url?: string;
}

interface ButtonWithOnClick extends ButtonBase {
  onClick: (event: InteractionEvent) => void | Promise<void>;
  action: string;
  children: string;
}

type ButtonProps = XOR<ButtonWithOnClick, ButtonBase>;

export const Button = (props: ButtonProps) => (
  <component
    {...props}
    componentType={"button"}
    toSlackElement={(props, reconcile, promises): SlackButton => {
      const instance: SlackButton = {
        type: "button",
        action_id: props.action,
        style: props.style,
        url: props.url,
        text: { type: "plain_text", text: "", emoji: props.emoji }
      };

      const [confirm, confirmPromises] = reconcile(props.confirm);

      instance.confirm = confirm;
      promises.push(...confirmPromises);

      return instance;
    }}
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
    toSlackElement={(props, reconcile, promises): SectionBlock => {
      const instance: SectionBlock = {
        type: "section"
      };
      const [accessory, accessoryPromises] = reconcile(props.accessory);
      const [text, textPromises] = reconcile(props.text);

      instance.text = text;
      instance.accessory = accessory;

      if (instance.text) {
        instance.text.type = "plain_text";
      }

      promises.push(...accessoryPromises, ...textPromises);

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
      elements: []
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
      alt_text: props.alt_text
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
        alt_text: props.alt_text
      };

      if (props.title) {
        instance.title = {
          type: "plain_text",
          text: props.title,
          emoji: props.emoji
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
  style?: "danger" | "primary";
  title: ReactElement | string;
}

export const Confirm = (props: ConfirmProps) => (
  <component
    {...props}
    componentType="confirm"
    toSlackElement={(props, reconcile, promises) => {
      const instance: any = {
        // using a function so the appendInitialChild can determine the type of the component
        // whereas slack forbids a confirm object to have a 'type' property
        isConfirm: () => true,

        style: props.style
      };

      const [title, titlePromises] = reconcile(props.title);
      const [confirm, confirmPromises] = reconcile(props.confirm);
      const [deny, denyPromises] = reconcile(props.deny);

      instance.title = title;
      instance.confirm = confirm;
      instance.deny = deny;

      instance.title.type = "plain_text";
      instance.confirm.type = "plain_text";
      instance.deny.type = "plain_text";

      promises.push(...titlePromises, ...confirmPromises, ...denyPromises);

      return instance;
    }}
  />
);

interface OptionProps {
  children: ReactElement | string;
  value: string;
  description?: ReactElement | string;
  url?: string;
  selected?: boolean;
}

export const Option = (props: OptionProps) => (
  <component
    {...props}
    componentType="confirm"
    toSlackElement={(props, reconcile, promises): Promise<SlackOption> => {
      const instance: any = {
        isSelected: () => props.selected,
        isOption: () => true,
        value: props.value,
        url: props.url
      };

      const [description, descriptionPromises] = reconcile(props.description);

      instance.description = description;

      if (instance.description) {
        instance.description.type = "plain_text";
      }

      promises.push(...descriptionPromises);

      return instance;
    }}
  />
);

interface DatePickerProps {
  action: string;
  confirm?: ReactElement;
  initialDate?: string;
  onSelect?: (event: SelectDateEvent) => void | Promise<void>;
  placeholder?: ReactElement | string;
}

export const DatePicker = (props: DatePickerProps) => (
  <component
    {...props}
    componentType="confirm"
    toSlackElement={(props, reconcile, promises): Datepicker => {
      const instance: Datepicker = {
        type: "datepicker",
        initial_date: props.initialDate,
        action_id: props.action
      };

      const [placeholder, placeholderPromises] = reconcile(props.placeholder);
      const [confirm, confirmPromises] = reconcile(props.confirm);

      instance.placeholder = placeholder;
      instance.confirm = confirm;

      if (instance.placeholder) {
        instance.placeholder.type = "plain_text";
      }

      promises.push(...placeholderPromises, ...confirmPromises);

      return instance;
    }}
  />
);

interface MessageProps {
  children: ReactElement | ReactElement[];
  text?: string;
}

export const Message = (props: MessageProps) => (
  <component
    {...props}
    componentType="message"
    toSlackElement={({ text }) => ({ blocks: [], text })}
  />
);

interface ModalProps {
  children: ReactElement | ReactElement[];
  title: ReactElement | string;
  submit?: ReactElement | string;
  close?: ReactElement | string;
}

export const Modal = (props: ModalProps) => (
  <component
    {...props}
    componentType="modal"
    toSlackElement={(props, reconcile, promises) => {
      const instance: any = {
        type: "modal",
        blocks: []
      };

      const [title, titlePromises] = reconcile(props.title);
      const [submit, submitPromises] = reconcile(props.submit);
      const [close, closePromises] = reconcile(props.close);

      instance.title = title;
      instance.submit = submit;
      instance.close = close;

      if (instance.title) {
        instance.title.type = "plain_text";
      }

      if (instance.submit) {
        instance.submit.type = "plain_text";
      }

      if (instance.close) {
        instance.close.type = "plain_text";
      }

      promises.push(...titlePromises, ...submitPromises, ...closePromises);

      return instance;
    }}
  />
);

interface InputProps {
  label: string | ReactElement;
  children: ReactElement;
  hint?: string | ReactElement;
  optional?: boolean;
}
export const Input = (props: InputProps) => (
  <component
    {...props}
    componentType="input"
    toSlackElement={(props, reconcile, promises): InputBlock => {
      const instance: any = {
        type: "input",
        optional: props.optional
      };

      const [hint, hintPromises] = reconcile(props.hint);
      const [label, labelPromises] = reconcile(props.label);

      instance.hint = hint;
      instance.label = label;

      if (instance.label) {
        instance.label.type = "plain_text";
      }

      if (instance.hint) {
        instance.hint.type = "plain_text";
      }

      promises.push(...hintPromises, ...labelPromises);

      return instance;
    }}
  />
);

interface TextFieldProps {
  action: string;
  initialValue?: string;
  maxLength?: number;
  minLength?: number;
  multiline?: boolean;
  placeholder?: ReactElement | string;
}
export const TextField = (props: TextFieldProps) => (
  <component
    {...props}
    componentType="text-field"
    toSlackElement={(props, reconcile, promises): PlainTextInput => {
      const instance: PlainTextInput = {
        type: "plain_text_input",
        initial_value: props.initialValue,
        action_id: props.action,
        max_length: props.maxLength,
        min_length: props.minLength,
        multiline: props.multiline
      };

      const [placeholder, placeholderPromises] = reconcile(props.placeholder);

      instance.placeholder = placeholder;

      if (instance.placeholder) {
        instance.placeholder.type = "plain_text";
      }

      promises.push(...placeholderPromises);

      return instance;
    }}
  />
);

interface CheckboxesProps {
  action: string;
  children: ReactElement | ReactElement[];
  confirm?: ReactElement;
  onSelect?: (event: SelectCheckboxesEvent) => void | Promise<void>;
}
export const Checkboxes = (props: CheckboxesProps) => (
  <component
    {...props}
    componentType="checkboxes"
    toSlackElement={(props, reconcile, promises) => {
      const instance: any = {
        type: "checkboxes",
        action_id: props.action,
        options: []
      };

      const [{ fields: options }, optionPromises] = reconcile(
        React.createElement(Section, { children: props.children })
      );
      const [confirm, confirmPromises] = reconcile(props.confirm);

      if (Array.isArray(options)) {
        const selectedOptions = options
          .filter(option => option.isSelected())
          .map(option => ({ ...option, url: undefined }));

        instance.initial_options = selectedOptions.length
          ? selectedOptions
          : undefined;
      }

      instance.confirm = confirm;

      promises.push(...optionPromises, ...confirmPromises);

      return instance;
    }}
  />
);
