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
  SelectMenu,
  Text
} from "../../core";

export function StaticSelectMenuModal() {
  return (
    <Modal title="Static select menu example" submit="Submit">
      <Input label="Select menu">
        <SelectMenu action="select-groups" placeholder="A placeholder">
          <OptionGroup label="an option group">
            <Option value="option-a">option a</Option>
            <Option value="option-b">option b</Option>
            <Option value="option-c">option c</Option>
          </OptionGroup>

          <OptionGroup label="another option group">
            <Option value="option-c">option c</Option>
            <Option value="option-d" selected>
              option d
            </Option>
            <Option value="option-e">option e</Option>
          </OptionGroup>
        </SelectMenu>
      </Input>
    </Modal>
  );
}

export function StaticSelectMenuExample({
  useModal,
  useState
}: PheliaMessageProps) {
  const [form, setForm] = useState("form");
  const [selected, setSelected] = useState("selected");

  const openModal = useModal("modal", StaticSelectMenuModal, form => {
    setForm(JSON.stringify(form, null, 2));
  });

  return (
    <Message text="A static select menu example">
      {selected && (
        <Section>
          <Text type="mrkdwn">*Selected:* {selected}</Text>
        </Section>
      )}

      {!selected && (
        <>
          <Actions>
            <SelectMenu
              action="select"
              placeholder="A placeholder"
              onSelect={event => setSelected(event.selected)}
            >
              <Option value="option-a">option a</Option>

              <Option value="option-b" selected>
                option b
              </Option>

              <Option value="option-c">option c</Option>
            </SelectMenu>
          </Actions>

          <Actions>
            <SelectMenu
              action="select-groups"
              placeholder="A placeholder"
              onSelect={event => setSelected(event.selected)}
            >
              <OptionGroup label="an option group">
                <Option value="option-a">option a</Option>
                <Option value="option-b">option b</Option>
                <Option value="option-c">option c</Option>
              </OptionGroup>

              <OptionGroup label="another option group">
                <Option value="option-c">option c</Option>
                <Option value="option-d" selected>
                  option d
                </Option>
                <Option value="option-e">option e</Option>
              </OptionGroup>
            </SelectMenu>
          </Actions>
        </>
      )}

      <Divider />

      <Section
        text="You can also have a static select menu in a modal"
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
