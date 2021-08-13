import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import ContactForm from "./ContactForm";

test("ContactForm component renders without erors", () => {
  render(<ContactForm />);
});

test("renders the contact form header", () => {
  render(<ContactForm />);
  const header = screen.queryByText(/contact form/i);
  expect(header).toBeInTheDocument();
  expect(header).toBeTruthy();
});

test("renders ONE error message if user enters less then 5 characters into firstname.", async () => {
  const firstNameInput = screen.queryByPlaceholderText(/edd/i);
  userEvent.type(firstNameInput, "app");
  expect(
    screen.getByText("Error: firstName must have at least 5 characters.")
  ).toBeVisible();
});

test("renders THREE error messages if user enters no values into any fields.", async () => {
  const submitButton = screen.getByRole("submit");
  const errors = screen.getAllByTestId("error");
  userEvent.click(submitButton);
  expect(errors).toHaveLength(3);
});

test("renders ONE error message if user enters a valid first name and last name but no email.", async () => {
  const firstNameInput = screen.queryByPlaceholderText(/edd/i);
  const lastNameInput = screen.queryByPlaceholderText(/burke/i);
  const submitButton = screen.getByRole("submit");

  userEvent.type(firstNameInput, "shariq");
  userEvent.type(lastNameInput, "alberto");
  userEvent.click(submitButton);

  const errors = screen.getAllByTestId("error");
  expect(errors).toHaveLength(1);
});

test('renders "email must be a valid email address" if an invalid email is entered', async () => {
  const emailInput = screen.queryByPlaceholderText("bluebill1049@hotmail.com");
  userEvent.type(emailInput, "shariwemail");
  const emailError = screen.getByText("email must be a valid email address.");
  expect(emailError).toBeVisible();
});

test('renders "lastName is a required field" if an last name is not entered and the submit button is clicked', async () => {
  const submitButton = screen.getByRole("submit");
  userEvent.click(submitButton);
  const lastNameError = screen.getByText("lastName is a required field.");
  expect(lastNameError).toBeVisible();
});

test("renders all firstName, lastName and email text when submitted. Does NOT render message if message is not submitted.", async () => {
  const firstNameLabel = screen.getByLabelText(/first name/i);
  const lastNameLabel = screen.getByLabelText(/last name/i);
  const emailLabel = screen.getByLabelText(/email/i);
  const submitButton = screen.queryByTestId("submit");

  userEvent.type(firstNameLabel, "test1");
  userEvent.type(lastNameLabel, "test2");
  userEvent.type(emailLabel, "test@test.com");
  userEvent.click(submitButton);

  await waitFor(() => {
    expect(screen.getByText("test1")).toBeInTheDocument();
    expect(screen.getByText("test2")).toBeInTheDocument();
    expect(screen.getByText("test@test.com")).toBeInTheDocument();
    expect(screen.queryByText("Message:")).not.toBeInTheDocument();
  });
});

test("renders all fields text when all fields are submitted.", async () => {
  const firstNameLabel = screen.getByLabelText(/first name/i);
  const lastNameLabel = screen.getByLabelText(/last name/i);
  const emailLabel = screen.getByLabelText(/email/i);
  const submitButton = screen.queryByTestId("submit");

  userEvent.type(firstNameLabel, "test1");
  userEvent.type(lastNameLabel, "test2");
  userEvent.type(emailLabel, "test@test.com");
  userEvent.click(submitButton);
  userEvent.type(screen.getByLabelText(/message/i), "this is a test message");

  await waitFor(() => {
    expect(screen.getByText("test1")).toBeInTheDocument();
    expect(screen.getByText("test2")).toBeInTheDocument();
    expect(screen.getByText("test@test.com")).toBeInTheDocument();
    expect(screen.getByTestId("messageDisplay")).toHaveTextContent(
      "this is a test message"
    );
  });
});
