import { createMessageAdapter } from "@slack/interactive-messages";
import { MessageAdapterOptions } from "@slack/interactive-messages/dist/adapter";
import { WebClient, WebClientOptions } from "@slack/web-api";
import React, { useState as reactUseState } from "react";

import { render, getOnSearchOptions } from "./reconciler";
import {
  generateEvent,
  loadMessagesFromArray,
  loadMessagesFromDirectory,
  parseMessageKey,
} from "./utils";
import { SelectMenu } from "./components";
import {
  InteractionEvent,
  MessageCallback,
  PheliaMessage,
  PheliaMessageContainer,
  PheliaModal,
  PheliaStorage,
  SubmitEvent,
  PheliaHome,
  SlackUser,
} from "./interfaces";

/** The main phelia client. Handles sending messages with phelia components */
export class Phelia {
  private client: WebClient;

  private static Storage: PheliaStorage = new Map<string, string>();

  private messageCache = new Map<string, PheliaMessage | PheliaModal>();

  private homeComponent: PheliaHome = undefined;

  setStorage(storage: PheliaStorage) {
    Phelia.Storage = storage;
  }

  constructor(token: string, slackOptions?: WebClientOptions) {
    this.client = new WebClient(token, slackOptions);
  }

  async openModal<p>(
    modal: PheliaModal<p>,
    triggerID: string,
    props: p = null,
  ): Promise<void> {
    const initializedState: { [key: string]: any } = {};

    /** foo */
    function useState<t>(
      key: string,
      initialValue?: t
    ): [t, (value: t) => void] {
      initializedState[key] = initialValue;
      return [initialValue, (_: t): void => null];
    }

    const message = await render(
      React.createElement(modal, { props, useState })
    );

    const response: any = await this.client.views.open({
      trigger_id: triggerID,
      view: {
        ...message,
        notify_on_close: true,
      }
    });

    const viewID = response.view.id;
    await Phelia.Storage.set(
      viewID,
      JSON.stringify({
        message: JSON.stringify(message),
        invokerKey: viewID,
        name: modal.name,
        props,
        state: initializedState,
        type: "modal",
        viewID,
      })
    );
  }

  async postMessage<p>(
    message: PheliaMessage<p>,
    channel: string,
    props: p = null
  ): Promise<string> {
    const initializedState: { [key: string]: any } = {};

    /** A hook to create some state for a component */
    function useState<t>(
      key: string,
      initialValue?: t
    ): [t, (value: t) => void] {
      initializedState[key] = initialValue;
      return [initialValue, (_: t): void => null];
    }

    /** A hook to create a modal for a component */
    function useModal(): (title: string, props?: any) => Promise<void> {
      return async () => null;
    }

    const messageData = await render(
      React.createElement(message, { useState, props, useModal })
    );

    // only can return a user id here, need to enhance it using methods.user
    const {
      channel: channelID,
      ts,
      message: sentMessageData,
    } = await this.client.chat.postMessage({
      ...messageData,
      channel,
    });

    const messageKey = `${channelID}:${ts}`;

    await Phelia.Storage.set(
      messageKey,
      JSON.stringify({
        message: JSON.stringify(messageData),
        type: "message",
        name: message.name,
        state: initializedState,
        user: { id: (sentMessageData as any).user },
        props,
        channelID,
        ts,
      })
    );

    return messageKey;
  }

  async updateMessage<p>(key: string, props: p) {
    const rawMessageContainer = await Phelia.Storage.get(key);
    if (!rawMessageContainer) {
      throw TypeError(`Could not find a message with key ${key}.`);
    }

    const container: PheliaMessageContainer = JSON.parse(rawMessageContainer);

    /** A hook to create some state for a component */
    function useState<t>(key: string): [t, (value: t) => void] {
      return [
        container.state[key],
        (newState: t) => (container.state[key] = newState),
      ];
    }

    /** A hook to create a modal for a component */
    function useModal(): (title: string, props?: any) => Promise<void> {
      return async () => null;
    }

    const message = await render(
      React.createElement(this.messageCache.get(container.name) as any, {
        useState,
        useModal,
        props,
      })
    );

    await this.client.chat.update({
      ...message,
      channel: container.channelID,
      ts: container.ts,
    });

    await Phelia.Storage.set(
      container.viewID,
      JSON.stringify({
        message: JSON.stringify(message),
        name: this.homeComponent.name,
        state: container.state,
        type: "home",
        viewID: container.viewID,
        user: container.user,
      })
    );
  }

