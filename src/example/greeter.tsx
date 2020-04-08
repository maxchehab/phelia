import React from "react";

import { PheliaMessageProps, Section, Actions, Button, Text } from "../core";

export default function Greeter({ useState }: PheliaMessageProps) {
  const [name, setName] = useState("name");

  return (
    <>
      <Section
        accessory={
          <Button action={"click"} onClick={(user) => setName(user.username)}>
            Click me
          </Button>
        }
        text={<Text>Click the button</Text>}
      >
        <Text type="mrkdwn">*Name:*</Text>
        <Text>{name ? name : "<unknown>"}</Text>
      </Section>
      <Actions>
        <Button
          style="danger"
          action="reset"
          onClick={() => setName(undefined)}
        >
          Reset
        </Button>
      </Actions>
    </>
  );
}
