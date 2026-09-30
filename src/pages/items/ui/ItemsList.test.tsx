import { render, screen } from "@testing-library/react-native";

import { ItemsList } from "./ItemsList";

describe("ItemsList", () => {
  it("shows the empty state instead of a blank screen", () => {
    render(<ItemsList items={[]} />);

    expect(screen.getByTestId("items-empty-text")).toBeTruthy();
  });
});
