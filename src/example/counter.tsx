import React from "react";

import {
  Actions,
  Button,
  Message,
  PheliaMessageProps,
  Section,
  Text
} from "../core";

export default function Counter({
  useState,
  props
}: PheliaMessageProps<{ name: string }>) {
  const [counter, setCounter] = useState("counter", 0);

  return (
    <Message text="A counter example">
      <Section>
        <Text>
          Hello {props.name}, here is your counter {counter}
        </Text>
      </Section>
      <Actions>
        <Button action="inc" onClick={() => setCounter(counter + 1)}>
          Inc
        </Button>
        <Button action="dec" onClick={() => setCounter(counter - 1)}>
          Dec
        </Button>
      </Actions>
    </Message>
  );
}
