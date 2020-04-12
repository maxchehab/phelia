import React from "react";

import {
  Actions,
  Button,
  Divider,
  Input,
  Message,
  Modal,
  Option,
  OptionGroup,
  PheliaMessageProps,
  Section,
  Text,
  MultiSelectMenu
} from "../core";

export function MultiStaticSelectMenuModal() {
  return (
    <Modal title="Static multi select menu" submit="Submit">
      <Input label="Select menu">
        <MultiSelectMenu action="selection" placeholder="A placeholder">
          <OptionGroup label="an option group">
            <Option value="option-a">option a</Option>
            <Option value="option-b">option b</Option>
            <Option value="option-c">option c</Option>
          </OptionGroup>

          <OptionGroup label="another option group">
            <Option value="option-d">option d</Option>
            <Option value="option-e" selected>
              option e
            </Option>
            <Option value="option-f">option f</Option>
          </OptionGroup>
        </MultiSelectMenu>
      </Input>
    </Modal>
  );
}

export function MultiStaticSelectMenuExample({
  useModal,
  useState
}: PheliaMessageProps) {
  const [form, setForm] = useState("form");
  const [selected, setSelected] = useState("selected");

  const openModal = useModal("modal", MultiStaticSelectMenuModal, form => {
    setForm(JSON.stringify(form, null, 2));
  });

  return (
    <Message text="A multi static select menu example">
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
              action="select"
              placeholder="A placeholder"
              onSelect={event => setSelected(event.selected.join(", "))}
            >
              <Option value="option-a">option a</Option>

              <Option value="option-b" selected>
                option b
              </Option>

              <Option value="option-c" selected>
                option c
              </Option>
            </MultiSelectMenu>
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
