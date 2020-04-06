# ⚡ Phelia

<p align="center">
  <img src="/screenshots/screenshot1.png">
</p>

A reactive Slack messaging framework.

# QuickStart

With an [express](https://expressjs.com) server:

```ts
import express from "express";
import { PheliaClient, interactiveMessageHandler } from "phelia/core";

import Counter from "./counter";
import Greeter from "./greeter";

const app = express();

app.post(
  "/api/webhook",
  interactiveMessageHandler(process.env.SLACK_SIGNING_SECRET, [
    Counter,
    Greeter,
  ])
);

// Post a message...
const client = new PheliaClient(process.env.SLACK_TOKEN);
client.postMessage(Greeter, null, "@max", "hello there!");

app.listen(3000);
```

Create your message in class react:

```tsx
// counter.tsx
import React from "react";

import {
  PheliaMessageProps,
  Section,
  Actions,
  Button,
  Text,
} from "phelia/core";

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
```

Interact with your message:

<p align="left">
  <img width="250px" src="/screenshots/screencap2.gif">
</p>
