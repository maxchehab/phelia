import dotenv from "dotenv";
import express from "express";

import { ModalExample, MyModal } from "./modal-example";
import { PheliaClient, interactiveMessageHandler } from "../core";
import BirthdayPicker from "./birthday-picker";
import Counter from "./counter";
import Greeter from "./greeter";
import RandomImage from "./random-image";

dotenv.config();

const app = express();
const port = 3000;

app.post(
  "/api/webhook",
  interactiveMessageHandler(process.env.SLACK_SIGNING_SECRET, [
    BirthdayPicker,
    Counter,
    Greeter,
    ModalExample,
    MyModal,
    RandomImage
  ])
);

// This is how you post a message....
const client = new PheliaClient(process.env.SLACK_TOKEN);
client.postMessage(ModalExample, "@max");

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
