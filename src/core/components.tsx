import React, { ReactElement } from "react";
import {
  ActionsBlock,
  Button as SlackButton,
  ContextBlock,
  Datepicker,
  DividerBlock,
  ImageBlock as SlackImageBlock,
  ImageElement,
  InputBlock,
  Option as SlackOption,
  PlainTextInput,
  SectionBlock,
} from "@slack/web-api";
import { XOR } from "ts-xor";
import {
  InteractionEvent,
  MultiSelectOptionEvent,
  SearchOptionsEvent,
  SelectDateEvent,
  SelectOptionEvent,
} from "./interfaces";

type PheliaChild = false | null | undefined | ReactElement | ReactElement[];
type PheliaChildren = PheliaChild | PheliaChild[];

interface TextProps {
  /** The content of the text component */
  children: React.ReactText | React.ReactText[];
  /**
   * Indicates whether emojis in a text field should be escaped into the colon emoji format.
   * This field is only usable when type is plain_text.
   */
  emoji?: boolean;
  /** The formatting to use for this text object.  */
  type: "plain_text" | "mrkdwn";
  /**
   * When set to false (as is default) URLs will be auto-converted into links,
   * conversation names will be link-ified, and certain mentions will be automatically
   * parsed. Using a value of true will skip any preprocessing of this nature, although
   * you can still include manual parsing strings. This field is only usable when type is
   * mrkdwn.
   */
  verbatim?: boolean;
}

/**
 * An component containing some text, formatted either as plain_text or using mrkdwn,
 * our proprietary textual markup that's just different enough from Markdown to frustrate you.
 */
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
  /** The text inside the button. */
  children: string;
  /**
   * A Confirm component that defines an optional confirmation dialog
   * after the button is clicked.
   */
  confirm?: ReactElement;
  /**
   * Indicates whether emojis in the button should be escaped into the colon emoji format.
   */
  emoji?: boolean;
  /** Decorates buttons with alternative visual color schemes. Use this option with restraint. */
  style?: undefined | "danger" | "primary";
  /**
   * A URL to load in the user's browser when the button is clicked.
   * Maximum length for this field is 3000 characters. If you're using
   * url, you'll still receive an interaction payload and will need to
   * send an acknowledgement response.
   */
  url?: string;
}

interface ButtonWithOnClick extends ButtonBase {
  /** A callback ran when the button is clicked */
  onClick: (event: InteractionEvent) => void | Promise<void>;
  /**
   * An identifier for this action. You can use this when you receive an
   * interaction payload to identify the source of the action. Should be
   * unique among all other action_ids used elsewhere by your app. Maximum
   * length for this field is 255 characters.
   */
  action: string;
}

type ButtonProps = XOR<ButtonWithOnClick, ButtonBase>;

/**
 * An interactive component that inserts a button. The button can be a trigger for
 * anything from opening a simple link to starting a complex workflow.
 *
 * Works with block types: Section, Actions
 */
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
        text: { type: "plain_text", text: "", emoji: props.emoji },
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
      /** One of the available components. */
      accessory?: ReactElement;
      /** The head/title text component */
      text: ReactElement | string;
      /** Up to 10 child components */
      children?: PheliaChildren;
    }
  | {
      /** One of the available components. */
      accessory?: ReactElement;
      /** The head/title text component */
      text?: ReactElement | string;
      /** Up to 10 child components */
      children: PheliaChildren;
    };

/**
 * A section is one of the most flexible components available - it can be used as a
 * simple text block, in combination with text fields, or side-by-side with any
 * of the available block elements.
 *
 * Available in surfaces: Modals, Messages, Home tabs
 */
export const Section = (props: SectionProps) => (
  <component
    {...props}
    componentType="section"
    toSlackElement={(props, reconcile, promises): SectionBlock => {
      const instance: SectionBlock = {
        type: "section",
      };
      const [accessory, accessoryPromises] = reconcile(props.accessory);
      const [text, textPromises] = reconcile(props.text);

      instance.text = text;
      instance.accessory = accessory;

      if (instance.text && text.type === "text") {
        instance.text.type = "plain_text";
      }

      promises.push(...accessoryPromises, ...textPromises);

      return instance;
    }}
  />
);