  registerComponents(components: PheliaMessage[]) {
    const pheliaComponents = loadMessagesFromArray(components);

    this.messageCache = pheliaComponents.reduce(
      (cache, { message, name }) => cache.set(name, message),
      this.messageCache
    );
  }

  registerHome(home: PheliaHome) {
    this.homeComponent = home;
    this.registerComponents([home]);
  }

  async updateHome(key: string) {
    const rawMessageContainer = await Phelia.Storage.get(key);
    if (!rawMessageContainer) {
      throw TypeError(`Could not find a home app with key ${key}.`);
    }

    const container: PheliaMessageContainer = JSON.parse(rawMessageContainer);

    /** A hook to create some state for a component */
    function useState<t>(key: string): [t, (value: t) => void] {
      return [
        container.state[key],
        (newState: t) => (container.state[key] = newState),
      ];
    }

    /** A hook to create a modal for a component */
    function useModal(): (title: string, props?: any) => Promise<void> {
      return async () => null;
    }

    /** Run the onload callback */
    await render(
      React.createElement(this.homeComponent, {
        useState,
        useModal,
        user: container.user,
      }),
      {
        value: undefined,
        event: { user: container.user },
        type: "onupdate",
      }
    );

    const home = await render(
      React.createElement(this.homeComponent, {
        useState,
        useModal,
        user: container.user,
      })
    );

    await this.client.views.publish({
      view: home,
      user_id: container.user.id,
    });

    await Phelia.Storage.set(
      container.viewID,
      JSON.stringify({
        message: JSON.stringify(home),
        name: this.homeComponent.name,
        state: container.state,
        type: "home",
        viewID: container.viewID,
        user: container.user,
      })
    );
  }

  appHomeHandler(
    home: PheliaHome,
    onHomeOpened?: (key: string, user?: SlackUser) => void | Promise<void>
  ) {
    this.registerHome(home);

    return async (payload: any) => {
      if (payload.tab !== "home") {
        return;
      }

      let finalMessageKey: string;

      const messageKey = parseMessageKey(payload);
      let user: SlackUser = { id: payload.user } as SlackUser;

      try {
        const userResponse = (await this.client.users.info({
          user: payload.user,
        })) as any;

        user.username = userResponse.user.profile.display_name;
        user.name = userResponse.user.name;
        user.team_id = userResponse.user.team_id;
      } catch (error) {
        console.warn(
          "Could not retrieve User's information, only 'user.id' is available for Home App. Oauth scope 'users:read' is required."
        );
      }

      const rawMessageContainer = await Phelia.Storage.get(messageKey);

      if (!rawMessageContainer) {
        const initializedState: { [key: string]: any } = {};

        /** A hook to create some state for a component */
        function useState<t>(
          key: string,
          initialValue?: t
        ): [t, (value: t) => void] {
          if (!initializedState[key]) {
            initializedState[key] = initialValue;
          }
          return [
            initializedState[key],
            (newValue: t) => (initializedState[key] = newValue),
          ];
        }

        /** A hook to create a modal for a component */
        function useModal(): (title: string, props?: any) => Promise<void> {
          return async () => null;
        }

        /** Run the onload callback */
        await render(
          React.createElement(this.homeComponent, {
            useState,
            useModal,
            user,
          }),
          {
            value: undefined,
            event: { user },
            type: "onload",
          }
        );

        const home = await render(
          React.createElement(this.homeComponent, {
            useState,
            useModal,
            user,
          })
        );

        const response: any = await this.client.views.publish({
          view: home,
          user_id: payload.user,
        });

        const viewID = response.view.id;

        await Phelia.Storage.set(
          viewID,
          JSON.stringify({
            message: JSON.stringify(home),
            name: this.homeComponent.name,
            state: initializedState,
            type: "home",
            viewID,
            user,
          })
        );

        finalMessageKey = viewID;
      } else {
        const container: PheliaMessageContainer = JSON.parse(
          rawMessageContainer
        );

        /** A hook to create some state for a component */
        function useState<t>(key: string): [t, (value: t) => void] {
          return [
            container.state[key],
            (newState: t) => (container.state[key] = newState),
          ];
        }

        /** A hook to create a modal for a component */
        function useModal(): (title: string, props?: any) => Promise<void> {
          return async () => null;
        }

        /** Run the onload callback */
        await render(
          React.createElement(this.homeComponent, {
            useState,
            useModal,
            user,
          }),
          {
            value: undefined,
            event: { user },
            type: "onload",
          }
        );

        const home = await render(
          React.createElement(this.homeComponent, {
            useState,
            useModal,
            user,
          })
        );

        await this.client.views.publish({
          view: home,
          user_id: payload.user,
        });

        await Phelia.Storage.set(
          container.viewID,
          JSON.stringify({
            message: JSON.stringify(home),
            name: this.homeComponent.name,
            state: container.state,
            type: "home",
            viewID: container.viewID,
            user,
          })
        );

        finalMessageKey = container.viewID;
      }

      if (typeof onHomeOpened === "function") {
        await onHomeOpened(finalMessageKey, user);
      }
    };
  }

