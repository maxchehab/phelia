import dotenv from "dotenv";
import express from "express";
import { createEventAdapter } from "@slack/events-api";

import Phelia from "../core";
import {
  BirthdayPicker,
  ChannelsSelectMenuExample,
  ChannelsSelectMenuModal,
  ConversationsSelectMenuExample,
  ConversationsSelectMenuModal,
  Counter,
  ExternalSelectMenuExample,
  ExternalSelectMenuModal,
  Greeter,
  ModalExample,
  MultiChannelsSelectMenuExample,
  MultiChannelsSelectMenuModal,
  MultiConversationsSelectMenuExample,
  MultiConversationsSelectMenuModal,
  MultiExternalSelectMenuExample,
  MultiExternalSelectMenuModal,
  MultiStaticSelectMenuExample,
  MultiStaticSelectMenuModal,
  MultiUsersSelectMenuExample,
  MultiUsersSelectMenuModal,
  MyModal,
  OverflowMenuExample,
  RadioButtonExample,
  RadioButtonModal,
  RandomImage,
  StaticSelectMenuExample,
  StaticSelectMenuModal,
  UsersSelectMenuExample,
  UsersSelectMenuModal,
  HomeApp,
} from "./example-messages";

dotenv.config();

const app = express();
const port = 3000;

const client = new Phelia(process.env.SLACK_TOKEN);

client.registerComponents([
  BirthdayPicker,
  Counter,
  Greeter,
  ModalExample,
  MyModal,
  RandomImage,
  OverflowMenuExample,
  RadioButtonModal,
  RadioButtonExample,
  StaticSelectMenuExample,
  StaticSelectMenuModal,
  UsersSelectMenuExample,
  UsersSelectMenuModal,
  ConversationsSelectMenuExample,
  ConversationsSelectMenuModal,
  ChannelsSelectMenuModal,
  ChannelsSelectMenuExample,
  ExternalSelectMenuExample,
  ExternalSelectMenuModal,
  MultiStaticSelectMenuExample,
  MultiStaticSelectMenuModal,
  MultiExternalSelectMenuExample,
  MultiExternalSelectMenuModal,
  MultiUsersSelectMenuExample,
  MultiUsersSelectMenuModal,
  MultiChannelsSelectMenuExample,
  MultiChannelsSelectMenuModal,
  MultiConversationsSelectMenuExample,
  MultiConversationsSelectMenuModal,
]);

// Register the interaction webhook
app.post(
  "/interactions",
  client.messageHandler(process.env.SLACK_SIGNING_SECRET)
);

// Register your Home App
const slackEvents = createEventAdapter(process.env.SLACK_SIGNING_SECRET);

slackEvents.on("app_home_opened", client.appHomeHandler(HomeApp));

app.use("/events", slackEvents.requestListener());

(async () => {
  const key = await client.postMessage(ModalExample, "@max", { name: "Max" });

  await client.updateMessage(key, { name: "me but laters" });
})();

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
