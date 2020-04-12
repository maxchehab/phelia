type UseModal = (
  key: string,
  modal: PheliaModal,
  onSubmit?: (event: SubmitEvent) => void | Promise<void>,
  onCancel?: (event: InteractionEvent) => void | Promise<void>
) => (props?: any) => Promise<void>;

type UseState = <t = any>(
  key: string,
  initialValue?: t
) => [t, (value: t) => void];

export interface PheliaMessageProps<p = never> {
  props?: p;
  useState: UseState;
  useModal: UseModal;
}

export interface PheliaHomeProps {
  useState: UseState;
  useModal: UseModal;
  user: SlackUser;
}

export interface SlackUser {
  id: string;
  username: string;
  name: string;
  team_id: string;
}

export type PheliaStorage = AsyncStorage | Storage;
export type PheliaMessage<p = any> = (
  props: PheliaMessageProps<p>
) => JSX.Element;

export type PheliaModalProps<p> = Omit<PheliaMessageProps<p>, "useModal">;

export type PheliaModal<p = any> = (props: PheliaModalProps<p>) => JSX.Element;
export type PheliaHome = (props: PheliaHomeProps) => JSX.Element;

export interface AsyncStorage {
  set: (key: string, value: string) => Promise<void>;
  get: (key: string) => Promise<string>;
}

export interface Storage {
  set: (key: string, value: string) => void;
  get: (key: string) => string;
}

export interface Action {
  value: string;
  event: InteractionEvent;
}

export interface PheliaMessageMetadata {
  message: PheliaMessage;
  name: string;
}

export interface InteractionEvent {
  user: SlackUser;
}

export interface SubmitEvent extends InteractionEvent {
  form: { [key: string]: any };
}

export interface MultiSelectOptionEvent extends InteractionEvent {
  selected: string[];
}

export interface SelectDateEvent extends InteractionEvent {
  date: string;
}

export interface SelectOptionEvent extends InteractionEvent {
  selected: string;
}

export interface SearchOptionsEvent extends InteractionEvent {
  query: string;
}

export interface PheliaMessageContainer {
  channelID: string;
  invokerKey: string;
  message: string;
  modalKey: string;
  name: string;
  props: { [key: string]: any };
  state: { [key: string]: any };
  ts: string;
  type: "message" | "modal" | "home";
  viewID: string;
}

export type MessageCallback = () => PheliaMessage[];
