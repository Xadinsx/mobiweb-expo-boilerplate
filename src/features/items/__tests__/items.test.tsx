import { render } from "@testing-library/react-native";
import { fireEvent, renderRouter, screen } from "expo-router/testing-library";

import { ItemsList } from "../ItemsList";

describe("items flow", () => {
  it("lists the seeded items", () => {
    renderRouter("src/app");

    expect(screen.getByTestId("items-main-list")).toBeTruthy();
    expect(screen.getByText("Item one")).toBeTruthy();
    expect(screen.getByText("Item two")).toBeTruthy();
    expect(screen.getByText("Item three")).toBeTruthy();
  });

  it("opens the detail of the tapped item", () => {
    const { getPathname } = renderRouter("src/app");

    fireEvent.press(screen.getByTestId("items-row-2-button"));

    expect(getPathname()).toBe("/item/2");
    expect(screen.getByTestId("detail-title-text")).toHaveTextContent(
      "Item two",
    );
    expect(screen.getByTestId("detail-description-text")).toHaveTextContent(
      "Description of item two",
    );
  });

  it("sends an unknown item id back to the list", () => {
    const { getPathname } = renderRouter("src/app", {
      initialUrl: "/item/999",
    });

    expect(getPathname()).toBe("/");
    expect(screen.getByTestId("items-main-list")).toBeTruthy();
  });

  it("shows the empty state instead of a blank screen", () => {
    render(<ItemsList items={[]} />);

    expect(screen.getByTestId("items-empty-text")).toBeTruthy();
  });

  it("gives every pressable on the list screen a testID and an accessibility label", () => {
    renderRouter("src/app");

    const buttons = screen.getAllByRole("button");

    expect(buttons.length).toBeGreaterThan(0);
    for (const button of buttons) {
      expect(button.props.testID).toBeTruthy();
      expect(
        button.props.accessibilityLabel ?? button.props["aria-label"],
      ).toBeTruthy();
    }
  });
});
