import React from "react";
import { WebClient, WebClientOptions } from "@slack/web-api";

import { render } from "./reconciler";

export interface PheliaMessageProps<p = never> {
  props?: p;
  useState<t = any>(key: string, initialValue?: t): [t, (value: t) => void];
  useModal: (
    key: string,
    modal: PheliaModal,
    onSubmit?: (form: any) => void | Promise<void>,
    onCancel?: () => void | Promise<void>
  ) => (props?: any) => Promise<void>;
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

export interface AsyncStorage {
  set: (key: string, value: string) => Promise<void>;
  get: (key: string) => Promise<string>;
}

export interface Storage {
  set: (key: string, value: string) => void;
  get: (key: string) => string;
}

export class PheliaClient {
  static client: WebClient;

  static Storage: PheliaStorage = new Map<string, string>();

  static SetStorage(storage: PheliaStorage) {
    this.Storage = storage;
  }

  constructor(token: string, slackOptions?: WebClientOptions) {
    PheliaClient.client = new WebClient(token, slackOptions);
  }

  async postMessage<p>(
    message: PheliaMessage<p>,
    channel: string,
    props: p = null
  ) {
    const initializedState: { [key: string]: any } = {};

    function useState<t>(
      key: string,
      initialValue?: t
    ): [t, (value: t) => void] {
      initializedState[key] = initialValue;
      return [initialValue, (_: t): void => null];
    }

    function useModal(): (title: string, props?: any) => Promise<void> {
      return async () => null;
    }

    const messageData = await render(
      React.createElement(message, { useState, props, useModal })
    );

    const {
      channel: channelID,
      ts
    } = await PheliaClient.client.chat.postMessage({
      ...messageData,
      channel
    });

    const messageKey = `${channelID}:${ts}`;

    await PheliaClient.Storage.set(
      messageKey,
      JSON.stringify({
        message: JSON.stringify(messageData),
        type: "message",
        name: message.name,
        state: initializedState,
        props,
        channelID,
        ts
      })
    );
  }
}
