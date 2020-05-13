<p align="center">
  <img src="https://raw.githubusercontent.com/maxchehab/phelia/master/screenshots/hero.gif">
</p>

# ⚡ Phelia

> React for Slack Apps

Build interactive Slack apps without webhooks or JSON headache. If you know React, you know how to make a Slack app.

# Quick start

1. Create your message with React:

   ```tsx
   import randomImage from "../utils";

   export function RandomImage({ useState }: PheliaMessageProps) {
     const [imageUrl, setImageUrl] = useState("imageUrl", randomImage());

     return (
       <Message text="Choose a dog">
         <ImageBlock
           title="an adorable :dog:"
           alt="a very adorable doggy dog"
           imageUrl={imageUrl}
           emoji
         />
         <Divider />
         <Actions>
           <Button
             style="primary"
             action="randomImage"
             onClick={() => setImageUrl(randomImage())}
           >
             New doggy
           </Button>
         </Actions>
       </Message>
     );
   }
   ```

2. Register your component

   ```ts
   const client = new Phelia(process.env.SLACK_TOKEN);

   app.post(
     "/interactions",
     client.messageHandler(process.env.SLACK_SIGNING_SECRET, [RandomImage])
   );

   client.postMessage(RandomImage, "@max");
   ```

3. Interact with your message:
   <p align="left">
     <img src="https://raw.githubusercontent.com/maxchehab/phelia/master/screenshots/doggies.gif">
   </p>

