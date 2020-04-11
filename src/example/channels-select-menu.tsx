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

export function ChannelsSelectMenuModal() {
  return (
    <Modal title="Channels menu" submit="Submit">
      <Input label="All channels">
        <SelectMenu
          type="channels"
          action="conversation"
          placeholder="A placeholder"
        />
      </Input>
    </Modal>
  );
}

export function ChannelsSelectMenuExample({
  useModal,
  useState
}: PheliaMessageProps) {
  const [form, setForm] = useState("form");
  const [selected, setSelected] = useState("selected");

  const openModal = useModal("modal", ChannelsSelectMenuModal, form => {
    setForm(JSON.stringify(form, null, 2));
  });

  return (
    <Message text="A channels select menu example">
      {selected && (
        <Section>
          <Text type="mrkdwn">*Selected:* {selected}</Text>
        </Section>
      )}

      {!selected && (
        <>
          <Actions>
            <SelectMenu
              type="channels"
              action="channels"
              placeholder="A placeholder"
              onSelect={event => setSelected(event.selected)}
            />
          </Actions>
        </>
      )}

      <Divider />

      <Section
        text="You can also have a channels select menu in a modal"
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
