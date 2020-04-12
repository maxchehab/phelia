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
  SelectMenu,
  Option,
  OptionGroup
} from "../../core";

export function ExternalSelectMenuModal() {
  return (
    <Modal title="External menu" submit="Submit">
      <Input label="All external">
        <SelectMenu
          minQueryLength={0}
          onSearchOptions={() => [
            <OptionGroup key="1" label={"A group"}>
              <Option value="option-1">This was loaded asynchronously</Option>
            </OptionGroup>
          ]}
          type="external"
          action="select-menu"
          placeholder="A placeholder"
        />
      </Input>
    </Modal>
  );
}

export function ExternalSelectMenuExample({
  useModal,
  useState
}: PheliaMessageProps) {
  const [form, setForm] = useState("form");
  const [selected, setSelected] = useState("selected");

  const openModal = useModal("modal", ExternalSelectMenuModal, form => {
    setForm(JSON.stringify(form, null, 2));
  });

  return (
    <Message text="A external select menu example">
      {selected && (
        <Section>
          <Text type="mrkdwn">*Selected:* {selected}</Text>
        </Section>
      )}

      {!selected && (
        <>
          <Actions>
            <SelectMenu
              initialOption={
                <Option key="1" value="option-1">
                  This was loaded asynchronously
                </Option>
              }
              onSearchOptions={() => [
                <Option key="1" value="option-1">
                  This was loaded asynchronously
                </Option>
              ]}
              type="external"
              action="external"
              placeholder="A placeholder"
              onSelect={event => setSelected(event.selected)}
            />
          </Actions>
        </>
      )}

      <Divider />

      <Section
        text="You can also have a external select menu in a modal"
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
