# ⚡ Phelia

<p align="center">
  <img src="/screenshots/screenshot1.png">
A reactive Slack messaging framework.
</p>

# Quick start

1. Create an [express](https://expressjs.com) server:

   ```ts
   import express from "express";
   import { Phelia, interactiveMessageHandler } from "phelia/core";

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

| Component                                                                                                              |     | Example                                                                                                                            |
| ---------------------------------------------------------------------------------------------------------------------- | --- | ---------------------------------------------------------------------------------------------------------------------------------- |
| [Actions](https://api.slack.com/reference/block-kit/blocks#actions)                                                    | ✅  | [Counter](https://github.com/maxchehab/phelia/blob/master/src/example/counter.tsx)                                                 |
| [Context](https://api.slack.com/reference/block-kit/blocks#context)                                                    | ✅  |
| [Divider](https://api.slack.com/reference/block-kit/blocks#divider)                                                    | ✅  | [Random Image](https://github.com/maxchehab/phelia/blob/master/src/example/random-image.tsx)                                       |
| [Image Block](https://api.slack.com/reference/block-kit/blocks#image)                                                  | ✅  | [Random Image](https://github.com/maxchehab/phelia/blob/master/src/example/random-image.tsx)                                       |
| [Input](https://api.slack.com/reference/block-kit/blocks#input)                                                        | ✅  | [Modal Example](https://github.com/maxchehab/phelia/blob/master/src/example/modal-example.tsx)                                     |
| [Section](https://api.slack.com/reference/block-kit/blocks#section)                                                    | ✅  | [Counter](https://github.com/maxchehab/phelia/blob/master/src/example/counter.tsx)                                                 |
| [Button](https://api.slack.com/reference/block-kit/block-elements#button)                                              | ✅  | [Counter](https://github.com/maxchehab/phelia/blob/master/src/example/counter.tsx)                                                 |
| [Checkboxes](https://api.slack.com/reference/block-kit/block-elements#checkboxes)                                      | ✅  | [Modal Example](https://github.com/maxchehab/phelia/blob/master/src/example/modal-example.tsx)                                     |
| [Date Picker](https://api.slack.com/reference/block-kit/block-elements#datepicker)                                     | ✅  | [Birthday Picker](https://github.com/maxchehab/phelia/blob/master/src/example/birthday-picker.tsx)                                 |
| [Text](https://api.slack.com/reference/block-kit/composition-objects#text)                                             | ✅  | [Random Image](https://github.com/maxchehab/phelia/blob/master/src/example/random-image.tsx)                                       |
| [Image](https://api.slack.com/reference/block-kit/block-elements#image)                                                | ✅  | [Random Image](https://github.com/maxchehab/phelia/blob/master/src/example/random-image.tsx)                                       |
| [Multi static select Menu](https://api.slack.com/reference/block-kit/block-elements#multi_select)                      | ✅  | [Multi Static Select Menu](https://github.com/maxchehab/phelia/blob/master/src/example/multi-static-select-menu.tsx)               |
| [Multi external select Menu](https://api.slack.com/reference/block-kit/block-elements#multi_external_select)           | ✅  | [Multi External Select Menu](https://github.com/maxchehab/phelia/blob/master/src/example/multi-external-select-menu.tsx)           |
| [Multi users select Menu](https://api.slack.com/reference/block-kit/block-elements#multi_users_select)                 | ✅  | [Multi Users Select Menu](https://github.com/maxchehab/phelia/blob/master/src/example/multi-users-select-menu.tsx)                 |
| [Multi channels select Menu](https://api.slack.com/reference/block-kit/block-elements#multi_channels_select)           | ✅  | [Multi Channels Select Menu](https://github.com/maxchehab/phelia/blob/master/src/example/multi-channels-select-menu.tsx)           |
| [Multi conversations select Menu](https://api.slack.com/reference/block-kit/block-elements#multi_conversations_select) | ✅  | [Multi Conversations Select Menu](https://github.com/maxchehab/phelia/blob/master/src/example/multi-conversations-select-menu.tsx) |
| [Overflow Menu](https://api.slack.com/reference/block-kit/block-elements#overflow)                                     | ✅  | [Overflow Menu](https://github.com/maxchehab/phelia/blob/master/src/example/overflow-menu.tsx)                                     |
| [Plain-text input](https://api.slack.com/reference/block-kit/block-elements#input)                                     | ✅  | [Modal Example](https://github.com/maxchehab/phelia/blob/master/src/example/modal-example.tsx)                                     |
| [Radio button group](https://api.slack.com/reference/block-kit/block-elements#radio)                                   | ✅  | [Radio Buttons](https://github.com/maxchehab/phelia/blob/master/src/example/radio-buttons.tsx)                                     |
| [Static Select Menus](https://api.slack.com/reference/block-kit/block-elements#static_select)                          | ✅  | [Static Select Menu](https://github.com/maxchehab/phelia/blob/master/src/example/static-select-menu.tsx)                           |
| [User Select Menus](https://api.slack.com/reference/block-kit/block-elements#users_select)                             | ✅  | [User Select Menu](https://github.com/maxchehab/phelia/blob/master/src/example/user-select-menu.tsx)                               |
| [External Select Menus](https://api.slack.com/reference/block-kit/block-elements#external_select)                      | ✅  | [External Select Menu](https://github.com/maxchehab/phelia/blob/master/src/example/external-select-menu.tsx)                       |
| [Conversation Select Menus](https://api.slack.com/reference/block-kit/block-elements#conversations_select)             | ✅  | [Conversation Select Menu](https://github.com/maxchehab/phelia/blob/master/src/example/conversations-select-menu.tsx)              |
| [Channel Select Menus](https://api.slack.com/reference/block-kit/block-elements#channels_select)                       | ✅  | [Channel Select Menu](https://github.com/maxchehab/phelia/blob/master/src/example/channels-select-menu.tsx)                        |
| [Text](https://api.slack.com/reference/block-kit/composition-objects#text)                                             | ✅  | [Counter](https://github.com/maxchehab/phelia/blob/master/src/example/counter.tsx)                                                 |
| [Confirmation dialog](https://api.slack.com/reference/block-kit/composition-objects#confirm)                           | ✅  | [Random Image](https://github.com/maxchehab/phelia/blob/master/src/example/random-image.tsx)                                       |
| [Option](https://api.slack.com/reference/block-kit/composition-objects#option)                                         | ✅  |
| [Option group](https://api.slack.com/reference/block-kit/composition-objects#option_group)                             | ✅  | [Static Select Menu](https://github.com/maxchehab/phelia/blob/master/src/example/static-select-menu.tsx)                           |
| [Messages](https://api.slack.com/surfaces/messages)                                                                    | ✅  | [Server](https://github.com/maxchehab/phelia/blob/master/src/example/server.ts)                                                    |
| [Modals](https://api.slack.com/surfaces/modals)                                                                        | ✅  | [Modal Example](https://github.com/maxchehab/phelia/blob/master/src/example/modal-example.tsx)                                     |
| [Home Tab](https://api.slack.com/surfaces/tabs)                                                                        | ✅  | [Home App Example](https://github.com/maxchehab/phelia/blob/master/src/example/home-app.tsx)                                       |
