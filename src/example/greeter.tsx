import React from "react";

import { PheliaMessageProps, Section, Actions, Button, Text } from "../core";

export default function Greeter({ useState }: PheliaMessageProps) {
  const [name, setName] = useState("name");

  const text = name ? `Hello ${name}` : "Click the button";

  return (
    <>
      <Section>
        <Text>{text}</Text>
      </Section>
      <Actions>
        <Button value="greet" onClick={(user) => setName(user.username)}>
          Click me
        </Button>
      </Actions>
    </>
  );
}
