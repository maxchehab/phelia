import {
  Actions,
  Button,
  Home,
  PheliaHomeProps,
  Section,
  Text
} from "../../core";
import React from "react";
import { MyModal } from "./modal-example";

export function HomeApp({ useState, useModal, user }: PheliaHomeProps) {
  const [counter, setCounter] = useState("counter", 0);
  const [form, setForm] = useState("form");

  const openModal = useModal("modal", MyModal, form =>
    setForm(JSON.stringify(form, null, 2))
  );

  return (
    <Home>
      <Section>
        <Text emoji>Hey there {user.username} :wave:</Text>
        <Text type="mrkdwn">*Counter:* {counter}</Text>
      </Section>

      <Actions>
        <Button action="counter" onClick={() => setCounter(counter + 1)}>
          Click me
        </Button>

        <Button action="modal" onClick={() => openModal()}>
          Open a Modal
        </Button>
      </Actions>

      {form && (
        <Section>
          <Text type="mrkdwn">{"```\n" + form + "\n```"}</Text>
        </Section>
      )}
    </Home>
  );
}