interface ActionsProps {
  /**
   * An array of interactive element objects - buttons, select menus,
   * overflow menus, or date pickers. There is a maximum of 5 elements
   * in each action block.
   */
  children: PheliaChildren;
}

/**
 * A block that is used to hold interactive elements.
 *
 * Available in surfaces: Modals, Messages, Home tabs
 */
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
  /** The URL of the image to be displayed. Maximum length for this field is 3000 characters. */
  imageUrl: string;
  /**
   * A plain-text summary of the image. This should not contain any markup. Maximum length for
   * this field is 2000 characters.
   */
  alt: string;
}

/**
 * A simple image block, designed to make those cat photos really pop.
 *
 * Available in surfaces: Modals, Messages, Home tabs
 */
export const Image = (props: ImageProps) => (
  <component
    {...props}
    componentType="image"
    toSlackElement={(props): ImageElement => ({
      type: "image",
      image_url: props.imageUrl,
      alt_text: props.alt,
    })}
  />
);

interface ImageBlockProps {
  /** The URL of the image to be displayed. Maximum length for this field is 3000 characters. */
  imageUrl: string;
  /**
   * A plain-text summary of the image. This should not contain any markup. Maximum length for
   * this field is 2000 characters.
   */
  alt: string;
  /** Whether to enable the emoji prop on the title Text component */
  emoji?: boolean;
  /** A title for the image block */
  title?: string;
}

/**
 * An component to insert an image as part of a larger block of content. If you
 * want a block with only an image in it, you're looking for the Image component.
 *
 * Works with block types: Section, Context
 */
