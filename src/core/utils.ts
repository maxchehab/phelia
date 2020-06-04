import fs from "fs";
import path from "path";

import {
  InteractionEvent,
  MultiSelectOptionEvent,
  PheliaMessage,
  PheliaMessageMetadata,
  SelectDateEvent,
  SelectOptionEvent,
  SlackUser
} from "./interfaces";

/** Convert an action to an event. */
export function generateEvent(
  action: any,
  user: SlackUser
):
  | SelectDateEvent
  | InteractionEvent
  | MultiSelectOptionEvent
  | SelectOptionEvent {
  if (action.type === "datepicker") {
    return { date: action.selected_date, user };
  }

  if (
    action.type === "checkboxes" ||
    action.type === "multi_static_select" ||
    action.type === "multi_external_select"
  ) {
    return {
      selected: action.selected_options.map((option: any) => option.value),
      user
    };
  }

  if (action.type === "multi_users_select") {
    return { user, selected: action.selected_users };
  }

  if (action.type === "multi_channels_select") {
    return { user, selected: action.selected_channels };
  }

  if (action.type === "multi_conversations_select") {
    return { user, selected: action.selected_conversations };
  }

  if (action.type === "users_select") {
    return { user, selected: action.selected_user };
  }

  if (action.type === "conversations_select") {
    return { user, selected: action.selected_conversation };
  }

  if (action.type === "channels_select") {
    return { user, selected: action.selected_channel };
  }

  if (
    action.type === "overflow" ||
    action.type === "radio_buttons" ||
    action.type === "static_select" ||
    action.type === "external_select"
  ) {
    return { user, selected: action.selected_option.value };
  }

  return { user };
}

const PACKED_ACTION_DELIM = "###";
/** Packs an actionID into a prefix. */
export function packActionID(actionID: string, prefix: string | undefined): string {
  return prefix ? `${prefix}${PACKED_ACTION_DELIM}${actionID}`: actionID;
}

type UnpackedActionID = {
  /** Prefix, like a responseURL, for an actionID.*/
  prefix?: string | undefined;
  /** The original actionID specified in a component */
  actionID: string;
};
/** Unpacks an actionID from a packed actionID */
export function unpackActionID(serialized: string): UnpackedActionID {
  const [head, tail] = serialized.split(PACKED_ACTION_DELIM);
  if (tail == null) {
    return {
      actionID: head,
    };
  }

  return {
    prefix: head,
    actionID: tail,
  };
}

/** Get a unique key from a message payload */
export function parseMessageKey(payload: any) {
  if (payload?.view?.id) {
    return payload.view.id;
  }

  const {actions} = payload;
  const unwrappedAction = (Array.isArray(actions) ? actions : [])
    .map((v) => {
        return v.action_id ? unpackActionID(v.action_id) : null
    })
    .find((v) => v.prefix !== null);

  if (unwrappedAction) {
    return unwrappedAction.prefix;
  }

  if (payload.container) {
    const { channel_id, message_ts, view_id, type } = payload.container;
    return type === "view" ? view_id : `${channel_id}:${message_ts}`;
  }
}

/** Transform a message into message metadata */
export function loadMessagesFromArray(
  messages: PheliaMessage[]
): PheliaMessageMetadata[] {
  return messages.map(message => ({ message, name: message.name }));
}

/** Read messages from a directory */
export function loadMessagesFromDirectory(
  dir: string
): PheliaMessageMetadata[] {
  const modules = new Array();

  fs.readdirSync(dir).forEach(file => {
    try {
      const module = require(path.join(dir, file));
      modules.push(module);
    } catch (error) {}
  });

  return modules.map(m => ({
    message: m.default,
    name: m.default.name
  }));
}