  async processAction(payload: any) {
    const messageKey = parseMessageKey(payload);

    const rawMessageContainer = await Phelia.Storage.get(messageKey);

    if (!rawMessageContainer) {
      throw new Error(
        `Could not find Message Container with key ${messageKey} in storage.`
      );
    }

    const container: PheliaMessageContainer = JSON.parse(rawMessageContainer);
    const user = payload.user;

    /** A hook to create some state for a component */
    function useState<t>(
      key: string,
      initialValue?: t
    ): [t, (value: t) => void] {
      const [_, setState] = reactUseState(initialValue);

      return [
        container.state[key],
        (newValue: t): void => {
          container.state[key] = newValue;
          setState(newValue);
        },
      ];
    }

    /** A hook to create a modal for a component */
    const useModal = (key: string, modal: PheliaModal) => {
      return async (props?: any) => {
        const initializedState: { [key: string]: any } = {};

        /** A hook to create some state for the modal */
        function useState<t>(
          key: string,
          initialValue?: t
        ): [t, (value: t) => void] {
          initializedState[key] = initialValue;
          return [initialValue, (_: t): void => null];
        }

        const message = await render(
          React.createElement(modal, { props, useState })
        );

        const response: any = await this.client.views.open({
          trigger_id: payload.trigger_id,
          view: {
            ...message,
            notify_on_close: true,
          },
        });

        const viewID = response.view.id;

        await Phelia.Storage.set(
          viewID,
          JSON.stringify({
            message: JSON.stringify(message),
            modalKey: key,
            invokerKey: messageKey,
            name: modal.name,
            props,
            state: initializedState,
            type: "modal",
            viewID,
            user,
          })
        );
      };
    };

    for (const action of payload.actions) {
      await render(
        React.createElement(this.messageCache.get(container.name) as any, {
          useState,
          props: container.props,
          useModal,
          user: container.type === "home" ? user : undefined,
        }),
        {
          value: action.action_id,
          event: generateEvent(action, user),
          type: "interaction",
        }
      );
    }

    const message = await render(
      React.createElement(this.messageCache.get(container.name) as any, {
        useState,
        props: container.props,
        useModal,
        user: container.type === "home" ? payload.user : undefined,
      })
    );

    if (JSON.stringify(message) !== container.message) {
      if (container.type === "message") {
        await this.client.chat.update({
          ...message,
          channel: container.channelID,
          ts: container.ts,
        });
      } else if (container.type === "modal") {
        await this.client.views.update({
          view_id: messageKey,
          view: {
            ...message,
            notify_on_close: true,
          },
        });
      } else {
        await this.client.views.update({
          view_id: messageKey,
          view: message,
        });
      }
    }

    await Phelia.Storage.set(
      messageKey,
      JSON.stringify({
        ...container,
        message: JSON.stringify(message),
        user,
      })
    );
  }

