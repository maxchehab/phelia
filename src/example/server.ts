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
  UsersSelectMenuModal
];

app.post(
  "/api/webhook",
  interactiveMessageHandler(process.env.SLACK_SIGNING_SECRET, components)
);

// This is how you post a message....
const client = new PheliaClient(process.env.SLACK_TOKEN);
client.postMessage(UsersSelectMenuExample, "@max");

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
