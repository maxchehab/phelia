import React from "react";

import {
  Actions,
  Button,
  Image,
  PheliaMessageProps,
  Section,
  Text,
} from "../core";

const imageUrls = [
  "https://cdn.pixabay.com/photo/2015/06/08/15/02/pug-801826__480.jpg",
  "https://cdn.pixabay.com/photo/2015/03/26/09/54/pug-690566__480.jpg",
  "https://cdn.pixabay.com/photo/2018/03/31/06/31/dog-3277416__480.jpg",
  "https://cdn.pixabay.com/photo/2016/02/26/16/32/dog-1224267__480.jpg",
];

function randomImage(): string {
  const index = Math.floor(Math.random() * imageUrls.length);
  return imageUrls[index];
}

export default function RandomImage({ useState }: PheliaMessageProps) {
  const [imageUrl, setImageUrl] = useState("imageUrl", randomImage());

  return (
    <>
      <Section
        accessory={<Image alt_text="an adorable puppy" image_url={imageUrl} />}
        text={<Text type="mrkdwn">Click the button for a new :dog:</Text>}
      />
      <Actions>
        <Button
          style="primary"
          value="randomImage"
          onClick={() => setImageUrl(randomImage())}
        >
          New doggy
        </Button>
      </Actions>
    </>
  );
}
