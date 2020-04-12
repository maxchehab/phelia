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
} from "../../core";

export function UsersSelectMenuModal() {
  return (
    <Modal title="Users select menu" submit="Submit">
      <Input label="Select menu">
        <SelectMenu type="users" action="user" placeholder="A placeholder" />
      </Input>
    </Modal>
  );
}

export function UsersSelectMenuExample({
  useModal,
  useState
}: PheliaMessageProps) {
  const [form, setForm] = useState("form");
  const [selected, setSelected] = useState("selected");

  const openModal = useModal("modal", UsersSelectMenuModal, form => {
    setForm(JSON.stringify(form, null, 2));
  });

  return (
    <Message text="A users select menu example">
      {selected && (
        <Section>
          <Text type="mrkdwn">*Selected:* {selected}</Text>
        </Section>
      )}

      {!selected && (
        <>
          <Actions>
            <SelectMenu
              type="users"
              action="select-groups"
              placeholder="A placeholder"
              onSelect={event => setSelected(event.selected)}
            />
          </Actions>
        </>
      )}

      <Divider />

      <Section
        text="You can also have a users select menu in a modal"
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
