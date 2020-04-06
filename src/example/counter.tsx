import React from "react";

import { PheliaMessageProps, Section, Actions, Button, Text } from "../core";

export default function Counter({
  useState,
  props,
}: PheliaMessageProps<{ name: string }>) {
  const [counter, setCounter] = useState("counter", 0);

  return (
    <>
      <Section>
        <Text>
          Hello {props.name}, here is your counter {counter}
        </Text>
      </Section>
      <Actions>
        <Button value="inc" onClick={() => setCounter(counter + 1)}>
          Inc
        </Button>
        <Button value="dec" onClick={() => setCounter(counter - 1)}>
          Dec
        </Button>
      </Actions>
    </>
  );
}
