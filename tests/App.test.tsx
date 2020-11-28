import React from "react";
import { render, screen } from "@testing-library/react";
import App from "../src/App";

test("renders app", () => {
  render(<App />);
  const linkElement = screen.getByText(/Payfiat frontend/i);
  expect(linkElement).toBeInTheDocument();
});
