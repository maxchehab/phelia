import dotenv from "dotenv";
import express from "express";

import { ModalExample, MyModal } from "./modal-example";
import { PheliaClient, interactiveMessageHandler } from "../core";
import { RadioButtonModal, RadioButtonExample } from "./radio-buttons";
import BirthdayPicker from "./birthday-picker";
import Counter from "./counter";
import Greeter from "./greeter";
import OverflowMenuExample from "./overflow-menu";
import RandomImage from "./random-image";
import {
  StaticSelectMenuExample,
  StaticSelectMenuModal
} from "./static-select-menu";
import {
  UsersSelectMenuExample,
  UsersSelectMenuModal
} from "./users-select-menu";
import {
  ConversationsSelectMenuExample,
  ConversationsSelectMenuModal
} from "./conversations-select-menu";
import {
  ChannelsSelectMenuExample,
  ChannelsSelectMenuModal
} from "./channels-select-menu";
import {
  ExternalSelectMenuExample,
  ExternalSelectMenuModal
} from "./external-select-menu";
import {
  MultiStaticSelectMenuExample,
  MultiStaticSelectMenuModal
} from "./multi-static-select-menu";
import {
  MultiExternalSelectMenuExample,
  MultiExternalSelectMenuModal
} from "./multi-external-select-menu";
import {
  MultiUsersSelectMenuExample,
  MultiUsersSelectMenuModal
} from "./multi-users-select-menu";
import {
  MultiChannelsSelectMenuModal,
  MultiChannelsSelectMenuExample
} from "./multi-channels-select-menu";

dotenv.config();

const app = express();
const port = 3000;

const components = [
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
  MultiChannelsSelectMenuModal
];

app.post(
  "/api/webhook",
  interactiveMessageHandler(process.env.SLACK_SIGNING_SECRET, components)
);

// This is how you post a message....
const client = new PheliaClient(process.env.SLACK_TOKEN);
client.postMessage(MultiChannelsSelectMenuExample, "@max");

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
