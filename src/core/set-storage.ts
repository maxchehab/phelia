import { Phelia } from "./phelia";
import { PheliaStorage } from "./interfaces";

export function setStorage(storage: PheliaStorage) {
  Phelia.SetStorage(storage);
}
