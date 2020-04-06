import { PheliaStorage, PheliaClient } from "./phelia-client";

export function setStorage(storage: PheliaStorage) {
  PheliaClient.SetStorage(storage);
}