  async processSubmission(payload: any) {
    const messageKey = payload.view.id;
    const rawViewContainer = await Phelia.Storage.get(messageKey);

    if (!rawViewContainer) {
      throw new Error(
        `Could not find Message Container with key ${messageKey} in storage.`
      );
    }

    const viewContainer: PheliaMessageContainer = JSON.parse(rawViewContainer);

    const rawInvokerContainer = await Phelia.Storage.get(
      viewContainer.invokerKey
    );

    if (viewContainer.invokerKey !== null && !rawInvokerContainer) {
      throw new Error(
        `Could not find Message Container with key ${viewContainer.invokerKey} in storage.`
      );
    }

    const invokerContainer: PheliaMessageContainer = JSON.parse(
      rawInvokerContainer
    );

    /** A hook to create some state for a component */
    function useState<t>(
      key: string,
      initialValue?: t
    ): [t, (value: t) => void] {
      const [_, setState] = reactUseState(initialValue);

      return [
        invokerContainer.state[key],
        (newValue: t): void => {
          invokerContainer.state[key] = newValue;
          setState(newValue);
        },
      ];
    }

    const executedCallbacks = new Map<string, boolean>();
    const executionPromises = new Array<Promise<any>>();

    /** Extracts content from modal form submission */
    const formFromPayload = (payload: any) => {
      if (payload.type === "view_submission") {
        const form = Object.keys(payload.view.state.values)
          .map((key) => [key, Object.keys(payload.view.state.values[key])[0]])
          .map(([key, action]) => {
            const data = payload.view.state.values[key][action];
            
            if (data.type === "datepicker") {
              return [action, data.selected_date];
            }

            if (
              data.type === "checkboxes" ||
              data.type === "multi_static_select" ||
              data.type === "multi_external_select"
            ) {
              const selected = data.selected_options.map(
                (option: any) => option.value
              );

              return [action, selected];
            }

            if (data.type === "multi_users_select") {
              return [action, data.selected_users];
            }

            if (data.type === "multi_channels_select") {
              return [action, data.selected_channels];
            }

            if (data.type === "multi_conversations_select") {
              return [action, data.selected_conversations];
            }

            if (
              data.type === "radio_buttons" ||
              data.type === "static_select" ||
              data.type === "external_select"
            ) {
              return [action, data.selected_option.value];
            }

            if (data.type === "users_select") {
              return [action, data.selected_user];
            }

            if (data.type === "conversations_select") {
              return [action, data.selected_conversation];
            }

            if (data.type === "channels_select") {
              return [action, data.selected_channel];
            }

            return [action, data.value];
          })
          .reduce((form, [action, value]) => {
            form[action] = value;
            return form;
          }, {} as any);
        return form;
      }

      return undefined;
    };

    const form = formFromPayload(payload);

    /** A hook to create a modal for a component */
    function useModal(
      key: string,
      _modal: PheliaMessage,
      onSubmit?: (event: SubmitEvent) => Promise<void>,
      onCancel?: (event: InteractionEvent) => Promise<void>
    ): (title: string, props?: any) => Promise<void> {
      if (key === viewContainer.modalKey && !executedCallbacks.get(key)) {
        executedCallbacks.set(key, true);

        if (form !== undefined) {
          onSubmit &&
            executionPromises.push(onSubmit({ form, user: payload.user }));
        } else {
          onCancel && executionPromises.push(onCancel({ user: payload.user }));
        }
      }

      return async () => null;
    }

    await render(
      React.createElement(this.messageCache.get(invokerContainer.name) as any, {
        useState,
        props: invokerContainer.props,
        useModal,
        user: invokerContainer.type === "home" ? payload.user : undefined,
      }), {
        value: undefined,
        event: {
          form,
          user: payload.user,
        } as InteractionEvent,
        type: form === undefined ? "oncancel" : "onsubmit",
      }
    );

    await Promise.all(executionPromises);

    const message = await render(
      React.createElement(this.messageCache.get(invokerContainer.name) as any, {
        useState,
        props: invokerContainer.props,
        useModal,
        user: invokerContainer.type === "home" ? payload.user : undefined,
      })
    );

    if (JSON.stringify(message) !== invokerContainer.message) {
      if (invokerContainer.type === "message") {
        await this.client.chat.update({
          ...message,
          channel: invokerContainer.channelID,
          ts: invokerContainer.ts,
        });
      } else if (invokerContainer.type === "modal") {
        await this.client.views.update({
          view_id: messageKey,
          view: message,
        });
      } else {
        await this.client.views.publish({
          view_id: messageKey,
          view: message,
          user_id: payload.user.id,
        });
      }
    }

    await Phelia.Storage.set(
      viewContainer.invokerKey,
      JSON.stringify({
        ...invokerContainer,
        user: payload.user,
        message: JSON.stringify(message),
      })
    );
  }

