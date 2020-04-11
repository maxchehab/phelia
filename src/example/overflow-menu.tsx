import React from "react";
import {
  Message,
  OverflowMenu,
  Option,
  Section,
  Text,
  PheliaMessageProps
} from "../core";

export default function OverflowMenuExample({ useState }: PheliaMessageProps) {
  const [selected, setSelected] = useState("selected");

  const overflow = (
    <OverflowMenu
      action="overflow"
      onSelect={event => setSelected(event.selected)}
    >
      <Option value="dogs">Dogs</Option>
      <Option value="cats">Cats</Option>
      <Option url="https://pixabay.com/images/search/dog/" value="a-link">
        Dog images
      </Option>
    </OverflowMenu>
  );

  return (
    <Message>
      <Section accessory={overflow}>
        {selected ? (
          <Text type="mrkdwn">You selected *{selected}*</Text>
        ) : (
          <Text emoji>Click the menu option :point_right:</Text>
        )}
      </Section>
    </Message>
  );
}