export const ImageBlock = (props: ImageBlockProps) => (
  <component
    {...props}
    componentType="image-block"
    toSlackElement={(props): SlackImageBlock => {
      const instance: any = {
        type: "image",
        image_url: props.imageUrl,
        alt_text: props.alt,
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

/**
 * A content divider, like an <hr>, to split up different blocks inside of a
 * message. The divider block is nice and neat.
 *
 * Available in surfaces: Modals, Messages, Home tabs
 */
export const Divider = () => (
  <component
    componentType="divider"
    toSlackElement={(): DividerBlock => ({ type: "divider" })}
  />
);

interface ContextProps {
  /** Child components to display within the Context */
  children: PheliaChildren;
}

/**
 * Displays message context, which can include both images and text.
 *
 * Available in surfaces: Modals, Messages, Home tabs
 */
export const Context = (props: ContextProps) => (
  <component
    {...props}
    componentType="context"
    toSlackElement={(): ContextBlock => ({ type: "context", elements: [] })}
  />
);

interface ConfirmProps {
  /** Components to display within the confirm dialog. */
  children: ReactElement | string;
  /**
   * A plain_text-only Text component to define the text of the button that confirms the
   * action. Maximum length for the text in this field is 30 characters.
   */
  confirm: ReactElement | string;
  /**
   * A plain_text-only Text component to define the text of the button that cancels the
   * action. Maximum length for the text in this field is 30 characters.
   */
  deny: ReactElement | string;
  /** Defines the color scheme applied to the confirm button. A value of danger will display
   * the button with a red background on desktop, or red text on mobile. A value of primary
   * will display the button with a green background on desktop, or blue text on mobile.
   * If this field is not provided, the default value will be primary.
   */
  style?: "danger" | "primary";
  /**
   * A plain_text-only Text component that defines the dialog's title. Maximum length for this
   * field is 100 characters.
   */
  title: ReactElement | string;
}

/**
 * A component that defines a dialog that provides a confirmation step to any interactive
 * component. This dialog will ask the user to confirm their action by offering a confirm
 * and deny buttons.
 */
export const Confirm = (props: ConfirmProps) => (
  <component
    {...props}
    componentType="confirm"
    toSlackElement={(props, reconcile, promises) => {
      const instance: any = {
        // using a function so the appendInitialChild can determine the type of the component
        // whereas slack forbids a confirm object to have a 'type' property
        isConfirm: () => true,

        style: props.style,
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
  /**
   * A Text component that defines the text shown in the option on the menu. Overflow, select,
   * and multi-select menus can only use plain_text objects, while radio buttons and checkboxes
   * can use mrkdwn text objects. Maximum length for the text in this field is 75 characters.
   */
  children: ReactElement | string;
  /**
   * The string value that will be passed to your app when this option is chosen. Maximum
   * length for this field is 75 characters.
   */
  value: string;
  /**
   * A plain_text only Text component that defines a line of descriptive text shown below
   * the text field beside the radio button. Maximum length for the text object within this
   * field is 75 characters.
   */
  description?: ReactElement | string;
  /**
   * A URL to load in the user's browser when the option is clicked. The url attribute is only
   * available in overflow menus. Maximum length for this field is 3000 characters. If you're
   * using url, you'll still receive an interaction payload and will need to send an acknowledgement
   * response.
   */
  url?: string;
  /** Whether the Option is selected. */
  selected?: boolean;
}

/**
 * A component that represents a single selectable item in a select menu, multi-select menu,
 * checkbox group, radio button group, or overflow menu.
 */
export const Option = (props: OptionProps) => (
  <component
    {...props}
    componentType="option"
    toSlackElement={(props, reconcile, promises): Promise<SlackOption> => {
      const instance: any = {
        isSelected: () => props.selected,
        isOption: () => true,
        value: props.value,
        url: props.url,
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
  /**
   * 	An identifier for the action triggered when a menu option is selected. You can use
   * this when you receive an interaction payload to identify the source of the action.
   * Should be unique among all other action_ids used elsewhere by your app. Maximum length
   * for this field is 255 characters.
   */
  action: string;
  /**
   * A Confirm component that defines an optional confirmation dialog that appears after a
   * date is selected.
   */
  confirm?: ReactElement;
  /**
   * The initial date that is selected when the element is loaded. This should be in the
   * format YYYY-MM-DD.
   */
  initialDate?: string;
  /** A callback for when a date is selected */
  onSelect?: (event: SelectDateEvent) => void | Promise<void>;
  /**
   * A plain_text only Text component that defines the placeholder text shown on the datepicker.
   * Maximum length for the text in this field is 150 characters.
   */
  placeholder?: ReactElement | string;
}

/**
 * An element which lets users easily select a date from a calendar style UI.
 *
 * Works with block types: Section, Actions, Input
 */
export const DatePicker = (props: DatePickerProps) => (
  <component
    {...props}
    componentType="confirm"
    toSlackElement={(props, reconcile, promises): Datepicker => {
      const instance: Datepicker = {
        type: "datepicker",
        initial_date: props.initialDate,
        action_id: props.action,
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
  /** Array of Actions, Context, Divider, ImageBlock, or Section components.	 */
  children: PheliaChildren;
  /** The head/title text message. */
  text?: string;
}

/**
 * App-published messages are dynamic yet transient spaces. They allow users to
 * complete workflows among their Slack conversations.
 */
export const Message = (props: MessageProps) => (
  <component
    {...props}
    componentType="message"
    toSlackElement={({ text }) => ({ blocks: [], text })}
  />
);

interface ModalProps {
  /** Array of Actions, Context, Divider, ImageBlock, Input, or Section components	 */
  children: PheliaChildren;
  /** The title of the modal. */
  title: ReactElement | string;
  /**
   * An optional plain_text Text component that defines the text displayed in the submit button
   * at the bottom-right of the view. submit is required when an input block is within the
   * blocks array. Max length of 24 characters.
   */
  submit?: ReactElement | string;
  /**
   * An optional plain_text Text component that defines the text displayed in the close button
   * at the bottom-right of the view. Max length of 24 characters.
   */
  close?: ReactElement | string;
}

/**
 * Modals provide focused spaces ideal for requesting and collecting data from users,
 * or temporarily displaying dynamic and interactive information.
 */
export const Modal = (props: ModalProps) => (
  <component
    {...props}
    componentType="modal"
    toSlackElement={(props, reconcile, promises) => {
      const instance: any = {
        type: "modal",
        blocks: [],
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
  /**
   * A label that appears above an input component in the form of a text component that must
   * have type of plain_text. Maximum length for the text in this field is 2000 characters.
   */
  label: string | ReactElement;
  /**
   * A plain-text input element, a select menu element, a multi-select menu element, or a datepicker.
   */
  children: ReactElement;
  /**
   * An optional hint that appears below an input element in a lighter grey. It must be a a text
   * component with a type of plain_text. Maximum length for the text in this field is 2000 characters.
   */
  hint?: string | ReactElement;
  /**
   * A boolean that indicates whether the input element may be empty when a user submits the modal.
   *
   * @default false
   */
  optional?: boolean;
}

/**
 * A block that collects information from users - it can hold a plain-text input element, a
 * select menu element, a multi-select menu element, or a datepicker.
 *
 * Read our guide to using modals to learn how input blocks pass information to your app.
 *
 * Available in surfaces: Modals
 */
export const Input = (props: InputProps) => (
  <component
    {...props}
    componentType="input"
    toSlackElement={(props, reconcile, promises): InputBlock => {
      const instance: any = {
        type: "input",
        optional: props.optional,
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
  /**
   * 	An identifier for the input value when the parent modal is submitted. You can use
   * this when you receive a view_submission payload to identify the value of the input
   * element. Should be unique among all other action_ids used elsewhere by your app. Maximum
   * length for this field is 255 characters.
   */
  action: string;
  /**	The initial value in the plain-text input when it is loaded. */
  initialValue?: string;
  /**
   * The maximum length of input that the user can provide. If the user provides more, they
   * will receive an error.
   */
  maxLength?: number;
  /**
   * The minimum length of input that the user must provide. If the user provides less,
   * they will receive an error. Maximum value is 3000.
   */
  minLength?: number;
  /**
   * Indicates whether the input will be a single line (false) or a larger textarea (true).
   *
   * @default false
   */
  multiline?: boolean;
  /**
   * A plain_text only Text component that defines the placeholder text shown in the plain-text
   * input. Maximum length for the text in this field is 150 characters.
   */
  placeholder?: ReactElement | string;
}

/**
 * A plain-text input, similar to the HTML <input> tag, creates a field where a user can
 * enter freeform data. It can appear as a single-line field or a larger textarea using
 * the multiline flag.
 *
 * Plain-text input elements are currently only available in modals. To use them, you will
 * need to make some changes to prepare your app. Read about preparing your app for modals.
 *
 * Works with block types: Section, Actions, Input
 */
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
        multiline: props.multiline,
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
  /**
   * 	An identifier for the action triggered when the checkbox group is changed. You can use
   * this when you receive an interaction payload to identify the source of the action. Should
   * be unique among all other action_ids used elsewhere by your app. Maximum length for this
   * field is 255 characters.
   */
  action: string;
  /** An array of Option components */
  children: PheliaChildren;
  /**
   * A Confirm component that defines an optional confirmation dialog that appears after clicking
   * one of the checkboxes in this element.
   */
  confirm?: ReactElement;
  /** A callback for when a user selects a checkbox */
  onSelect?: (event: MultiSelectOptionEvent) => void | Promise<void>;
}

/**
 * A checkbox group that allows a user to choose multiple items from a list of possible options.
 *
 * Checkboxes are only supported in the following app surfaces: Home tabs Modals
 *
 * Works with block types: Section, Actions, Input
 */
export const Checkboxes = (props: CheckboxesProps) => (
  <component
    {...props}
    componentType="checkboxes"
    toSlackElement={(props, reconcile, promises) => {
      const instance: any = {
        type: "checkboxes",
        action_id: props.action,
        options: [],
      };

      const [{ fields: options }, optionPromises] = reconcile(
        React.createElement(Section, { children: props.children })
      );
      const [confirm, confirmPromises] = reconcile(props.confirm);

      if (Array.isArray(options)) {
        const selectedOptions = options
          .filter((option) => option.isSelected)
          .map((option) => ({ ...option, url: undefined }));

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

interface OverflowMenuProps {
  /**
   * 	An identifier for the action triggered when a menu option is selected. You can
   * use this when you receive an interaction payload to identify the source of the
   * action. Should be unique among all other action_ids used elsewhere by your app.
   * Maximum length for this field is 255 characters.
   */
  action: string;
  /**
   * An array of Option components to display in the menu. Maximum number of options
   * is 5, minimum is 2.
   */
  children: PheliaChildren;
  /**
   * A confirm object that defines an optional confirmation dialog that appears after a
   * menu item is selected.
   */
  confirm?: ReactElement;
  /** A callback called once an Option is selected */
  onSelect?: (event: SelectOptionEvent) => void | Promise<void>;
}

/**
 * This is like a cross between a button and a select menu - when a user clicks on
 * this overflow button, they will be presented with a list of options to choose from.
 * Unlike the select menu, there is no typeahead field, and the button always appears
 * with an ellipsis ("…") rather than customisable text.
 *
 * As such, it is usually used if you want a more compact layout than a select menu,
 * or to supply a list of less visually important actions after a row of buttons. You
 * can also specify simple URL links as overflow menu options, instead of actions.
 *
 * Works with block types: Section, Actions
 */
export const OverflowMenu = (props: OverflowMenuProps) => (
  <component
    {...props}
    componentType="overflow"
    toSlackElement={(props, reconcile, promises) => {
      const instance: any = {
        type: "overflow",
        action_id: props.action,
        options: [],
      };

      const [confirm, confirmPromises] = reconcile(props.confirm);

      instance.confirm = confirm;

      promises.push(...confirmPromises);

      return instance;
    }}
  />
);

interface RadioButtonsProps {
  /**
   * 	An identifier for the action triggered when the radio button group is changed. You can
   * use this when you receive an interaction payload to identify the source of the action.
   * Should be unique among all other action_ids used elsewhere by your app. Maximum length
   * for this field is 255 characters.
   */
  action: string;
  /** Option component(s) */
  children: PheliaChildren;
  /**
   * A Confirm component that defines an optional confirmation dialog that appears after clicking
   * one of the radio buttons in this element.
   */
  confirm?: ReactElement;
  /** A callback called once an Option is selected */
  onSelect?: (event: SelectOptionEvent) => void | Promise<void>;
}

/**
 * Radio buttons are only supported in the following app surfaces: Home tabs Modals
 *
 * A radio button group that allows a user to choose one item from a list of possible options.
 *
 * Works with block types: Section, Actions, Input
 */
export const RadioButtons = (props: RadioButtonsProps) => (
  <component
    {...props}
    componentType="radio-buttons"
    toSlackElement={(props, reconcile, promises) => {
      const instance: any = {
        type: "radio_buttons",
        action_id: props.action,
        options: [],
      };

      const [{ fields: options }, optionPromises] = reconcile(
        React.createElement(Section, { children: props.children })
      );
      const [confirm, confirmPromises] = reconcile(props.confirm);

      if (Array.isArray(options)) {
        const selectedOption = options
          .map((option) => ({
            ...option,
            url: undefined,
          }))
          .find((option) => option.isSelected);

        instance.initial_option = selectedOption;
      }

      instance.confirm = confirm;

      promises.push(...optionPromises, ...confirmPromises);
      return instance;
    }}
  />
);

interface OptionGroupProps {
  /**
   * A plain_text only Text component that defines the label shown above this
   * group of options. Maximum length for the text in this field is 75 characters.
   */
  label: ReactElement | string;
  /**
   * An array of Option components that belong to this specific group. Maximum of 100 items.
   */
  children: PheliaChildren;
}

/** Provides a way to group options in a select menu or multi-select menu. */
export const OptionGroup = (props: OptionGroupProps) => (
  <component
    {...props}
    componentType="option-group"
    toSlackElement={(props, reconcile, promises) => {
      const instance: any = {
        isOptionGroup: () => true,
        options: [],
      };

      const [label, labelPromises] = reconcile(props.label);

      instance.label = label;

      if (instance.label) {
        instance.label.type = "plain_text";
      }

      promises.push(...labelPromises);

      return instance;
    }}
  />
);

interface SelectMenuBase {
  /**
   * An identifier for the action triggered when a menu option is selected. You can
   * use this when you receive an interaction payload to identify the source of the
   * action. Should be unique among all other action_ids used elsewhere by your app.
   * Maximum length for this field is 255 characters.
   */
  action: string;
  /**
   * A plain_text only Text component that defines the placeholder text shown on
   * the menu. Maximum length for the text in this field is 150 characters.
   */
  placeholder: ReactElement | string;
  /**
   * A Confirm component that defines an optional confirmation dialog that
   * appears after a menu item is selected.
   */
  confirm?: ReactElement;
  /** Callback for when an option is selected */
  onSelect?: (event: SelectOptionEvent) => void | Promise<void>;
}

interface StaticSelectMenu extends SelectMenuBase {
  /** The type of the select */
  type: "static";
  /** An array of Option components. Maximum number of options is 100. */
  children: PheliaChildren;
}

interface UserSelectMenu extends SelectMenuBase {
  /** The type of the select */
  type: "users";
  /** The user ID of any valid user to be pre-selected when the menu loads. */
  initialUser?: string;
}

interface ChannelSelectMenu extends SelectMenuBase {
  /** The type of the select */
  type: "channels";
  /**	The ID of any valid public channel to be pre-selected when the menu loads. */
  initialChannel?: string;
}

export type SearchOptions = (
  event: SearchOptionsEvent
) => ReactElement[] | Promise<ReactElement[]>;

interface ExternalSelectMenu extends SelectMenuBase {
  /** The type of the select */
  type: "external";
  /**
   * A single option that exactly matches one of the options within the options
   * or option_groups loaded from the external data source. This option will
   * be selected when the menu initially loads.
   */
  initialOption?: ReactElement;
  /** Called when a user is search the menu options. Should return result options */
  onSearchOptions: SearchOptions;
  /**
   * 	When the typeahead field is used, a request will be sent on every character
   * change. If you prefer fewer requests or more fully ideated queries, use the
   * min_query_length attribute to tell Slack the fewest number of typed characters
   * required before dispatch.
   *
   * @default 3
   */
  minQueryLength?: number;
}

interface FilterOptions {
  /**
   * Indicates which type of conversations should be included in the list. When
   * this field is provided, any conversations that do not match will be excluded
   */
  include?: ("im" | "mpim" | "private" | "public")[];
  /**
   * Indicates whether to exclude external shared channels from conversation lists
   *
   * @default false
   */
  excludeExternalSharedChannels?: boolean;
  /**
   * Indicates whether to exclude bot users from conversation lists.
   *
   * @default false
   */
  excludeBotUsers?: boolean;
}

interface ConversationSelectMenu extends SelectMenuBase {
  /** The type of the select */
  type: "conversations";
  /** The ID of any valid conversation to be pre-selected when the menu loads. */
  initialConversation?: string;
  /**
   * A filter object that reduces the list of available conversations using the
   * specified criteria.
   */
  filter?: FilterOptions;
}

type SelectMenuProps =
  | ChannelSelectMenu
  | ConversationSelectMenu
  | ExternalSelectMenu
  | StaticSelectMenu
  | UserSelectMenu;

/**
 * A select menu, just as with a standard HTML <select> tag, creates a drop down menu
 * with a list of options for a user to choose. The select menu also includes type-ahead
 * functionality, where a user can type a part or all of an option string to filter the list.
 *
 * There are different types of select menu that depend on different data sources for their lists of options:
 *
 * - Menu with static options
 * - Menu with external data source
 * - Menu with user list
 * - Menu with conversations list
 * - Menu with channels list
 *
 * Works with block types: Section, Actions, Input
 */
export const SelectMenu = (props: SelectMenuProps) => (
  <component
    {...props}
    componentType="select-menu"
    toSlackElement={(props, reconcile, promises) => {
      const instance: any = {
        type: props.type + "_select",
        action_id: props.action,
        onSearchOptions: props.onSearchOptions,
      };

      const [confirm, confirmPromises] = reconcile(props.confirm);
      const [placeholder, placeholderPromises] = reconcile(props.placeholder);
      const [{ fields: optionsOrGroups }, optionPromises] = reconcile(
        React.createElement(Section, { children: props.children })
      );
      const [initialOption, initialOptionPromises] = reconcile(
        props.initialOption
      );

      if (
        props.type === "static" &&
        Array.isArray(optionsOrGroups) &&
        optionsOrGroups.length
      ) {
        const isGroup = Boolean(optionsOrGroups[0].isOptionGroup);
        let options = optionsOrGroups;

        if (isGroup) {
          options = optionsOrGroups.reduce((options, group) => {
            options.push(...group.options);
            return options;
          }, []);
        }

        const selectedOption = options
          .map((option) => ({
            ...option,
            url: undefined,
          }))
          .find((option) => option.isSelected);

        instance.initial_option = selectedOption;
      }

      if (props.type === "external") {
        if (initialOption) {
          instance.initial_option = { ...initialOption, url: undefined };
        }

        instance.min_query_length = props.minQueryLength;
      }

      if (props.type === "users") {
        instance.initial_user = props.initialUser;
      }

      if (props.type === "channels") {
        instance.initial_channel = props.initialChannel;
      }

      if (props.type === "conversations") {
        instance.initial_conversation = props.initialConversation;

        if (props.filter) {
          instance.filter = {};
          instance.filter.include = props.filter.include;
          instance.filter.exclude_external_shared_channels =
            props.filter.excludeExternalSharedChannels;
          instance.filter.exclude_bot_users = props.filter.excludeBotUsers;
        }
      }

      instance.confirm = confirm;
      instance.placeholder = placeholder;

      if (instance.placeholder) {
        instance.placeholder.type = "plain_text";
      }

      promises.push(
        ...confirmPromises,
        ...placeholderPromises,
        ...optionPromises,
        ...initialOptionPromises
      );

      return instance;
    }}
  />
);

SelectMenu.defaultProps = {
  type: "static",
} as SelectMenuProps;

interface MultiSelectMenuBase {
  /**
   * 	An identifier for the action triggered when a menu option is selected.
   * You can use this when you receive an interaction payload to identify the
   * source of the action. Should be unique among all other action_ids used
   * elsewhere by your app. Maximum length for this field is 255 characters.
   */
  action: string;
  /**
   * A plain_text only Text component that defines the placeholder text shown on
   * the menu. Maximum length for the text in this field is 150 characters.
   */
  placeholder: ReactElement | string;
  /**
   * A Confirm component that defines an optional confirmation dialog that appears
   * before the multi-select choices are submitted.
   */
  confirm?: ReactElement;
  /** Callback for when a menu item is selected */
  onSelect?: (event: MultiSelectOptionEvent) => void | Promise<void>;
  /**
   * Specifies the maximum number of items that can be selected in the menu.
   * Minimum number is 1.
   */
  maxSelectedItems?: number;
}

interface MultiStaticSelectMenu extends MultiSelectMenuBase {
  /** The type of the multi select. */
  type: "static";
  /** An array of Option components. Maximum number of options is 100. */
  children: PheliaChildren;
}

interface MultiUserSelectMenu extends MultiSelectMenuBase {
  /** The type of the multi select. */
  type: "users";
  /** An array of user IDs of any valid users to be pre-selected when the menu loads. */
  initialUsers?: string[];
}

interface MultiChannelSelectMenu extends MultiSelectMenuBase {
  /** The type of the multi select. */
  type: "channels";
  /** 
   * An array of one or more IDs of any valid public channel to be pre-selected 
   * when the menu loads.
   v*/
  initialChannels?: string[];
}

interface MultiExternalSelectMenu extends MultiSelectMenuBase {
  /** The type of the multi select. */
  type: "external";
  /**
   * An array of Option component that exactly match one or more of the
   * options within options or option_groups. These options will be
   * selected when the menu initially loads.
   */
  initialOptions?: ReactElement[];
  /** Called when a user is search the select options. Should return result options */
  onSearchOptions: SearchOptions;
  /**
   * When the typeahead field is used, a request will be sent on every character change.
   * If you prefer fewer requests or more fully ideated queries, use the min_query_length
   * attribute to tell Slack the fewest number of typed characters required before dispatch
   *
   * @default 3
   */
  minQueryLength?: number;
}

interface MultiConversationSelectMenu extends MultiSelectMenuBase {
  /** The type of the multi select. */
  type: "conversations";
  /**
   * An array of one or more IDs of any valid conversations to be
   * pre-selected when the menu loads.
   */
  initialConversations?: string[];
  /**
   * A filter object that reduces the list of available conversations using the
   * specified criteria.
   */
  filter?: FilterOptions;
}

type MultiSelectMenuProps =
  | MultiChannelSelectMenu
  | MultiConversationSelectMenu
  | MultiExternalSelectMenu
  | MultiStaticSelectMenu
  | MultiUserSelectMenu;

/**
 * A multi-select menu allows a user to select multiple items from a list of options.
 * Just like regular select menus, multi-select menus also include type-ahead
 * functionality, where a user can type a part or all of an option string to filter the list.
 *
 * There are different types of multi-select menu that depend on different data sources for their lists of options:
 *
 * - Menu with static options
 * - Menu with external data source
 * - Menu with user list
 * - Menu with conversations list
 * - Menu with channels list
 *
 * Works with block types: Section, Input
 */
export const MultiSelectMenu = (props: MultiSelectMenuProps) => (
  <component
    {...props}
    componentType="multi-select-menu"
    toSlackElement={(props, reconcile, promises) => {
      const instance: any = {
        type: "multi_" + props.type + "_select",
        action_id: props.action,
        max_selected_items: props.maxSelectedItems,
        onSearchOptions: props.onSearchOptions,
      };

      const [confirm, confirmPromises] = reconcile(props.confirm);
      const [placeholder, placeholderPromises] = reconcile(props.placeholder);
      const [{ fields: optionsOrGroups }, optionPromises] = reconcile(
        React.createElement(Section, { children: props.children })
      );
      const [{ fields: initialOptions }, initialOptionsPromises] = reconcile(
        React.createElement(Section, { children: props.children })
      );

      if (
        props.type === "static" &&
        Array.isArray(optionsOrGroups) &&
        optionsOrGroups.length
      ) {
        const isGroup = Boolean(optionsOrGroups[0].isOptionGroup);
        let options = optionsOrGroups;

        if (isGroup) {
          options = optionsOrGroups.reduce((options, group) => {
            options.push(...group.options);
            return options;
          }, []);
        }

        const selectedOptions = options
          .map((option) => ({
            ...option,
            url: undefined,
          }))
          .filter((option) => option.isSelected);

        instance.initial_options = selectedOptions;
      }

      if (props.type === "external") {
        instance.initial_options = initialOptions;
        instance.min_query_length = props.minQueryLength;
      }

      if (props.type === "users") {
        instance.initial_users = props.initialUsers;
      }

      if (props.type === "channels") {
        instance.initial_channels = props.initialChannels;
      }

      if (props.type === "conversations") {
        instance.initial_conversations = props.initialConversations;

        if (props.filter) {
          instance.filter = {};
          instance.filter.include = props.filter.include;
          instance.filter.exclude_external_shared_channels =
            props.filter.excludeExternalSharedChannels;
          instance.filter.exclude_bot_users = props.filter.excludeBotUsers;
        }
      }

      instance.confirm = confirm;
      instance.placeholder = placeholder;

      if (instance.placeholder) {
        instance.placeholder.type = "plain_text";
      }

      promises.push(
        ...confirmPromises,
        ...placeholderPromises,
        ...optionPromises,
        ...initialOptionsPromises
      );

      return instance;
    }}
  />
);

MultiSelectMenu.defaultProps = {
  type: "static",
} as MultiSelectMenuProps;

interface HomeProps {
  /** An array of Actions, Context, Divider, ImageBlock, or Section components	 */
  children: PheliaChildren;

  /** A callback ran when home app is loaded. */
  onLoad?: (event: InteractionEvent) => Promise<void> | void;

  /** A callback ran when home app is updated. */
  onUpdate?: (event: InteractionEvent) => Promise<void> | void;
}

/**
 * The Home tab is a persistent, yet dynamic interface for apps that lives within the App Home.
 */
export const Home = (props: HomeProps) => (
  <component
    {...props}
    componentType="home"
    toSlackElement={() => {
      const instance: any = {
        type: "home",
        blocks: [],
      };

      return instance;
    }}
  />
);
