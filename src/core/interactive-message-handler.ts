import fs from "fs";
import path from "path";

import { createMessageAdapter } from "@slack/interactive-messages";
import { MessageAdapterOptions } from "@slack/interactive-messages/dist/adapter";

import { PheliaMessage, PheliaClient } from "./phelia-client";
import { render } from "./renderer";
import React, { useState as reactUseState } from "react";

interface PheliaMessageMetadata {
  message: PheliaMessage;
  name: string;
}

interface PheliaMessageContainer {
  name: string;
  props: { [key: string]: any };
  state: { [key: string]: any };
}

type MessageCallback = () => PheliaMessage[];

export function interactiveMessageHandler(
  signingSecret: string,
  messages: string | PheliaMessage[] | MessageCallback,
  slackOptions?: MessageAdapterOptions
) {
  const pheliaMessages =
    typeof messages === "string"
      ? loadMessagesFromDirectory(messages)
      : typeof messages === "function"
      ? loadMessagesFromArray(messages())
      : loadMessagesFromArray(messages);

  const messageCache = pheliaMessages.reduce(
    (cache, { message, name }) => cache.set(name, message),
    new Map<string, PheliaMessage>()
  );

  console.log(messageCache);

  const adapter = createMessageAdapter(signingSecret, slackOptions);

  adapter.action({ type: "button" }, async (payload, respond) => {
    const { channel_id, message_ts } = payload.container;
    const messageKey = `${channel_id}:${message_ts}`;

    const rawMessageContainer = await PheliaClient.Storage.get(messageKey);

    if (!rawMessageContainer) {
      throw new Error(
        `Could not find Message Container with key ${messageKey} in storage.`
      );
    }

    const { name, state, props }: PheliaMessageContainer = JSON.parse(
      rawMessageContainer
    );

    function useState<t>(
      key: string,
      initialValue: t
    ): [t, (value: t) => void] {
      const [_, setState] = reactUseState(initialValue);

      return [
        state[key],
        (newValue: t): void => {
          state[key] = newValue;
          setState(newValue);
        },
      ];
    }

    for (const { value } of payload.actions) {
      render(
        React.createElement(messageCache.get(name), { useState, props }),
        value
      );
    }

    const blocks = render(
      React.createElement(messageCache.get(name), { useState, props })
    );

    await PheliaClient.Storage.set(
      messageKey,
      JSON.stringify({
        name,
        state,
        props,
      })
    );

    respond({ blocks });
  });

  return adapter.requestListener();
}

function loadMessagesFromArray(
  messages: PheliaMessage[]
): PheliaMessageMetadata[] {
  return messages.map((message) => ({ message, name: message.name }));
}

function loadMessagesFromDirectory(dir: string): PheliaMessageMetadata[] {
  const modules = new Array();

  fs.readdirSync(dir).forEach((file) => {
    try {
      const module = require(path.join(dir, file));
      modules.push(module);
    } catch (error) {}
  });

  return modules.map((m) => ({
    message: m.default,
    name: m.default.name,
  }));
}
