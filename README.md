# ⚡ Phelia

<p align="center">
  <img src="/screenshots/screenshot1.png">
  A reactive Slack messaging framework.
</p>

# Table of Contents

- [⚡ Phelia](#%e2%9a%a1-phelia)
- [Table of Contents](#table-of-contents)
- [Quick start](#quick-start)
- [How this works](#how-this-works)
- [Custom Storage](#custom-storage)
- [Documentation](#documentation)
  - [Surface Components](#surface-components)
    - [Message](#message)
    - [Modal](#modal)
    - [Home](#home)
  - [Block Components](#block-components)
    - [Actions](#actions)
    - [Context](#context)
    - [Divider](#divider)
    - [ImageBlock](#imageblock)
    - [Input](#input)
    - [Section](#section)
  - [Block Elements](#block-elements)
    - [Button](#button)
    - [Checkboxes](#checkboxes)
    - [DatePicker](#datepicker)
    - [Image](#image)
    - [MultiSelectMenu](#multiselectmenu)
    - [OverflowMenu](#overflowmenu)
    - [RadioButtons](#radiobuttons)
    - [SelectMenu](#selectmenu)
    - [TextField](#textfield)
  - [Composition Elements](#composition-elements)
    - [Text](#text)
    - [Confirm](#confirm)
    - [Option](#option)
    - [OptionGroup](#optiongroup)
    - [ConversationFilter](#conversationfilter)
- [Feature Support](#feature-support)

# Quick start

1. Create an [express](https://expressjs.com) server:

   ```ts
   import express from "express";
   import Phelia from "phelia";

   import Counter from "./counter";

   const app = express();

   const client = new Phelia(process.env.SLACK_TOKEN);

   // Set up your interaction webhook hook
   app.post(
     "/interactions",
     client.messageHandler(process.env.SLACK_SIGNING_SECRET, [Counter])
   );

   // Post a message...
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
           <Button
             action="greet"
             onClick={event => setName(event.user.username)}
           >
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

Phelia transforms React components into Slack messages by use of a custom [React reconciler](https://github.com/maxchehab/phelia/blob/master/src/core/reconciler.ts). Components, with their internal state and props, are serialized into a [custom storage](#custom-storage). When a user interacts with a posted message Phelia retrieves the component, re-hydrates it's state and props, and performs any actions which may result in a new state.

# Custom Storage

Phelia uses a custom storage object to store posted messages and their properties such as **state**, **props**, and Component type. The persistance method can be customized by use of the `client.setStorage(storage)` method.

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

# Documentation

## Surface Components

A surface are anywhere an app can express itself through communication or interaction. Each registered components should return a surface component.

### Message

<p align="center">
  <img src="/screenshots/message.png">
</p>

App-published messages are dynamic yet transient spaces. They allow users to complete workflows among their Slack conversations.

**Provided Properties:**

| Properties | Type                       |
| ---------- | -------------------------- |
| useState   | a useState function        |
| useModal   | a useModal function        |
| props      | a JSON serializable object |

**Component Properties:**

| Properties | Type                                                                                                                                 | Required |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------ | -------- |
| children   | array of [Actions](#actions), [Context](#context), [Divider](#divider), [ImageBlock](#imageblock), or [Section](#section) components | yes      |
| text       | string                                                                                                                               | no       |

**Example:**

```tsx
const imageUrls = [
  "https://cdn.pixabay.com/photo/2015/06/08/15/02/pug-801826__480.jpg",
  "https://cdn.pixabay.com/photo/2015/03/26/09/54/pug-690566__480.jpg",
  "https://cdn.pixabay.com/photo/2018/03/31/06/31/dog-3277416__480.jpg",
  "https://cdn.pixabay.com/photo/2016/02/26/16/32/dog-1224267__480.jpg"
];

function randomImage(): string {
  const index = Math.floor(Math.random() * imageUrls.length);
  return imageUrls[index];
}

export function RandomImage({ useState }: PheliaMessageProps) {
  const [imageUrl, setImageUrl] = useState("imageUrl", randomImage());

  return (
    <Message text="Choose a dog">
      <ImageBlock
        emoji
        title={"an adorable :dog:"}
        alt={"a very adorable doggy dog"}
        imageUrl={imageUrl}
      />
      <Divider />
      <Actions>
        <Button
          style="primary"
          action="randomImage"
          onClick={() => setImageUrl(randomImage())}
          confirm={
            <Confirm
              title={"Are you sure?"}
              confirm={"Yes, gimmey that doggy!"}
              deny={"No, I hate doggies"}
            >
              <Text type="mrkdwn">
                Are you certain you want to see the _cutest_ doggy ever?
              </Text>
            </Confirm>
          }
        >
          New doggy
        </Button>
      </Actions>
    </Message>
  );
}
```

### Modal

<p align="center">
  <img src="/screenshots/modal.png">
</p>

Modals provide focused spaces ideal for requesting and collecting data from users, or temporarily displaying dynamic and interactive information.

**Provided Properties:**

| Properties | Type                       |
| ---------- | -------------------------- |
| useState   | a useState function        |
| props      | a JSON serializable object |

**Component Properties:**

| Properties | Type                                                                                                                                                  | Required |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| children   | array of [Actions](#actions), [Context](#context), [Divider](#divider), [ImageBlock](#imageblock), [Input](#input), or [Section](#section) components | yes      |
| title      | string or [Text](#text)                                                                                                                               | yes      |
| submit     | string or [Text](#text)                                                                                                                               | no       |
| close      | string or [Text](#text)                                                                                                                               | no       |

**Example:**

```tsx
export function MyModal({ useState }: PheliaModalProps) {
  const [showForm, setShowForm] = useState("showForm", false);

  return (
    <Modal title="A fancy pants modal" submit="submit the form">
      {!showForm && (
        <Actions>
          <Button action="showForm" onClick={() => setShowForm(true)}>
            Show form
          </Button>
        </Actions>
      )}

      {showForm && (
        <>
          <Input label="Expiration date">
            <DatePicker action="date" />
          </Input>

          <Input label="Little bit">
            <TextField action="little-bit" placeholder="just a little bit" />
          </Input>

          <Input label="Some checkboxes">
            <Checkboxes action="checkboxes">
              <Option value="option-a">option a</Option>

              <Option value="option-b" selected>
                option b
              </Option>

              <Option value="option-c">option c</Option>
            </Checkboxes>
          </Input>

          <Input label="Summary">
            <TextField
              action="summary"
              placeholder="type something here"
              multiline
            />
          </Input>
        </>
      )}
    </Modal>
  );
}
```

### Home

<p align="center">
  <img src="/screenshots/home-app.png">
</p>

The Home tab is a persistent, yet dynamic interface for apps that lives within the App Home.

**Provided Properties:**

| Properties | Type                |
| ---------- | ------------------- |
| useState   | a useState function |
| useModal   | a useModal function |
| user       | \*a user object     |

_\*if scope `users:read` is not available, the user object will only contain an `id` property._

**Component Properties:**

| Properties | Type                                                                                                                                 | Required |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------ | -------- |
| children   | array of [Actions](#actions), [Context](#context), [Divider](#divider), [ImageBlock](#imageblock), or [Section](#section) components | yes      |
| title      | string or [Text](#text)                                                                                                              | no       |

**Example:**

````tsx
export function HomeApp({ useState, useModal, user }: PheliaHomeProps) {
  const [counter, setCounter] = useState("counter", 0);
  const [form, setForm] = useState("form");

  const openModal = useModal("modal", MyModal, event =>
    setForm(JSON.stringify(event.form, null, 2))
  );

  return (
    <Home>
      <Section>
        <Text emoji>Hey there {user.username} :wave:</Text>
        <Text type="mrkdwn">*Counter:* {counter}</Text>
      </Section>

      <Actions>
        <Button action="counter" onClick={() => setCounter(counter + 1)}>
          Click me
        </Button>

        <Button action="modal" onClick={() => openModal()}>
          Open a Modal
        </Button>
      </Actions>

      {form && (
        <Section>
          <Text type="mrkdwn">{"```\n" + form + "\n```"}</Text>
        </Section>
      )}
    </Home>
  );
}
````

## Block Components

Blocks are a series of components that can be combined to create visually rich and compellingly interactive messages.

### Actions

A block that is used to hold interactive elements.

**Component Properties:**

| Properties | Type                                                                                                                                                                                                                         | Required |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| children   | array of [Button](#button), [SelectMenu](#selectmenu), [RadioButtons](#radiobuttons), [MultiSelectMenu](#multiselectmenu), [Checkboxes](#checkboxes), [OverflowMenu](#overflowmenu), or [DatePicker](#datepicker) components | yes      |

**Example:**

```tsx
<Actions>
  <Button action="showForm" onClick={event => setShowForm(true)}>
    Show form
  </Button>

  <DatePicker onSelect={event => setDate(event.selected)} action="date" />
</Actions>
```

### Context

Displays message context, which can include both images and text.

**Component Properties:**

| Properties | Type                                                 | Required |
| ---------- | ---------------------------------------------------- | -------- |
| children   | array of [Image](#image) or [Text](#text) components | yes      |

**Example:**

```tsx
<Context>
  <ImageBlock imageUrl="https://google.com/image.png" alt="an image" />
</Context>
```

### Divider

A content divider, like an `<hr>`, to split up different blocks inside of a surface. It does not have any properties.

**Example:**

```tsx
<Divider />
```

### ImageBlock

A simple image block.

**Component Properties:**

| Properties | Type    | Required |
| ---------- | ------- | -------- |
| alt        | string  | yes      |
| emoji      | boolean | no       |
| imageUrl   | string  | yes      |
| title      | string  | no       |

**Example:**

```tsx
<ImageBlock imageUrl="https://google.com/image.png" alt="an image" />
```

### Input

A block that collects information from users

**Component Properties:**

| Properties | Type                                                                                                                              | Required |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------- | -------- |
| children   | a [TextField](#textfield), [SelectMenu](#selectmenu), [MultiSelectMenu](#multiselectmenu), or [DatePicker](#datepicker) component | yes      |
| hint       | string or [Text](#text)                                                                                                           | no       |
| label      | string or [Text](#text)                                                                                                           | yes      |
| optional   | boolean                                                                                                                           | no       |

**Example:**

```tsx
<Input label="Expiration date">
  <DatePicker action="date" />
</Input>
```

### Section

A block that collects information from users

**Component Properties:**

| Properties | Type                                                                                                                                                                                                                 | Required                             |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| accessory  | a [Button](#button), [SelectMenu](#selectmenu), [RadioButtons](#radiobuttons), [MultiSelectMenu](#multiselectmenu), [Checkboxes](#checkboxes), [OverflowMenu](#overflowmenu), or [DatePicker](#datepicker) component | no                                   |
| children   | an array of Text components                                                                                                                                                                                          | if the text property is not included |
| text       | string or [Text](#text)                                                                                                                                                                                              | if no children are included          |

**Example:**

```tsx
<Section
  text={"Select your birthday."}
  accessory={
    <DatePicker
      onSelect={async ({ user, date }) => {
        setBirth(date);
        setUser(user.username);
      }}
      action="date"
    />
  }
/>
```

## Block Elements

### Button

An interactive component that inserts a button. The button can be a trigger for anything from opening a simple link to starting a complex workflow.

**Component Properties:**

| Properties | Type                  | Required                           |
| ---------- | --------------------- | ---------------------------------- |
| action     | string                | if an onClick property is provided |
| children   | string                | yes                                |
| confirm    | [Confirm](#confirm)   | no                                 |
| onClick    | InteractionCallback   | no                                 |
| style      | "danger" or "primary" | no                                 |
| url        | string                | no                                 |

**Example:**

```tsx
<Button action="name" onClick={event => setName(event.user.username)}>
  Set name
</Button>
```

```tsx
<Button url="https://google.com">Open google</Button>
```

### Checkboxes

A checkbox group that allows a user to choose multiple items from a list of possible options.

**Component Properties:**

| Properties | Type                                  | Required |
| ---------- | ------------------------------------- | -------- |
| action     | string                                | yes      |
| children   | array of [Option](#option) components | yes      |
| confirm    | [Confirm](#confirm)                   | no       |
| onSelect   | SelectOptionsCallback                 | no       |

**Example:**

```tsx
<Checkboxes action="options" onSelect={event => setSelected(event.selected)}>
  <Option value="1" selected>
    I am initially selected
  </Option>
  <Option value="2">hello</Option>
</Checkboxes>
```

### DatePicker

An element which lets users easily select a date from a calendar style UI

**Component Properties:**

| Properties  | Type                    | Required |
| ----------- | ----------------------- | -------- |
| action      | string                  | yes      |
| confirm     | [Confirm](#confirm)     | no       |
| initialDate | string                  | no       |
| onSelect    | SelectDateCallback      | no       |
| placeholder | string or [Text](#text) | no       |

**Example:**

```tsx
<DatePicker
  onSelect={event => setDate(event.date)}
  action="date"
  initialDate="2020-11-11"
/>
```

### Image

An element to insert an image as part of a larger block of content. If you want a block with only an image in it, you're looking for the [Image Block](#imageblock).

**Component Properties:**

| Properties | Type   | Required |
| ---------- | ------ | -------- |
| imageUrl   | string | yes      |
| alt        | string | yes      |

**Example:**

```tsx
<Image imageUrl="https://images.com/dog.png" alt="an image of a dog" />
```

### MultiSelectMenu

A multi-select menu allows a user to select multiple items from a list of options.

**Component Properties:**

| Properties           | Type                                                                 | Required                |
| -------------------- | -------------------------------------------------------------------- | ----------------------- |
| action               | string                                                               | yes                     |
| placeholder          | string or [Text](#text)                                              | yes                     |
| confirm              | [Confirm](#confirm)                                                  | no                      |
| onSelect             | SelectOptionsCallbacks                                               | no                      |
| maxSelectedItems     | integer                                                              | no                      |
| type                 | "static" "users" "channels" "external" or "conversations"            | no                      |
| children             | array of [Option](#option) or [OptionGroup](#optiongroup) components | if "static" type        |
| initialUsers         | array of User Ids                                                    | if "users" type         |
| initialChannels      | array of Channel Ids                                                 | if "channels" type      |
| initialOptions       | array of Option components                                           | if "external" type      |
| onSearchOptions      | a SearchOptionsCallback                                              | if "external" type      |
| minQueryLength       | integer                                                              | if "external" type      |
| initialConversations | array of Conversation Ids                                            | if "conversations" type |
| filter               | a [ConversationFilter](#conversationfilter) object                   | if "conversations" type |

**Examples:**

```tsx
<MultiSelectMenu
  onSearchOptions={event => filterUsers(event.query)}
  type="external"
  action="select-users"
  placeholder="Select a user"
/>
```

```tsx
<MultiSelectMenu action="selection" placeholder="Select an option">
  <OptionGroup label="an option group">
    <Option value="option-a">option a</Option>
    <Option value="option-b">option b</Option>
    <Option value="option-c">option c</Option>
  </OptionGroup>

  <OptionGroup label="another option group">
    <Option value="option-d">option d</Option>
    <Option value="option-e" selected>
      option e
    </Option>
    <Option value="option-f">option f</Option>
  </OptionGroup>
</MultiSelectMenu>
```

### OverflowMenu

Presents a list of options to choose from with no type-ahead field, and the button always appears with an ellipsis ("…") rather than a placeholder.

**Component Properties:**

| Properties | Type                                                                 | Required |
| ---------- | -------------------------------------------------------------------- | -------- |
| action     | string                                                               | yes      |
| children   | array of [Option](#option) or [OptionGroup](#optiongroup) components | yes      |
| confirm    | [Confirm](#confirm)                                                  | no       |
| onSelect   | SelectOptionCallback                                                 | no       |

**Example:**

```tsx
<OverflowMenu action="overflow" onSelect={event => setSelected(event.selected)}>
  <Option value="dogs">Dogs</Option>
  <Option value="cats">Cats</Option>
  <Option url="https://pixabay.com/images/search/dog/" value="a-link">
    Dog images
  </Option>
</OverflowMenu>
```

### RadioButtons

A radio button group that allows a user to choose one item from a list of possible options.

**Component Properties:**

| Properties | Type                                                                 | Required |
| ---------- | -------------------------------------------------------------------- | -------- |
| action     | string                                                               | yes      |
| children   | array of [Option](#option) or [OptionGroup](#optiongroup) components | yes      |
| confirm    | [Confirm](#confirm)                                                  | no       |
| onSelect   | SelectOptionCallback                                                 | no       |

**Example:**

```tsx
<RadioButtons
  action="radio-buttons"
  onSelect={event => setSelected(event.selected)}
>
  <Option value="option-a">option a</Option>
  <Option value="option-b" selected>
    option b
  </Option>
  <Option value="option-c">option c</Option>
</RadioButtons>
```

### SelectMenu

A select menu creates a drop down menu with a list of options for a user to choose. The select menu also includes type-ahead functionality, where a user can type a part or all of an option string to filter the list.

**Component Properties:**

| Properties          | Type                                                                    | Required                |
| ------------------- | ----------------------------------------------------------------------- | ----------------------- |
| action              | string                                                                  | yes                     |
| placeholder         | string or [Text](#text)                                                 | yes                     |
| confirm             | [Confirm](#confirm)                                                     | no                      |
| onSelect            | SelectOptionCallback                                                    | no                      |
| type                | "static" "users" "channels" "external" or "conversations"               | no                      |
| children            | an array of [Option](#option) or [OptionGroup](#optiongroup) components | if "static" type        |
| initialUsers        | User Ids                                                                | if "users" type         |
| initialChannel      | Channel Ids                                                             | if "channels" type      |
| initialOption       | Option                                                                  | if "external" type      |
| onSearchOptions     | a SearchOptionsCallback                                                 | if "external" type      |
| minQueryLength      | integer                                                                 | if "external" type      |
| initialConversation | Conversation Ids                                                        | if "conversations" type |
| filter              | a [ConversationFilter](#conversationfilter) object                      | if "conversations" type |

**Examples:**

```tsx
<SelectMenu
  onSearchOptions={event => filterUsers(event.query)}
  type="external"
  action="select-menu"
  placeholder="Select a user"
/>
```

```tsx
<SelectMenu
  type="users"
  action="select-groups"
  placeholder="Select a user"
  onSelect={event => setSelected(event.selected)}
/>
```

### TextField

A plain-text input creates a field where a user can enter freeform data. It can appear as a single-line field or a larger textarea using the multiline flag.

**Component Properties:**

| Properties   | Type                    | Required |
| ------------ | ----------------------- | -------- |
| action       | string                  | yes      |
| initialValue | string                  | no       |
| maxLength    | integer                 | no       |
| minLength    | integer                 | no       |
| multiline    | boolean                 | no       |
| placeholder  | string or [Text](#text) | no       |

**Example:**

```tsx
<TextField action="summary" placeholder="type something here" multiline />
```

## Composition Elements

Composition Elements are commonly used elements.

### Text

An element with text.

**Component Properties:**

| Properties | Type                     | Required             |
| ---------- | ------------------------ | -------------------- |
| children   | string                   | yes                  |
| emoji      | boolean                  | if "plain_text" type |
| type       | "plain_text" or "mrkdwn" | no                   |
| verbatim   | boolean                  | if "mrkdwn" type     |

**Example:**

```tsx
<Text emoji>Hello there :wave:</Text>
```

### Confirm

An object that defines a dialog that provides a confirmation step to any interactive element. This dialog will ask the user to confirm their action by offering a confirm and deny buttons.

**Component Properties:**

| Properties | Type                    | Required |
| ---------- | ----------------------- | -------- |
| children   | string or [Text](#text) | yes      |
| confirm    | string or [Text](#text) | yes      |
| deny       | string or [Text](#text) | yes      |
| style      | "danger" or "primary"   | no       |
| title      | string or [Text](#text) | yes      |

**Example:**

```tsx
<Button
  emoji
  confirm={
    <Confirm title="Confirm me?" confirm="Yes, I confirm!" deny="No, go away!">
      Do you confirm me?
    </Confirm>
  }
>
  Click me
</Button>
```

### Option

Represents a single selectable item in a [SelectMenu](#selectmenu), [MultiSelectMenu](#multiselectmenu), [Checkboxes](#checkboxes), [RadioButtons](#radiobuttons), or [OverflowMenu](#overflowmenu).

**Component Properties:**

| Properties  | Type                    | Required |
| ----------- | ----------------------- | -------- |
| children    | string or [Text](#text) | yes      |
| description | string or [Text](#text) | no       |
| selected    | boolean                 | no       |
| url         | string                  | no       |
| value       | string                  | no       |

**Example:**

```tsx
<Option value="option-1" selected>
  An option
</Option>
```

### OptionGroup

Provides a way to group options in a [SelectMenu](#selectmenu) or [MultiSelectMenu](#multiselectmenu)

**Component Properties:**

| Properties | Type                                  | Required |
| ---------- | ------------------------------------- | -------- |
| children   | array of [Option](#option) components | yes      |
| label      | string or [Text](#text)               | yes      |

**Example:**

```tsx
<OptionGroup label="an option group">
  <Option value="option-a">option a</Option>
  <Option value="option-b">option b</Option>
  <Option value="option-c">option c</Option>
</OptionGroup>
```

### ConversationFilter

Provides a way to filter the list of Conversations in a [SelectMenu](#selectmenu) or [MultiSelectMenu](#multiselectmenu)

| Properties                    | Type                           | Required |
| ----------------------------- | ------------------------------ | -------- |
| include                       | "im" "mpim" "private" "public" | no       |
| excludeBotUsers               | boolean                        | no       |
| excludeExternalSharedChannels | boolean                        | no       |

**Example:**

```tsx
<MultiSelectMenu
  type="conversations"
  action="select-conversation"
  filter={{
    include: "im",
    excludeBotUsers: true,
    excludeExternalSharedChannels: true
  }}
/>
```

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

````

```

```

```

```
````
