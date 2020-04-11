import React from "react";

import {
  Button,
  Text,
  Input,
  Message,
  Modal,
  PheliaMessageProps,
  Section,
  Divider,
  Actions,
  SelectMenu
} from "../core";

export function ConversationsSelectMenuModal() {
  return (
    <Modal title="Conversations menu" submit="Submit">
      <Input label="Excluding Shared Channels">
        <SelectMenu
          type="conversations"
          action="conversation"
          filter={{ excludeExternalSharedChannels: true }}
          placeholder="A placeholder"
        />
      </Input>
    </Modal>
  );
}

export function ConversationsSelectMenuExample({
  useModal,
  useState
}: PheliaMessageProps) {
  const [form, setForm] = useState("form");
  const [selected, setSelected] = useState("selected");

  const openModal = useModal("modal", ConversationsSelectMenuModal, form => {
    setForm(JSON.stringify(form, null, 2));
  });

  return (
    <Message text="A conversations select menu example">
      {selected && (
        <Section>
          <Text type="mrkdwn">*Selected:* {selected}</Text>
        </Section>
      )}

      {!selected && (
        <>
          <Actions>
            <SelectMenu
              type="conversations"
              action="conversations"
              placeholder="A placeholder"
              onSelect={event => setSelected(event.selected)}
            />
          </Actions>
        </>
      )}

      <Divider />

      <Section
        text="You can also have a conversations select menu in a modal"
        accessory={
          <Button action="open-modal" onClick={() => openModal()}>
            Open modal
          </Button>
        }
      />

      {form && (
        <Section text="Modal submission:">
          <Text type="mrkdwn">{"```\n" + form + "\n```"}</Text>
        </Section>
      )}
    </Message>
  );
}
