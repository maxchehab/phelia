import dotenv from "dotenv";
import express from "express";

import { PheliaClient, interactiveMessageHandler } from "../core";
import Counter from "./counter";

dotenv.config();

const app = express();
const port = 3000;

app.post(
  "/api/webhook",
  interactiveMessageHandler(process.env.SLACK_SIGNING_SECRET, [Counter])
);

// This is how you post a message....
const client = new PheliaClient(process.env.SLACK_TOKEN);
client.postMessage(Counter, { name: "max" }, "@max", "Message title");

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
