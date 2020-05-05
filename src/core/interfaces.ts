export type UseModal = (
  key: string,
  modal: PheliaModal,
  onSubmit?: (event: SubmitEvent) => void | Promise<void>,
  onCancel?: (event: InteractionEvent) => void | Promise<void>
) => (props?: any) => Promise<void>;

export type UseState = <t = any>(
  key: string,
  initialValue?: t
) => [t, (value: t) => void];

export interface PheliaMessageProps<p = never> {
  /** The props for the component */
  props?: p;
  /** A hook to create some state for a component */
  useState: UseState;
  /** A hook to create a modal for a component */
  useModal: UseModal;
}

export interface PheliaHomeProps {
  /** A hook to create some state for a component */
  useState: UseState;
  /** A hook to create a modal for a component */
  useModal: UseModal;
  /** The user interacting with the home page */
  user: SlackUser;
}

export interface SlackUser {
  /** Unique identifier for the slack user */
  id: string;
  /** The user name of the slack user */
  username: string;
  /** The user name of the slack user */
  name: string;
  /** The team the user is associated with */
  team_id: string;
}

export type PheliaStorage = AsyncStorage | Storage;
export type PheliaMessage<p = any> = (
  props: PheliaMessageProps<p>
) => JSX.Element;

export type PheliaModalProps<p = any> = Omit<PheliaMessageProps<p>, "useModal">;

export type PheliaModal<p = any> = (props: PheliaModalProps<p>) => JSX.Element;
export type PheliaHome = (props: PheliaHomeProps) => JSX.Element;

export interface AsyncStorage {
  /** Set a value in storage */
  set: (key: string, value: string) => Promise<void>;
  /** Get a value in storage */
  get: (key: string) => Promise<string>;
}

export interface Storage {
  /** Set a value in storage */
  set: (key: string, value: string) => void;
  /** Get a value in storage */
  get: (key: string) => string;
}

export interface Action {
  /** The actions */
  value: string;
  /** The event for the action */
  event: InteractionEvent;

  /** The type of action */
  type?: "interaction" | "onload" | "onupdate" | "oncancel" | "onsubmit";
}

export interface PheliaMessageMetadata {
  /** A phelia message component */
  message: PheliaMessage;
  /** The name of the message */
  name: string;
}

export interface InteractionEvent {
  /** A user the event is associated with */
  user: SlackUser;
}

export interface SubmitEvent extends InteractionEvent {
  /** The object constructed by the form */
  form: { [key: string]: any };
}

export interface MultiSelectOptionEvent extends InteractionEvent {
  /** The selected Option values */
  selected: string[];
}

export interface SelectDateEvent extends InteractionEvent {
  /** The selected formatted date */
  date: string;
}

export interface SelectOptionEvent extends InteractionEvent {
  /** The selected Option value */
  selected: string;
}

export interface SearchOptionsEvent extends InteractionEvent {
  /** The query for the typeahead */
  query: string;
}

export interface PheliaMessageContainer {
  /** The channel the message is going to */
  channelID: string;
  /** The user that made the message */
  invokerKey: string;
  /** The text content of the message */
  message: string;
  /** An id for a modal */
  modalKey: string;
  /** The name of the phelia component */
  name: string;
  /** Props for a phelia component */
  props: { [key: string]: any };
  /** State for a phelia component */
  state: { [key: string]: any };
  /**  */
  ts: string;
  /** The type of phelia component surface */
  type: "message" | "modal" | "home";
  /** An id for the surface */
  viewID: string;
  /** A user who interacts with the message */
  user: SlackUser;
}

export type MessageCallback = () => PheliaMessage[];
