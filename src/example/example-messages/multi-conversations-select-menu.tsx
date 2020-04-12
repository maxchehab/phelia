import React from "react";

import {
  Button,
  Divider,
  Input,
  Message,
  Modal,
  MultiSelectMenu,
  PheliaMessageProps,
  Section,
  Text
} from "../../core";

export function MultiConversationsSelectMenuModal() {
  return (
    <Modal title="Select a conversation" submit="Submit">
      <Input label="Select menu">
        <MultiSelectMenu
          type="conversations"
          action="selection"
          placeholder="A placeholder"
        />
      </Input>
    </Modal>
  );
}

export function MultiConversationsSelectMenuExample({
  useModal,
  useState
}: PheliaMessageProps) {
  const [form, setForm] = useState("form");
  const [selected, setSelected] = useState("selected");

  const openModal = useModal(
    "modal",
    MultiConversationsSelectMenuModal,
    form => {
      setForm(JSON.stringify(form, null, 2));
    }
  );

  return (
    <Message text="multi conversations menu">
      {selected && (
        <Section>
          <Text type="mrkdwn">*Selected:* {selected}</Text>
        </Section>
      )}

      {!selected && (
        <Section
          text="A Multi-Select Menu in a Section component"
          accessory={
            <MultiSelectMenu
              type="conversations"
              action="select"
              placeholder="A placeholder"
              onSelect={event => setSelected(event.selected.join(", "))}
            />
          }
        />
      )}

      <Divider />

      <Section
        text="You can also have a multi static select menu in a modal"
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