See: [docs](https://github.com/maxchehab/phelia/blob/master/docs) for more info or join our [community Slack](https://join.slack.com/t/phelia/shared_invite/zt-dm4ln2w5-6aOXvv5ewiifDJGsplcVjA).

# How this works

Phelia transforms React components into Slack messages by use of a custom [React reconciler](https://github.com/maxchehab/phelia/blob/master/src/core/reconciler.ts). Components (with their internal state and props) are serialized into a [custom storage](https://github.com/maxchehab/phelia/wiki/Documentation#custom-storage). When a user interacts with a posted message Phelia retrieves the component, re-hydrates it's state and props, and performs any actions which may result in a new state.

## Components

Each component is a mapping of a specific object type for a slack block.
There are 3 categories of components, each with special rules for how that component can be used with other components.

1. Surface Components (Message, Home, Modal) - Root components that contains Block Components
2. Block Components (Actions, Context, Divider, Image, Input, Section) - Direct descendants of a Surface Component. Contains Block Components
3. Block Element Components (Text, CheckBoxes, TextField, etc) - Direct descendants of a Block Components.

# Feature Support

To request a feature [submit a new issue](https://github.com/maxchehab/phelia/issues/new).
| Component | | Example |
| ---------------------------------------------------------------------------------------------------------------------- | --- | ---------------------------------------------------------------------------------------------------------------------------------- |
| [Actions](https://api.slack.com/reference/block-kit/blocks#actions) | ✅ | [Counter](https://github.com/maxchehab/phelia/blob/master/src/example/example-messages/counter.tsx) |
| [Button](https://api.slack.com/reference/block-kit/block-elements#button) | ✅ | [Counter](https://github.com/maxchehab/phelia/blob/master/src/example/example-messages/counter.tsx) |
| [Channel Select Menus](https://api.slack.com/reference/block-kit/block-elements#channels_select) | ✅ | [Channel Select Menu](https://github.com/maxchehab/phelia/blob/master/src/example/example-messages/channels-select-menu.tsx) |
| [Checkboxes](https://api.slack.com/reference/block-kit/block-elements#checkboxes) | ✅ | [Modal Example](https://github.com/maxchehab/phelia/blob/master/src/example/example-messages/modal-example.tsx) |
| [Confirmation dialog](https://api.slack.com/reference/block-kit/composition-objects#confirm) | ✅ | [Random Image](https://github.com/maxchehab/phelia/blob/master/src/example/example-messages/random-image.tsx) |
| [Context](https://api.slack.com/reference/block-kit/blocks#context) | ✅ |
| [Conversation Select Menus](https://api.slack.com/reference/block-kit/block-elements#conversations_select) | ✅ | [Conversation Select Menu](https://github.com/maxchehab/phelia/blob/master/src/example/example-messages/conversations-select-menu.tsx) |
| [Date Picker](https://api.slack.com/reference/block-kit/block-elements#datepicker) | ✅ | [Birthday Picker](https://github.com/maxchehab/phelia/blob/master/src/example/example-messages/birthday-picker.tsx) |
| [Divider](https://api.slack.com/reference/block-kit/blocks#divider) | ✅ | [Random Image](https://github.com/maxchehab/phelia/blob/master/src/example/example-messages/random-image.tsx) |
| [External Select Menus](https://api.slack.com/reference/block-kit/block-elements#external_select) | ✅ | [External Select Menu](https://github.com/maxchehab/phelia/blob/master/src/example/example-messages/external-select-menu.tsx) |
| [Home Tab](https://api.slack.com/surfaces/tabs) | ✅ | [Home App Example](https://github.com/maxchehab/phelia/blob/master/src/example/example-messages/home-app.tsx) |
| [Image Block](https://api.slack.com/reference/block-kit/blocks#image) | ✅ | [Random Image](https://github.com/maxchehab/phelia/blob/master/src/example/example-messages/random-image.tsx) |
| [Image](https://api.slack.com/reference/block-kit/block-elements#image) | ✅ | [Random Image](https://github.com/maxchehab/phelia/blob/master/src/example/example-messages/random-image.tsx) |
| [Input](https://api.slack.com/reference/block-kit/blocks#input) | ✅ | [Modal Example](https://github.com/maxchehab/phelia/blob/master/src/example/example-messages/modal-example.tsx) |
| [Messages](https://api.slack.com/surfaces/messages) | ✅ | [Server](https://github.com/maxchehab/phelia/blob/master/src/example/example-messages/server.ts) |
| [Modals](https://api.slack.com/surfaces/modals) | ✅ | [Modal Example](https://github.com/maxchehab/phelia/blob/master/src/example/example-messages/modal-example.tsx) |
| [Multi channels select Menu](https://api.slack.com/reference/block-kit/block-elements#multi_channels_select) | ✅ | [Multi Channels Select Menu](https://github.com/maxchehab/phelia/blob/master/src/example/example-messages/multi-channels-select-menu.tsx) |
| [Multi conversations select Menu](https://api.slack.com/reference/block-kit/block-elements#multi_conversations_select) | ✅ | [Multi Conversations Select Menu](https://github.com/maxchehab/phelia/blob/master/src/example/example-messages/multi-conversations-select-menu.tsx) |
| [Multi external select Menu](https://api.slack.com/reference/block-kit/block-elements#multi_external_select) | ✅ | [Multi External Select Menu](https://github.com/maxchehab/phelia/blob/master/src/example/example-messages/multi-external-select-menu.tsx) |
| [Multi static select Menu](https://api.slack.com/reference/block-kit/block-elements#multi_select) | ✅ | [Multi Static Select Menu](https://github.com/maxchehab/phelia/blob/master/src/example/example-messages/multi-static-select-menu.tsx) |
| [Multi users select Menu](https://api.slack.com/reference/block-kit/block-elements#multi_users_select) | ✅ | [Multi Users Select Menu](https://github.com/maxchehab/phelia/blob/master/src/example/example-messages/multi-users-select-menu.tsx) |
| [Option group](https://api.slack.com/reference/block-kit/composition-objects#option_group) | ✅ | [Static Select Menu](https://github.com/maxchehab/phelia/blob/master/src/example/example-messages/static-select-menu.tsx) |
| [Option](https://api.slack.com/reference/block-kit/composition-objects#option) | ✅ |
| [Overflow Menu](https://api.slack.com/reference/block-kit/block-elements#overflow) | ✅ | [Overflow Menu](https://github.com/maxchehab/phelia/blob/master/src/example/example-messages/overflow-menu.tsx) |
| [Plain-text input](https://api.slack.com/reference/block-kit/block-elements#input) | ✅ | [Modal Example](https://github.com/maxchehab/phelia/blob/master/src/example/example-messages/modal-example.tsx) |
| [Radio button group](https://api.slack.com/reference/block-kit/block-elements#radio) | ✅ | [Radio Buttons](https://github.com/maxchehab/phelia/blob/master/src/example/example-messages/radio-buttons.tsx) |
| [Section](https://api.slack.com/reference/block-kit/blocks#section) | ✅ | [Counter](https://github.com/maxchehab/phelia/blob/master/src/example/example-messages/counter.tsx) |
| [Static Select Menus](https://api.slack.com/reference/block-kit/block-elements#static_select) | ✅ | [Static Select Menu](https://github.com/maxchehab/phelia/blob/master/src/example/example-messages/static-select-menu.tsx) |
| [Text](https://api.slack.com/reference/block-kit/composition-objects#text) | ✅ | [Counter](https://github.com/maxchehab/phelia/blob/master/src/example/example-messages/counter.tsx) |
| [Text](https://api.slack.com/reference/block-kit/composition-objects#text) | ✅ | [Random Image](https://github.com/maxchehab/phelia/blob/master/src/example/example-messages/random-image.tsx) |
| [User Select Menus](https://api.slack.com/reference/block-kit/block-elements#users_select) | ✅ | [User Select Menu](https://github.com/maxchehab/phelia/blob/master/src/example/example-messages/users-select-menu.tsx) |
