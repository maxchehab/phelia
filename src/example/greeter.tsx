import React from "react";

import { PheliaMessageProps, Section, Actions, Button, Text } from "../core";

export default function Greeter({ useState }: PheliaMessageProps) {
  const [name, setName] = useState("name");

  return (
    <>
      <Section>
        <Text>{name ? `Hello ${name}` : "Click the button"}</Text>
      </Section>
      <Actions>
        <Button value="greet" onClick={(user) => setName(user.username)}>
          Click me
        </Button>
      </Actions>
    </>
  );
}
