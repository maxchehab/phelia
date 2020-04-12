import React from "react";

import {
  Actions,
  Button,
  Message,
  PheliaMessageProps,
  Section,
  Text
} from "../../core";

export function Greeter({ useState }: PheliaMessageProps) {
  const [name, setName] = useState("name");

  return (
    <Message text="Hey there!">
      <Section
        accessory={
          <Button
            action={"click"}
            onClick={({ user }) => setName(user.username)}
          >
            Click me
          </Button>
        }
        text={<Text>Click the button</Text>}
      >
        <Text type="mrkdwn">*Name:*</Text>
        <Text>{name || "<unknown>"}</Text>
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
    </Message>
  );
}
