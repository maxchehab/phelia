import React from "react";

import { PheliaMessageProps, Section, DatePicker } from "../core";

export default function BirthdayPicker({ useState }: PheliaMessageProps) {
  const [birth, setBirth] = useState("birth");
  const [user, setUser] = useState("user");

  const today = new Date().toISOString().split("T")[0];
  const birthdayIsToday = birth === today;

  return (
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
          onSubmit={(user, { date }) => {
            setBirth(date);
            setUser(user.username);
          }}
          action="date"
        />
      }
    />
  );
}
