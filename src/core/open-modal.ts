import React from "react";

import { PheliaClient, PheliaModal } from "./phelia-client";
import { render } from ".";

export async function openModal(
  modal: PheliaModal,
  props: any = {},
  triggerID: string
): Promise<[any, any]> {
  const initializedState: { [key: string]: any } = {};

  function useState<t>(key: string, initialValue?: t): [t, (value: t) => void] {
    initializedState[key] = initialValue;
    return [initialValue, (_: t): void => null];
  }

  const message = await render(React.createElement(modal, { props, useState }));

  const response = await PheliaClient.client.views.open({
    trigger_id: triggerID,
    view: {
      ...message,
      notify_on_close: true
    }
  });

  return [response, modal];
}
