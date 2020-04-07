import React from "react";
import { Section, Text, Button, reconcile, Actions, Image } from "../core";

describe("Text", () => {
  describe("Default Text", () => {
    const component = () => <Text>hello world</Text>;

    it("renders plain_text Text without emoji", () => {
      const blocks = reconcile(React.createElement(component));
      expect(blocks).toMatchSnapshot();
    });
  });

  describe("Text with emoji", () => {
    const component = () => <Text emoji>hello world</Text>;

    it("renders plain_text Text with emoji", () => {
      const blocks = reconcile(React.createElement(component));
      expect(blocks).toMatchSnapshot();
    });
  });

  describe("Text with mrkdwn property", () => {
    const component = () => <Text type="mrkdwn">hello world</Text>;

    it("renders mrkdwn Text without verbatim", () => {
      const blocks = reconcile(React.createElement(component));
      expect(blocks).toMatchSnapshot();
    });
  });

  describe("Text with mrkdwn and verbatim property", () => {
    const component = () => (
      <Text type="mrkdwn" verbatim>
        hello world
      </Text>
    );

    it("renders mrkdwn Text with verbatim", () => {
      const blocks = reconcile(React.createElement(component));
      expect(blocks).toMatchSnapshot();
    });
  });

  describe("Text with two children", () => {
    const component = () => <Text>hello {"world"}</Text>;

    it("renders Text with children concatenated", () => {
      const blocks = reconcile(React.createElement(component));
      expect(blocks).toMatchSnapshot();
    });
  });
});

describe("Section", () => {
  describe("Section with one Text component", () => {
    const component = () => (
      <Section>
        <Text>First text</Text>
      </Section>
    );

    it("renders Section with child Text component in the fields property", () => {
      const blocks = reconcile(React.createElement(component));
      expect(blocks).toMatchSnapshot();
    });
  });

  describe("Section with two Text components", () => {
    const component = () => (
      <Section>
        <Text>First text</Text>
        <Text>First text</Text>
      </Section>
    );

    it("renders Section with child Text components in the fields property", () => {
      const blocks = reconcile(React.createElement(component));
      expect(blocks).toMatchSnapshot();
    });
  });

  describe("Section with a multi-child Text component", () => {
    const component = () => (
      <Section>
        <Text>{"First"} text</Text>
      </Section>
    );

    it("renders Section with a multi-child Text component", () => {
      const blocks = reconcile(React.createElement(component));
      expect(blocks).toMatchSnapshot();
    });
  });

  describe("Section with a text property and no children", () => {
    const component = () => <Section text={<Text>Hello world</Text>} />;

    it("renders Section with a text property and empty fields", () => {
      const blocks = reconcile(React.createElement(component));
      expect(blocks).toMatchSnapshot();
    });
  });

  describe("Section with Image accessory", () => {
    const component = () => (
      <Section
        accessory={
          <Image
            image_url="https://google.com/image.png"
            alt_text={"an image"}
          />
        }
        text={<Text>Hello world</Text>}
      />
    );

    it("renders Section with a Image accessory", () => {
      const blocks = reconcile(React.createElement(component));
      console.log(JSON.stringify(blocks));
      expect(blocks).toMatchSnapshot();
    });
  });

  describe("Section with Button accessory", () => {
    const onClick = jest.fn();
    const component = () => (
      <Section
        accessory={
          <Button value="click" onClick={onClick}>
            Click me
          </Button>
        }
        text={<Text>Hello world</Text>}
      />
    );

    it("renders Section with a Button accessory", () => {
      const blocks = reconcile(React.createElement(component));
      expect(blocks).toMatchSnapshot();
    });

    describe("with reconcile action and onClick Button property", () => {
      it("calls the onClick function", () => {
        const user = {
          username: "johnsmith",
          name: "john smith",
          id: "u123",
          team_id: "t123",
        };

        reconcile(React.createElement(component), {
          value: "click",
          user,
        });

        expect(onClick).toBeCalledWith(user);
        expect(onClick).toBeCalledTimes(1);
      });
    });
  });

  describe("Section with Button accessory, Text, and Fields", () => {
    const component = () => (
      <Section
        accessory={<Button>Click me</Button>}
        text={<Text>The text</Text>}
      >
        <Text>Field #1</Text>
        <Text>Field #2</Text>
      </Section>
    );

    it("renders Section with a Button accessory, Text, and fields", () => {
      const blocks = reconcile(React.createElement(component));
      expect(blocks).toMatchSnapshot();
    });
  });
});

describe("Button", () => {
  describe("Default button", () => {
    const component = () => <Button>Click me</Button>;

    it("renders Button with default properties", () => {
      const blocks = reconcile(React.createElement(component));
      expect(blocks).toMatchSnapshot();
    });
  });

  describe("Button with danger style", () => {
    const component = () => <Button style={"danger"}>Click me</Button>;

    it("renders Button with danger style", () => {
      const blocks = reconcile(React.createElement(component));
      expect(blocks).toMatchSnapshot();
    });
  });

  describe("Button with url", () => {
    const component = () => (
      <Button url={"https://google.com"}>Click me</Button>
    );

    it("renders Button with url", () => {
      const blocks = reconcile(React.createElement(component));
      expect(blocks).toMatchSnapshot();
    });
  });

  describe("Button with emoji property", () => {
    const component = () => <Button emoji>Click me</Button>;

    it("renders Button with emoji text property", () => {
      const blocks = reconcile(React.createElement(component));
      expect(blocks).toMatchSnapshot();
    });
  });

  describe("Button with value property", () => {
    const onClick = jest.fn();

    const component = () => (
      <Button value="click" onClick={onClick}>
        Click me
      </Button>
    );

    it("renders Button with value property", () => {
      const blocks = reconcile(React.createElement(component));
      expect(blocks).toMatchSnapshot();
    });

    describe("with reconcile action and onClick property", () => {
      it("calls the onClick function", () => {
        const user = {
          username: "johnsmith",
          name: "john smith",
          id: "u123",
          team_id: "t123",
        };

        reconcile(React.createElement(component), {
          value: "click",
          user,
        });

        expect(onClick).toBeCalledWith(user);
        expect(onClick).toBeCalledTimes(1);
      });
    });
  });
});

describe("Actions", () => {
  describe("Actions with one Button", () => {
    const component = () => (
      <Actions>
        <Button>Click me</Button>
      </Actions>
    );

    it("renders Actions with one Button", () => {
      const blocks = reconcile(React.createElement(component));
      expect(blocks).toMatchSnapshot();
    });
  });

  describe("Actions with two Buttons", () => {
    const component = () => (
      <Actions>
        <Button>Click me</Button>
        <Button>No, click me</Button>
      </Actions>
    );

    it("renders Actions with two Buttons", () => {
      const blocks = reconcile(React.createElement(component));
      expect(blocks).toMatchSnapshot();
    });
  });
});

describe("Image", () => {
  describe("Default image", () => {
    const component = () => (
      <Image image_url="https://google.com/image.png" alt_text="an image" />
    );

    it("renders Image with image_url and alt_text properties", () => {
      const blocks = reconcile(React.createElement(component));
      expect(blocks).toMatchSnapshot();
    });
  });
});