  async processOption(payload: any) {
    const messageKey = parseMessageKey(payload);

    const rawMessageContainer = await Phelia.Storage.get(messageKey);

    if (!rawMessageContainer) {
      throw new Error(
        `Could not find Message Container with key ${messageKey} in storage.`
      );
    }

    const container: PheliaMessageContainer = JSON.parse(rawMessageContainer);

    /** A hook to create some state for a component */
    function useState<t>(key: string): [t, (value: t) => void] {
      return [container.state[key], (_: t): void => null];
    }

    /** A hook to create a modal for a component */
    function useModal(): (title: string, props?: any) => Promise<void> {
      return async () => null;
    }

    const onSearchOptions = await getOnSearchOptions(
      React.createElement(
        this.messageCache.get(container.name) as PheliaMessage,
        {
          useState,
          props: container.props,
          useModal,
        }
      ),
      {
        value: payload.action_id,
        event: { user: payload.user },
        type: "interaction",
      }
    );

    const optionsComponent = await onSearchOptions({
      user: payload.user,
      query: payload.value,
    });

    const { options, option_groups } = await render(
      React.createElement(SelectMenu, {
        placeholder: "",
        action: "",
        type: "static",
        children: optionsComponent,
      })
    );

    if (options) {
      return { options };
    }

    return { option_groups };
  }

  messageHandler(
    signingSecret: string,
    messages?: string | PheliaMessage[] | PheliaModal[] | MessageCallback,
    home?: PheliaMessage,
    slackOptions?: MessageAdapterOptions
  ) {
    if (messages) {
      const pheliaMessages =
        typeof messages === "string"
          ? loadMessagesFromDirectory(messages)
          : typeof messages === "function"
          ? loadMessagesFromArray(messages())
          : loadMessagesFromArray(messages);

      this.messageCache = pheliaMessages.reduce(
        (cache, { message, name }) => cache.set(name, message),
        this.messageCache
      );
    }

    if (home) {
      this.homeComponent = home;
      this.registerComponents([home]);
    }

    const adapter = createMessageAdapter(signingSecret, {
      ...slackOptions,
      syncResponseTimeout: 3000,
    });

    adapter.viewSubmission(new RegExp(/.*/), async (payload) => {
      this.processSubmission(payload);
    });

    adapter.viewClosed(new RegExp(/.*/), async (payload) => {
      this.processSubmission(payload);
    });

    adapter.action({ type: "block_suggestion" }, this.processOption.bind(this));

    adapter.action(new RegExp(/.*/), async (payload) => {
      this.processAction(payload);
    });

    adapter.options(new RegExp(/.*/), this.processOption.bind(this));

    return adapter.requestListener();
  }
}
