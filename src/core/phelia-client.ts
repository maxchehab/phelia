import React from "react";
import { WebClient, WebClientOptions } from "@slack/web-api";

import { render } from "./renderer";

export interface PheliaMessageProps<p = never> {
  props?: p;
  useState: (key: string, initialValue?: any) => any;
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

export interface AsyncStorage {
  set: (key: string, value: string) => Promise<void>;
  get: (key: string) => Promise<string>;
}

export interface Storage {
  set: (key: string, value: string) => void;
  get: (key: string) => string;
}

export class PheliaClient {
  private readonly client: WebClient;

  static Storage: PheliaStorage = new Map<string, string>();

  static SetStorage(storage: PheliaStorage) {
    this.Storage = storage;
  }

  constructor(token: string, slackOptions?: WebClientOptions) {
    this.client = new WebClient(token, slackOptions);
  }

  async postMessage<p>(
    message: PheliaMessage<p>,
    props: p,
    channel: string,
    title: string
  ) {
    const initializedState: { [key: string]: any } = {};

    function useState<t>(
      key: string,
      initialValue?: t
    ): [t, (value: t) => void] {
      initializedState[key] = initialValue;
      return [initialValue, (_: t): void => null];
    }

    const blocks = render(React.createElement(message, { useState, props }));

    const { channel: channelID, ts } = await this.client.chat.postMessage({
      channel,
      text: title,
      blocks,
    });

    const messageKey = `${channelID}:${ts}`;

    await PheliaClient.Storage.set(
      messageKey,
      JSON.stringify({
        name: message.name,
        state: initializedState,
        props,
      })
    );
  }
}
