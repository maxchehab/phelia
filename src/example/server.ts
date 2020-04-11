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
import { SelectMenuExample, SelectMenuModal } from "./select-menu";

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
  SelectMenuExample,
  SelectMenuModal
];

app.post(
  "/api/webhook",
  interactiveMessageHandler(process.env.SLACK_SIGNING_SECRET, components)
);

// This is how you post a message....
const client = new PheliaClient(process.env.SLACK_TOKEN);
client.postMessage(SelectMenuExample, "@max");

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
