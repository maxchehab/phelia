import React from "react";

import { Section, DatePicker, Message, PheliaMessageProps } from "../../core";

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export function BirthdayPicker({ useState }: PheliaMessageProps) {
  const [birth, setBirth] = useState("birth");
  const [user, setUser] = useState("user");

  const today = new Date().toISOString().split("T")[0];
  const birthdayIsToday = birth === today;

  return (
    <Message text="Gimme yo birthday">
      <Section
        text={
          birth
            ? birthdayIsToday
              ? `Happy birthday ${user}!`
              : `Your birthday is on ${birth}.`
            : "Select your birthday."
        }
        accessory={
          <DatePicker
            initialDate={birth}
            onSelect={async ({ user, date }) => {
              await delay(2000);
              setBirth(date);
              setUser(user.username);
            }}
            action="date"
          />
        }
      />
    </Message>
  );
}
