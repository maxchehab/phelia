import {
  Actions,
  Button,
  Home,
  PheliaHomeProps,
  Section,
  Text,
} from "../../core";
import React from "react";
import { MyModal } from "./modal-example";

export function HomeApp({ useState, useModal, user }: PheliaHomeProps) {
  const [counter, setCounter] = useState("counter", 0);
  const [loaded, setLoaded] = useState("loaded", 0);
  const [form, setForm] = useState("form");

  const openModal = useModal("modal", MyModal, (event) =>
    setForm(JSON.stringify(event.form, null, 2))
  );

  return (
    <Home onLoad={() => setLoaded(loaded + 1)}>
      <Section>
        <Text emoji>Hey there {user.username} :wave:</Text>
        <Text type="mrkdwn">*Counter:* {counter}</Text>
        <Text type="mrkdwn">*Loaded:* {loaded}</Text>
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
