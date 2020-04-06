import React from "react";
import { SlackUser } from "./phelia-client";

export const Section = ({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}) => <slackSection>{children}</slackSection>;

export const Text = ({ children }: { children: any }) => (
  <slackText>{children}</slackText>
);

export const Actions = ({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}) => <slackActions>{children}</slackActions>;

export const Button = ({
  children,
  value,
  onClick,
}: {
  children: string;
  onClick?: (user: SlackUser) => void;
  value?: string;
}) => (
  <slackButton value={value} onClick={onClick}>
    {children}
  </slackButton>
);
