import React from "react";

import {
  Actions,
  Button,
  Confirm,
  Divider,
  ImageBlock,
  PheliaMessageProps,
  Text,
  Message
} from "../../core";

const imageUrls = [
  "https://cdn.pixabay.com/photo/2015/06/08/15/02/pug-801826__480.jpg",
  "https://cdn.pixabay.com/photo/2015/03/26/09/54/pug-690566__480.jpg",
  "https://cdn.pixabay.com/photo/2018/03/31/06/31/dog-3277416__480.jpg",
  "https://cdn.pixabay.com/photo/2016/02/26/16/32/dog-1224267__480.jpg"
];

function randomImage(): string {
  const index = Math.floor(Math.random() * imageUrls.length);
  return imageUrls[index];
}

export function RandomImage({ useState }: PheliaMessageProps) {
  const [imageUrl, setImageUrl] = useState("imageUrl", randomImage());

  return (
    <Message text="Choose a dog">
      <ImageBlock
        emoji
        title={"an adorable :dog:"}
        alt={"a very adorable doggy dog"}
        imageUrl={imageUrl}
      />
      <Divider />
      <Actions>
        <Button
          style="primary"
          action="randomImage"
          onClick={() => setImageUrl(randomImage())}
          confirm={
            <Confirm
              title={"Are you sure?"}
              confirm={"Yes, gimmey that doggy!"}
              deny={"No, I hate doggies"}
            >
              <Text type="mrkdwn">
                Are you certain you want to see the _cutest_ doggy ever?
              </Text>
            </Confirm>
          }
        >
          New doggy
        </Button>
      </Actions>
    </Message>
  );
}
