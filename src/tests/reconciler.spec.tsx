import React from "react";
import {
  Actions,
  Button,
  Confirm,
  Context,
  DatePicker,
  Divider,
  Image,
  ImageBlock,
  InteractionEvent,
  Option,
  render,
  Section,
  Text,
  Input,
  TextField,
  Checkboxes,
  OverflowMenu,
  RadioButtons
} from "../core";

describe("Text", () => {
  describe("Default Text", () => {
    const component = () => <Text>hello world</Text>;

    it("renders plain_text Text without emoji", async () => {
      const blocks = await render(React.createElement(component));
      expect(blocks).toMatchSnapshot();
    });
  });

  describe("Text with emoji", () => {
    const component = () => <Text emoji>hello world</Text>;

    it("renders plain_text Text with emoji", async () => {
      const blocks = await render(React.createElement(component));
      expect(blocks).toMatchSnapshot();
    });
  });

  describe("Text with mrkdwn property", () => {
    const component = () => <Text type="mrkdwn">hello world</Text>;

    it("renders mrkdwn Text without verbatim", async () => {
      const blocks = await render(React.createElement(component));
      expect(blocks).toMatchSnapshot();
    });
  });

  describe("Text with mrkdwn and verbatim property", () => {
    const component = () => (
      <Text type="mrkdwn" verbatim>
        hello world
      </Text>
    );

    it("renders mrkdwn Text with verbatim", async () => {
      const blocks = await render(React.createElement(component));
      expect(blocks).toMatchSnapshot();
    });
  });

  describe("Text with two children", () => {
    const component = () => <Text>hello {"world"}</Text>;

    it("renders Text with children concatenated", async () => {
      const blocks = await render(React.createElement(component));
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

    it("renders Section with child Text component in the fields property", async () => {
      const blocks = await render(React.createElement(component));
      expect(blocks).toMatchSnapshot();
    });
  });

  describe("Section with string Text property", () => {
    const component = () => <Section text="some text" />;

    it("renders Section with child Text component in the fields property", async () => {
      const blocks = await render(React.createElement(component));
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

    it("renders Section with child Text components in the fields property", async () => {
      const blocks = await render(React.createElement(component));
      expect(blocks).toMatchSnapshot();
    });
  });

  describe("Section with a multi-child Text component", () => {
    const component = () => (
      <Section>
        <Text>{"First"} text</Text>
      </Section>
    );

    it("renders Section with a multi-child Text component", async () => {
      const blocks = await render(React.createElement(component));
      expect(blocks).toMatchSnapshot();
    });
  });

  describe("Section with a text property and no children", () => {
    const component = () => <Section text={<Text>Hello world</Text>} />;

    it("renders Section with a text property and empty fields", async () => {
      const blocks = await render(React.createElement(component));
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

    it("renders Section with a Image accessory", async () => {
      const blocks = await render(React.createElement(component));
      expect(blocks).toMatchSnapshot();
    });
  });

  describe("Section with Button accessory", () => {
    const onClick = jest.fn();
    const component = () => (
      <Section
        accessory={
          <Button action="click" onClick={onClick}>
            Click me
          </Button>
        }
        text={<Text>Hello world</Text>}
      />
    );

    it("renders Section with a Button accessory", async () => {
      const blocks = await render(React.createElement(component));
      expect(blocks).toMatchSnapshot();
    });

    describe("with await render action and onClick Button property", () => {
      it("calls the onClick function", async () => {
        const user = {
          username: "johnsmith",
          name: "john smith",
          id: "u123",
          team_id: "t123"
        };

        await render(React.createElement(component), {
          value: "click",
          event: { user }
        });

        expect(onClick).toBeCalledWith({ user });
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

    it("renders Section with a Button accessory, Text, and fields", async () => {
      const blocks = await render(React.createElement(component));
      expect(blocks).toMatchSnapshot();
    });
  });
});

describe("Button", () => {
  describe("Default button", () => {
    const component = () => <Button>Click me</Button>;

    it("renders Button with default properties", async () => {
      const blocks = await render(React.createElement(component));
      expect(blocks).toMatchSnapshot();
    });
  });

  describe("Button with danger style", () => {
    const component = () => <Button style={"danger"}>Click me</Button>;

    it("renders Button with danger style", async () => {
      const blocks = await render(React.createElement(component));
      expect(blocks).toMatchSnapshot();
    });
  });

  describe("Button with url", () => {
    const component = () => (
      <Button url={"https://google.com"}>Click me</Button>
    );

    it("renders Button with url", async () => {
      const blocks = await render(React.createElement(component));
      expect(blocks).toMatchSnapshot();
    });
  });

  describe("Button with emoji property", () => {
    const component = () => <Button emoji>Click me</Button>;

    it("renders Button with emoji text property", async () => {
      const blocks = await render(React.createElement(component));
      expect(blocks).toMatchSnapshot();
    });
  });

  describe("Button with Confirm component", () => {
    const component = () => (
      <Button
        emoji
        confirm={
          <Confirm
            title="Confirm me?"
            confirm="Yes, I confirm!"
            deny="No, go away!"
          >
            Do you confirm me?
          </Confirm>
        }
      >
        Click me
      </Button>
    );

    it("renders Button with emoji text property", async () => {
      const blocks = await render(React.createElement(component));
      expect(blocks).toMatchSnapshot();
    });
  });

  describe("Button with action property", () => {
    const onClick = jest.fn();

    const component = () => (
      <Button action="click" onClick={onClick}>
        Click me
      </Button>
    );

    it("renders Button with value property", async () => {
      const blocks = await render(React.createElement(component));
      expect(blocks).toMatchSnapshot();
    });

    describe("with render action and onClick property", () => {
      it("calls the onClick function", async () => {
        const user = {
          username: "johnsmith",
          name: "john smith",
          id: "u123",
          team_id: "t123"
        };

        await render(React.createElement(component), {
          value: "click",
          event: { user }
        });

        expect(onClick).toBeCalledWith({ user });
        expect(onClick).toBeCalledTimes(1);
      });
    });
  });

  describe("Button with async onClick property", () => {
    const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

    const onClick = jest.fn();

    const component = () => (
      <Button
        action="click"
        onClick={async () => {
          await delay(100);
          onClick();
        }}
      >
        Click me
      </Button>
    );

    it("calls the onClick function", async () => {
      const user = {
        username: "johnsmith",
        name: "john smith",
        id: "u123",
        team_id: "t123"
      };

      await render(React.createElement(component), {
        value: "click",
        event: { user }
      });

      expect(onClick).toBeCalledTimes(1);
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

    it("renders Actions with one Button", async () => {
      const blocks = await render(React.createElement(component));
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

    it("renders Actions with two Buttons", async () => {
      const blocks = await render(React.createElement(component));
      expect(blocks).toMatchSnapshot();
    });
  });
});

describe("Image", () => {
  describe("Default Image", () => {
    const component = () => (
      <Image image_url="https://google.com/image.png" alt_text="an image" />
    );

    it("renders Image with image_url and alt_text properties", async () => {
      const blocks = await render(React.createElement(component));
      expect(blocks).toMatchSnapshot();
    });
  });
});

describe("Image Block", () => {
  describe("Default Image Block", () => {
    const component = () => (
      <ImageBlock
        image_url="https://google.com/image.png"
        alt_text="an image"
      />
    );

    it("renders Image Block with image_url and alt_text properties", async () => {
      const blocks = await render(React.createElement(component));
      expect(blocks).toMatchSnapshot();
    });
  });

  describe("Image Block with string title", () => {
    const component = () => (
      <ImageBlock
        image_url="https://google.com/image.png"
        alt_text="an image"
        title="a string"
      />
    );

    it("renders Image Block with title", async () => {
      const blocks = await render(React.createElement(component));
      expect(blocks).toMatchSnapshot();
    });
  });

  describe("Image Block with emoji property", () => {
    const component = () => (
      <ImageBlock
        image_url="https://google.com/image.png"
        alt_text="an image"
        title="a string"
        emoji
      />
    );

    it("renders Image Block with title", async () => {
      const blocks = await render(React.createElement(component));
      expect(blocks).toMatchSnapshot();
    });
  });
});

describe("Divider", () => {
  describe("Default Divider", () => {
    const component = () => <Divider />;

    it("renders Divider", async () => {
      const blocks = await render(React.createElement(component));
      expect(blocks).toMatchSnapshot();
    });
  });
});

describe("Context", () => {
  describe("Context with one element", () => {
    const component = () => (
      <Context>
        <ImageBlock
          image_url="https://google.com/image.png"
          alt_text="an image"
        />
      </Context>
    );

    it("renders Context with one element", async () => {
      const blocks = await render(React.createElement(component));
      expect(blocks).toMatchSnapshot();
    });
  });

  describe("Context with Image and Text component", () => {
    const component = () => (
      <Context>
        <ImageBlock
          image_url="https://google.com/image.png"
          alt_text="an image"
        />

        <Text type="mrkdwn">*Hello world*</Text>
      </Context>
    );

    it("renders Context with one element", async () => {
      const blocks = await render(React.createElement(component));
      expect(blocks).toMatchSnapshot();
    });
  });
});

describe("Confirm", () => {
  describe("Confirm with string properties", () => {
    const component = () => (
      <Confirm
        title="Confirm me?"
        confirm="Yes, I confirm!"
        deny="No, go away!"
      >
        Do you confirm me?
      </Confirm>
    );

    it("renders with string properties", async () => {
      const blocks = await render(React.createElement(component));
      expect(blocks).toMatchSnapshot();
    });
  });

  describe("Confirm with Text Component properties", () => {
    const component = () => (
      <Confirm
        title={<Text emoji>Confirm me?</Text>}
        confirm={<Text emoji>Yes, I confirm!</Text>}
        deny={<Text emoji>No go away</Text>}
      >
        <Text type="mrkdwn">*No go away*</Text>
      </Confirm>
    );

    it("renders Confirm component with Text Component properties", async () => {
      const blocks = await render(React.createElement(component));
      expect(blocks).toMatchSnapshot();
    });
  });
});

describe("Option", () => {
  describe("Option with string child", () => {
    const component = () => <Option value="an option">I am an option</Option>;

    it("renders Option with string child", async () => {
      const blocks = await render(React.createElement(component));
      expect(blocks).toMatchSnapshot();
    });
  });

  describe("Option with Text child", () => {
    const component = () => (
      <Option value="an option">
        <Text emoji>Another option</Text>
      </Option>
    );

    it("renders Option with Text child", async () => {
      const blocks = await render(React.createElement(component));
      expect(blocks).toMatchSnapshot();
    });
  });

  describe("Option with url property", () => {
    const component = () => (
      <Option url="https://google.com" value="an option">
        <Text emoji>Another option</Text>
      </Option>
    );

    it("renders Option with url property", async () => {
      const blocks = await render(React.createElement(component));
      expect(blocks).toMatchSnapshot();
    });
  });

  describe("Option with description string property", () => {
    const component = () => (
      <Option
        url="https://google.com"
        description={"hello i am a description"}
        value="an option"
      >
        <Text emoji>Another option</Text>
      </Option>
    );

    it("renders Option with description string property", async () => {
      const blocks = await render(React.createElement(component));
      expect(blocks).toMatchSnapshot();
    });
  });

  describe("Option with description Text property", () => {
    const component = () => (
      <Option
        url="https://google.com"
        description={<Text emoji>hello i am a description</Text>}
        value="an option"
      >
        <Text emoji>Another option</Text>
      </Option>
    );

    it("renders Option with description Text property", async () => {
      const blocks = await render(React.createElement(component));
      expect(blocks).toMatchSnapshot();
    });
  });
});

describe("DatePicker", () => {
  describe("Default DatePicker", () => {
    const onSubmit = jest.fn();
    const component = () => <DatePicker onSelect={onSubmit} action="date" />;

    it("renders default DatePicker", async () => {
      const blocks = await render(React.createElement(component));
      expect(blocks).toMatchSnapshot();
    });

    describe("with render action", () => {
      it("calls the onSubmit function", async () => {
        const user = {
          username: "johnsmith",
          name: "john smith",
          id: "u123",
          team_id: "t123"
        };

        await render(React.createElement(component), {
          value: "date",
          event: { user, date: "2020-04-16" } as InteractionEvent
        });

        expect(onSubmit).toBeCalledWith({ user, date: "2020-04-16" });
        expect(onSubmit).toBeCalledTimes(1);
      });
    });
  });

  describe("DatePicker with initial date property", () => {
    const component = () => (
      <DatePicker
        onSelect={() => null}
        action="date"
        initialDate="2020-11-11"
      />
    );

    it("renders DatePicker with initial date property", async () => {
      const blocks = await render(React.createElement(component));
      expect(blocks).toMatchSnapshot();
    });
  });

  describe("DatePicker with string placeholder property", () => {
    const component = () => (
      <DatePicker
        onSelect={() => null}
        action="date"
        initialDate="2020-11-11"
        placeholder="just a placeholder"
      />
    );

    it("renders DatePicker with string placeholder property", async () => {
      const blocks = await render(React.createElement(component));
      expect(blocks).toMatchSnapshot();
    });
  });

  describe("DatePicker with Text component placeholder property", () => {
    const component = () => (
      <DatePicker
        onSelect={() => null}
        action="date"
        initialDate="2020-11-11"
        placeholder={<Text emoji>just a placeholder</Text>}
      />
    );

    it("renders DatePicker with Text component placeholder property", async () => {
      const blocks = await render(React.createElement(component));
      expect(blocks).toMatchSnapshot();
    });
  });

  describe("DatePicker with confirm property", () => {
    const component = () => (
      <DatePicker
        onSelect={() => null}
        action="date"
        initialDate="2020-11-11"
        placeholder={<Text emoji>just a placeholder</Text>}
        confirm={
          <Confirm
            title="Confirm me?"
            confirm="Yes, I confirm!"
            deny="No, go away!"
          >
            Do you confirm me?
          </Confirm>
        }
      />
    );

    it("renders DatePicker with confirm property", async () => {
      const blocks = await render(React.createElement(component));
      expect(blocks).toMatchSnapshot();
    });
  });
});

describe("Input", () => {
  describe("Input with DatePicker element", () => {
    const component = () => (
      <Input label="Expiration date">
        <DatePicker action="date" />
      </Input>
    );

    it("renders Input with DatePicker element", async () => {
      const blocks = await render(React.createElement(component));
      expect(blocks).toMatchSnapshot();
    });
  });

  describe("Input with label string", () => {
    const component = () => (
      <Input label="Expiration date">
        <DatePicker action="date" />
      </Input>
    );

    it("renders Input with label string", async () => {
      const blocks = await render(React.createElement(component));
      expect(blocks).toMatchSnapshot();
    });
  });

  describe("Input with label Text component", () => {
    const component = () => (
      <Input label={<Text emoji>Label</Text>}>
        <DatePicker action="date" />
      </Input>
    );

    it("renders Input with label Text component", async () => {
      const blocks = await render(React.createElement(component));
      expect(blocks).toMatchSnapshot();
    });
  });

  describe("Input with hint Text component", () => {
    const component = () => (
      <Input label={"label"} hint={<Text emoji>hint</Text>}>
        <DatePicker action="date" />
      </Input>
    );

    it("renders Input with hint Text component", async () => {
      const blocks = await render(React.createElement(component));
      expect(blocks).toMatchSnapshot();
    });
  });

  describe("Input with hint Text component", () => {
    const component = () => (
      <Input label="label" hint={<Text emoji>hint</Text>}>
        <DatePicker action="date" />
      </Input>
    );

    it("renders Input with hint Text component", async () => {
      const blocks = await render(React.createElement(component));
      expect(blocks).toMatchSnapshot();
    });
  });

  describe("Input with optional property", () => {
    const component = () => (
      <Input label="label" hint={<Text emoji>hint</Text>} optional>
        <DatePicker action="date" />
      </Input>
    );

    it("renders Input with optional property", async () => {
      const blocks = await render(React.createElement(component));
      expect(blocks).toMatchSnapshot();
    });
  });
});

describe("TextField", () => {
  describe("TextField with action", () => {
    const component = () => <TextField action="text" />;

    it("renders TextField with action", async () => {
      const blocks = await render(React.createElement(component));
      expect(blocks).toMatchSnapshot();
    });
  });

  describe("TextField with initial value", () => {
    const component = () => (
      <TextField action="text" initialValue="hey there" />
    );

    it("renders TextField with initial value", async () => {
      const blocks = await render(React.createElement(component));
      expect(blocks).toMatchSnapshot();
    });
  });

  describe("TextField with maxLength property", () => {
    const component = () => (
      <TextField action="text" initialValue="hey there" maxLength={10} />
    );

    it("renders TextField with maxLength property", async () => {
      const blocks = await render(React.createElement(component));
      expect(blocks).toMatchSnapshot();
    });
  });

  describe("TextField with minLength property", () => {
    const component = () => (
      <TextField action="text" initialValue="hey there" minLength={7} />
    );

    it("renders TextField with minLength property", async () => {
      const blocks = await render(React.createElement(component));
      expect(blocks).toMatchSnapshot();
    });
  });

  describe("TextField with multiline property set", () => {
    const component = () => (
      <TextField
        action="text"
        initialValue="hey there"
        minLength={7}
        multiline
      />
    );

    it("renders TextField with multiline property set", async () => {
      const blocks = await render(React.createElement(component));
      expect(blocks).toMatchSnapshot();
    });
  });

  describe("TextField with string placeholder", () => {
    const component = () => (
      <TextField
        action="text"
        initialValue="hey there"
        minLength={7}
        multiline
        placeholder="i am a placeholder"
      />
    );

    it("renders TextField with string placeholder", async () => {
      const blocks = await render(React.createElement(component));
      expect(blocks).toMatchSnapshot();
    });
  });

  describe("TextField with Text component placeholder", () => {
    const component = () => (
      <TextField
        action="text"
        initialValue="hey there"
        minLength={7}
        multiline
        placeholder={<Text emoji>I'm a placeholder</Text>}
      />
    );

    it("renders TextField with Text component placeholder", async () => {
      const blocks = await render(React.createElement(component));
      expect(blocks).toMatchSnapshot();
    });
  });
});

describe("Checkboxes", () => {
  describe("Checkboxes with one option", () => {
    const component = () => (
      <Checkboxes action="options">
        <Option value="1">hello</Option>
      </Checkboxes>
    );

    it("renders Checkboxes with one option", async () => {
      const blocks = await render(React.createElement(component));
      expect(blocks).toMatchSnapshot();
    });
  });

  describe("Checkboxes with two options", () => {
    const component = () => (
      <Checkboxes action="options">
        <Option value="1">hey</Option>
        <Option value="2">hello</Option>
      </Checkboxes>
    );

    it("renders Checkboxes with two options", async () => {
      const blocks = await render(React.createElement(component));
      expect(blocks).toMatchSnapshot();
    });
  });

  describe("Checkboxes with one selected option", () => {
    const component = () => (
      <Checkboxes action="options">
        <Option value="1" selected>
          hey
        </Option>
        <Option value="2">hello</Option>
      </Checkboxes>
    );

    it("renders Checkboxes with one selected option", async () => {
      const blocks = await render(React.createElement(component));
      expect(blocks).toMatchSnapshot();
    });
  });

  describe("Checkboxes with two selected options", () => {
    const component = () => (
      <Checkboxes action="options">
        <Option value="1" selected>
          hey
        </Option>
        <Option value="2" selected>
          hello
        </Option>
      </Checkboxes>
    );

    it("renders Checkboxes with two selected options", async () => {
      const blocks = await render(React.createElement(component));
      expect(blocks).toMatchSnapshot();
    });
  });

  describe("Checkboxes with Confirm component", () => {
    const component = () => (
      <Checkboxes
        action="options"
        confirm={
          <Confirm
            title="Confirm me?"
            confirm="Yes, I confirm!"
            deny="No, go away!"
          >
            Do you confirm me?
          </Confirm>
        }
      >
        <Option value="1" selected>
          hey
        </Option>
        <Option value="2" selected>
          hello
        </Option>
      </Checkboxes>
    );

    it("renders Checkboxes with Confirm component", async () => {
      const blocks = await render(React.createElement(component));
      expect(blocks).toMatchSnapshot();
    });
  });

  describe("Checkboxes with Url property in Options component", () => {
    const component = () => (
      <Checkboxes action="options">
        <Option value="1" url="https://google.com">
          hey
        </Option>
      </Checkboxes>
    );

    it("renders Option component without Url property", async () => {
      const blocks = await render(React.createElement(component));
      expect(blocks).toMatchSnapshot();
    });
  });
});

describe("Overflow Menu", () => {
  describe("Overflow Menu with a single option", () => {
    const component = () => (
      <OverflowMenu action="overflow">
        <Option value="dogs">Dogs</Option>
      </OverflowMenu>
    );

    it("renders an Overflow menu with a single option", async () => {
      const blocks = await render(React.createElement(component));
      expect(blocks).toMatchSnapshot();
    });
  });

  describe("Overflow Menu with two options", () => {
    const component = () => (
      <OverflowMenu action="overflow">
        <Option value="dogs">Dogs</Option>
        <Option value="cats">Cats</Option>
      </OverflowMenu>
    );

    it("renders an Overflow menu with a two options", async () => {
      const blocks = await render(React.createElement(component));
      expect(blocks).toMatchSnapshot();
    });
  });

  describe("Overflow Menu with a Url options", () => {
    const component = () => (
      <OverflowMenu action="overflow">
        <Option url="google.com" value="dogs">
          Dogs
        </Option>
      </OverflowMenu>
    );

    it("renders an Overflow menu with a Url option", async () => {
      const blocks = await render(React.createElement(component));
      expect(blocks).toMatchSnapshot();
    });
  });
});

describe("Radio Buttons", () => {
  describe("Radio Buttons with a single option", () => {
    const component = () => (
      <RadioButtons action="overflow">
        <Option value="dogs">Dogs</Option>
      </RadioButtons>
    );

    it("renders an Radio Buttons with a single option", async () => {
      const blocks = await render(React.createElement(component));
      expect(blocks).toMatchSnapshot();
    });
  });

  describe("Radio Buttons with two options", () => {
    const component = () => (
      <RadioButtons action="overflow">
        <Option value="dogs">Dogs</Option>
        <Option value="cats">Cats</Option>
      </RadioButtons>
    );

    it("renders an Radio Buttons with a two options", async () => {
      const blocks = await render(React.createElement(component));
      expect(blocks).toMatchSnapshot();
    });
  });

  describe("Radio Buttons with selected option", () => {
    const component = () => (
      <RadioButtons action="overflow">
        <Option value="dogs">Dogs</Option>
        <Option value="cats" selected>
          Cats
        </Option>
      </RadioButtons>
    );

    it("renders an Radio Buttons with a selected option", async () => {
      const blocks = await render(React.createElement(component));
      expect(blocks).toMatchSnapshot();
    });
  });

  describe("Radio Buttons with a Url options", () => {
    const component = () => (
      <RadioButtons action="overflow">
        <Option url="google.com" value="dogs">
          Dogs
        </Option>
      </RadioButtons>
    );

    it("renders an Radio Buttons without a Url property", async () => {
      const blocks = await render(React.createElement(component));
      expect(blocks).toMatchSnapshot();
    });
  });
});
