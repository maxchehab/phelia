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
       Greeter
     ])
   );

   // Post a message...
   const client = new PheliaClient(process.env.SLACK_TOKEN);
   client.postMessage(Greeter, "@max");

   app.listen(3000);
   ```

2. Create your message with React:

   ```tsx
   // greeter.tsx
   import React from "react";

   import {
     PheliaMessageProps,
     Section,
     Actions,
     Button,
     Text
   } from "phelia/core";

   export default function Greeter({ useState }: PheliaMessageProps) {
     const [name, setName] = useState("name");

     return (
       <Message>
         <Section>
           <Text>{name ? `Hello ${name}` : "Click the button"}</Text>
         </Section>
         <Actions>
           <Button action="greet" onClick={user => setName(user.username)}>
             Click me
           </Button>
         </Actions>
       </Message>
     );
   }
   ```

3. Interact with your message:
   <p align="left">
     <img width="250px" src="/screenshots/screencap2.gif">
   </p>

# How this works

Phelia transforms React components into Slack messages by use of a custom [React reconciler](https://github.com/maxchehab/phelia/blob/master/src/core/reconciler.ts). Components, with their internal state and props, are serialized into a [persistance layer](#persistance-layer). When a user interacts with a posted message Phelia retrieves the Component, re-hydrates it's state and props, and performs any actions which may result in a new state.

# Persistance layer

Phelia uses a persistance layer to store posted messages and their properties such as **state**, **props**, and Component type. The persistance method can be customized by use of the `setStorage(storage)` method.

A storage object must implement the following methods:

- `set(key: string, value: string): void`
- `get(key: string): string`

_Storage methods may be asynchronous._

By default the storage object is an in-memory map. Here is an example using Redis for storage:

```ts
import redis from "redis";
import { setStorage } from "phelia/core";

const client = redis.createClient();

setStorage({
  set: (key, value) =>
    new Promise((resolve, reject) =>
      client.set(key, value, err => (err ? reject(err) : resolve()))
    ),

  get: key =>
    new Promise((resolve, reject) =>
      client.get(key, (err, reply) => (err ? reject(err) : resolve(reply)))
    )
});
```

# Support

| Component                                                                                                           |     | Example                                                                                            |
| ------------------------------------------------------------------------------------------------------------------- | --- | -------------------------------------------------------------------------------------------------- |
| [Actions](https://api.slack.com/reference/block-kit/blocks#actions)                                                 | ✅  | [Counter](https://github.com/maxchehab/phelia/blob/master/src/example/counter.tsx)                 |
| [Context](https://api.slack.com/reference/block-kit/blocks#context)                                                 | ✅  |
| [Divider](https://api.slack.com/reference/block-kit/blocks#divider)                                                 | ✅  | [Random Image](https://github.com/maxchehab/phelia/blob/master/src/example/random-image.tsx)       |
| [File](https://api.slack.com/reference/block-kit/blocks#file)                                                       | ❌  |
| [Image Block](https://api.slack.com/reference/block-kit/blocks#image)                                               | ✅  | [Random Image](https://github.com/maxchehab/phelia/blob/master/src/example/random-image.tsx)       |
| [Input](https://api.slack.com/reference/block-kit/blocks#input)                                                     | ✅  | [Modal Example](https://github.com/maxchehab/phelia/blob/master/src/example/modal-example.tsx)     |
| [Section](https://api.slack.com/reference/block-kit/blocks#section)                                                 | ✅  | [Counter](https://github.com/maxchehab/phelia/blob/master/src/example/counter.tsx)                 |
| [Button](https://api.slack.com/reference/block-kit/block-elements#button)                                           | ✅  | [Counter](https://github.com/maxchehab/phelia/blob/master/src/example/counter.tsx)                 |
| [Checkboxes](https://api.slack.com/reference/block-kit/block-elements#checkboxes)                                   | ✅  | [Modal Example](https://github.com/maxchehab/phelia/blob/master/src/example/modal-example.tsx)     |
| [Date Picker](https://api.slack.com/reference/block-kit/block-elements#datepicker)                                  | ✅  | [Birthday Picker](https://github.com/maxchehab/phelia/blob/master/src/example/birthday-picker.tsx) |
| [Text](https://api.slack.com/reference/block-kit/composition-objects#text)                                          | ✅  | [Random Image](https://github.com/maxchehab/phelia/blob/master/src/example/random-image.tsx)       |
| [Image](https://api.slack.com/reference/block-kit/block-elements#image)                                             | ✅  | [Random Image](https://github.com/maxchehab/phelia/blob/master/src/example/random-image.tsx)       |
| [Multi-select Menu](https://api.slack.com/reference/block-kit/block-elements#multi_select)                          | ❌  |
| [Overflow Menu](https://api.slack.com/reference/block-kit/block-elements#overflow)                                  | ✅  | [Overflow Menu](https://github.com/maxchehab/phelia/blob/master/src/example/overflow-menu.tsx)     |
| [Plain-text input](https://api.slack.com/reference/block-kit/block-elements#input)                                  | ✅  | [Modal Example](https://github.com/maxchehab/phelia/blob/master/src/example/modal-example.tsx)     |
| [Radio button group](https://api.slack.com/reference/block-kit/block-elements#radio)                                | ✅  | [Radio Buttons](https://github.com/maxchehab/phelia/blob/master/src/example/radio-buttons.tsx)     |
| [Select Menus](https://api.slack.com/reference/block-kit/block-elements#select)                                     | ❌  |
| [Text](https://api.slack.com/reference/block-kit/composition-objects#text)                                          | ✅  | [Counter](https://github.com/maxchehab/phelia/blob/master/src/example/counter.tsx)                 |
| [Confirmation dialog](https://api.slack.com/reference/block-kit/composition-objects#confirm)                        | ✅  | [Random Image](https://github.com/maxchehab/phelia/blob/master/src/example/random-image.tsx)       |
| [Option](https://api.slack.com/reference/block-kit/composition-objects#option)                                      | ✅  |
| [Option group](https://api.slack.com/reference/block-kit/composition-objects#option_group)                          | ✅  | [Select Menu](https://github.com/maxchehab/phelia/blob/master/src/example/select-menu.tsx)         |
| [Filter for conversation lists](https://api.slack.com/reference/block-kit/composition-objects#filter_conversations) | ❌  |
| [Messages](https://api.slack.com/surfaces/messages)                                                                 | ✅  | [Server](https://github.com/maxchehab/phelia/blob/master/src/example/server.ts)                    |
| [Modals](https://api.slack.com/surfaces/modals)                                                                     | ✅  | [Modal Example](https://github.com/maxchehab/phelia/blob/master/src/example/modal-example.tsx)     |
| [Home Tab](https://api.slack.com/surfaces/tabs)                                                                     | ❌  |
