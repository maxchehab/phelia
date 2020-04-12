import React from "react";

import {
  Button,
  Text,
  Input,
  Message,
  Modal,
  Option,
  PheliaMessageProps,
  Section,
  RadioButtons
} from "../../core";

export function RadioButtonModal() {
  return (
    <Modal title="Radio buttons example" submit="Submit">
      <Input label="Radio buttons">
        <RadioButtons action="radio-buttons">
          <Option value="option-a">option a</Option>

          <Option value="option-b" selected>
            option b
          </Option>

          <Option value="option-c">option c</Option>
        </RadioButtons>
      </Input>
    </Modal>
  );
}

export function RadioButtonExample({ useModal, useState }: PheliaMessageProps) {
  const [form, setForm] = useState("form");

  const openModal = useModal("modal", RadioButtonModal, form => {
    setForm(JSON.stringify(form, null, 2));
  });

  return (
    <Message text="A radio button example">
      <Section
        text="You can only have radio buttons inside of a Modal or Home tab"
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
