import React from "react";

import {
  Actions,
  Button,
  Text,
  Section,
  PheliaMessageProps,
  Message,
  Modal
} from "../core";

export function MyModal({ useState }: PheliaMessageProps) {
  const [clicked, setClicked] = useState("clicked", false);

  return (
    <Modal title="A fancy pants modal" submit="accept me">
      <Section>
        {clicked ? (
          <Text emoji>Naiceeeeeee :guy-chef-kiss:</Text>
        ) : (
          <Text>Click the button!</Text>
        )}
      </Section>
      <Actions>
        <Button action="next" onClick={() => setClicked(true)}>
          Click me
        </Button>
      </Actions>
    </Modal>
  );
}

type State = "submitted" | "canceled" | "init";

export function ModalExample({ useModal, useState }: PheliaMessageProps) {
  const [state, setState] = useState<State>("state", "init");

  const openModal = useModal(
    "modal",
    MyModal,
    () => setState("submitted"),
    () => setState("canceled")
  );

  return (
    <Message text="A modal example">
      {state === "canceled" && (
        <Section>
          <Text emoji>:no_good: aceeeeeept meeeeee</Text>
        </Section>
      )}

      {state === "submitted" && (
        <Section>
          <Text emoji>Naiceeeeeee :guy-chef-kiss:</Text>
        </Section>
      )}

      {state !== "init" && (
        <Actions>
          <Button
            style="danger"
            action="reset"
            onClick={() => setState("init")}
          >
            reset
          </Button>
        </Actions>
      )}

      {state === "init" && (
        <Actions>
          <Button
            style="primary"
            action="openModal"
            onClick={() => openModal()}
          >
            Open zeee Modal
          </Button>
        </Actions>
      )}
    </Message>
  );
}
