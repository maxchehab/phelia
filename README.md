<p align="center">
  <img src="https://raw.githubusercontent.com/maxchehab/phelia/master/screenshots/hero.gif">
</p>

# ⚡ Phelia

> React for Slack Apps

Build interactive Slack apps without webhooks or JSON headache. If you know React, you know how to make a Slack app.

See: [docs](https://github.com/maxchehab/phelia/wiki/Documentation) for more info or just get started:

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

# How this works

Phelia transforms React components into Slack messages by use of a custom [React reconciler](https://github.com/maxchehab/phelia/blob/master/src/core/reconciler.ts). Components (with their internal state and props) are serialized into a [custom storage](#custom-storage). When a user interacts with a posted message Phelia retrieves the component, re-hydrates it's state and props, and performs any actions which may result in a new state.

# Feature Support

To request a feature [submit a new issue](https://github.com/maxchehab/phelia/issues/new).
| Component | | Example |
| ---------------------------------------------------------------------------------------------------------------------- | --- | ---------------------------------------------------------------------------------------------------------------------------------- |
| [Actions](https://api.slack.com/reference/block-kit/blocks#actions) | ✅ | [Counter](https://github.com/maxchehab/phelia/blob/master/src/example/counter.tsx) |
| [Button](https://api.slack.com/reference/block-kit/block-elements#button) | ✅ | [Counter](https://github.com/maxchehab/phelia/blob/master/src/example/counter.tsx) |
| [Channel Select Menus](https://api.slack.com/reference/block-kit/block-elements#channels_select) | ✅ | [Channel Select Menu](https://github.com/maxchehab/phelia/blob/master/src/example/channels-select-menu.tsx) |
| [Checkboxes](https://api.slack.com/reference/block-kit/block-elements#checkboxes) | ✅ | [Modal Example](https://github.com/maxchehab/phelia/blob/master/src/example/modal-example.tsx) |
| [Confirmation dialog](https://api.slack.com/reference/block-kit/composition-objects#confirm) | ✅ | [Random Image](https://github.com/maxchehab/phelia/blob/master/src/example/random-image.tsx) |
| [Context](https://api.slack.com/reference/block-kit/blocks#context) | ✅ |
| [Conversation Select Menus](https://api.slack.com/reference/block-kit/block-elements#conversations_select) | ✅ | [Conversation Select Menu](https://github.com/maxchehab/phelia/blob/master/src/example/conversations-select-menu.tsx) |
| [Date Picker](https://api.slack.com/reference/block-kit/block-elements#datepicker) | ✅ | [Birthday Picker](https://github.com/maxchehab/phelia/blob/master/src/example/birthday-picker.tsx) |
| [Divider](https://api.slack.com/reference/block-kit/blocks#divider) | ✅ | [Random Image](https://github.com/maxchehab/phelia/blob/master/src/example/random-image.tsx) |
| [External Select Menus](https://api.slack.com/reference/block-kit/block-elements#external_select) | ✅ | [External Select Menu](https://github.com/maxchehab/phelia/blob/master/src/example/external-select-menu.tsx) |
| [Home Tab](https://api.slack.com/surfaces/tabs) | ✅ | [Home App Example](https://github.com/maxchehab/phelia/blob/master/src/example/home-app.tsx) |
| [Image Block](https://api.slack.com/reference/block-kit/blocks#image) | ✅ | [Random Image](https://github.com/maxchehab/phelia/blob/master/src/example/random-image.tsx) |
| [Image](https://api.slack.com/reference/block-kit/block-elements#image) | ✅ | [Random Image](https://github.com/maxchehab/phelia/blob/master/src/example/random-image.tsx) |
| [Input](https://api.slack.com/reference/block-kit/blocks#input) | ✅ | [Modal Example](https://github.com/maxchehab/phelia/blob/master/src/example/modal-example.tsx) |
| [Messages](https://api.slack.com/surfaces/messages) | ✅ | [Server](https://github.com/maxchehab/phelia/blob/master/src/example/server.ts) |
| [Modals](https://api.slack.com/surfaces/modals) | ✅ | [Modal Example](https://github.com/maxchehab/phelia/blob/master/src/example/modal-example.tsx) |
| [Multi channels select Menu](https://api.slack.com/reference/block-kit/block-elements#multi_channels_select) | ✅ | [Multi Channels Select Menu](https://github.com/maxchehab/phelia/blob/master/src/example/multi-channels-select-menu.tsx) |
| [Multi conversations select Menu](https://api.slack.com/reference/block-kit/block-elements#multi_conversations_select) | ✅ | [Multi Conversations Select Menu](https://github.com/maxchehab/phelia/blob/master/src/example/multi-conversations-select-menu.tsx) |
| [Multi external select Menu](https://api.slack.com/reference/block-kit/block-elements#multi_external_select) | ✅ | [Multi External Select Menu](https://github.com/maxchehab/phelia/blob/master/src/example/multi-external-select-menu.tsx) |
| [Multi static select Menu](https://api.slack.com/reference/block-kit/block-elements#multi_select) | ✅ | [Multi Static Select Menu](https://github.com/maxchehab/phelia/blob/master/src/example/multi-static-select-menu.tsx) |
| [Multi users select Menu](https://api.slack.com/reference/block-kit/block-elements#multi_users_select) | ✅ | [Multi Users Select Menu](https://github.com/maxchehab/phelia/blob/master/src/example/multi-users-select-menu.tsx) |
| [Option group](https://api.slack.com/reference/block-kit/composition-objects#option_group) | ✅ | [Static Select Menu](https://github.com/maxchehab/phelia/blob/master/src/example/static-select-menu.tsx) |
| [Option](https://api.slack.com/reference/block-kit/composition-objects#option) | ✅ |
| [Overflow Menu](https://api.slack.com/reference/block-kit/block-elements#overflow) | ✅ | [Overflow Menu](https://github.com/maxchehab/phelia/blob/master/src/example/overflow-menu.tsx) |
| [Plain-text input](https://api.slack.com/reference/block-kit/block-elements#input) | ✅ | [Modal Example](https://github.com/maxchehab/phelia/blob/master/src/example/modal-example.tsx) |
| [Radio button group](https://api.slack.com/reference/block-kit/block-elements#radio) | ✅ | [Radio Buttons](https://github.com/maxchehab/phelia/blob/master/src/example/radio-buttons.tsx) |
| [Section](https://api.slack.com/reference/block-kit/blocks#section) | ✅ | [Counter](https://github.com/maxchehab/phelia/blob/master/src/example/counter.tsx) |
| [Static Select Menus](https://api.slack.com/reference/block-kit/block-elements#static_select) | ✅ | [Static Select Menu](https://github.com/maxchehab/phelia/blob/master/src/example/static-select-menu.tsx) |
| [Text](https://api.slack.com/reference/block-kit/composition-objects#text) | ✅ | [Counter](https://github.com/maxchehab/phelia/blob/master/src/example/counter.tsx) |
| [Text](https://api.slack.com/reference/block-kit/composition-objects#text) | ✅ | [Random Image](https://github.com/maxchehab/phelia/blob/master/src/example/random-image.tsx) |
| [User Select Menus](https://api.slack.com/reference/block-kit/block-elements#users_select) | ✅ | [User Select Menu](https://github.com/maxchehab/phelia/blob/master/src/example/user-select-menu.tsx) |
