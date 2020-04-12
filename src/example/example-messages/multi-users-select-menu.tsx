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

export function MultiUsersSelectMenuModal() {
  return (
    <Modal title="Users multi select menu" submit="Submit">
      <Input label="Select menu">
        <MultiSelectMenu
          type="users"
          action="selection"
          placeholder="A placeholder"
        />
      </Input>
    </Modal>
  );
}

export function MultiUsersSelectMenuExample({
  useModal,
  useState
}: PheliaMessageProps) {
  const [form, setForm] = useState("form");
  const [selected, setSelected] = useState("selected");

  const openModal = useModal("modal", MultiUsersSelectMenuModal, form => {
    setForm(JSON.stringify(form, null, 2));
  });

  return (
    <Message text="A multi users select menu example">
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
              type="users"
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
