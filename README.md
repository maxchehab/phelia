# ⚡ Phelia

<p align="center">
  <img src="/screenshots/screenshot1.png">
A reactive Slack messaging framework.
</p>

# Quick start

1. Create an [express](https://expressjs.com) server:

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

2. Create your message with React:

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

3. Interact with your message:
   <p align="left">
     <img width="250px" src="/screenshots/screencap2.gif">
   </p>

# How this works

Phelia transforms React components into Slack messages by use of a custom [React renderer](https://github.com/maxchehab/phelia/blob/master/src/core/renderer.ts). Components, with their internal state and props, are serialized into a [persistance layer](#persistance-layer). When a user interacts with a posted message Phelia retrieves the Component, re-hydrates it's state and props, and performs any actions which may result in a new state.

# Persistance layer

Phelia uses a persistance layer to store posted messages and their properties such as **state**, **props**, and Component type. The persistance method can be customized by use of the static `Phelia.SetStorage(storage)` method.

A storage object must implement the following methods:

- `set(key: string, value: string): void`
- `get(key: string): string`

_Storage methods may be asynchronous._

By default the storage object is an in-memory map. Here is an example using Redis for storage:

```ts
import redis from "redis";
import { PheliaClient } from "phelia/core";

const client = redis.createClient();

PheliaClient.SetStorage({
  set: (key, value) =>
    new Promise((_, reject) =>
      redisClient.set(key, value, (err) => err && reject(err))
    ),

  get: (key) =>
    new Promise((resolve, reject) =>
      redisClient.get(key, (err, reply) => (err ? reject(err) : resolve(reply)))
    ),
});
```
