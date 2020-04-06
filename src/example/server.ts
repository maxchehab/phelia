import dotenv from "dotenv";
import express from "express";

import { PheliaClient, interactiveMessageHandler } from "../core";
import Counter from "./counter";
import Greeter from "./greeter";

dotenv.config();

const app = express();
const port = 3000;

app.post(
  "/api/webhook",
  interactiveMessageHandler(process.env.SLACK_SIGNING_SECRET, [
    Counter,
    Greeter,
  ])
);

// This is how you post a message....
const client = new PheliaClient(process.env.SLACK_TOKEN);
client.postMessage(Greeter, null, "@max", "hello there!");

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
