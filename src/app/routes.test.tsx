import { fireEvent, renderRouter, screen } from "expo-router/testing-library";

describe("items flow", () => {
  it("lists the seeded items", async () => {
    renderRouter("app");

    expect(await screen.findByTestId("items-main-list")).toBeTruthy();
    expect(screen.getByText("Item one")).toBeTruthy();
    expect(screen.getByText("Item two")).toBeTruthy();
    expect(screen.getByText("Item three")).toBeTruthy();
  });

  it("opens the detail of the tapped item", async () => {
    const { getPathname } = renderRouter("app");

    fireEvent.press(await screen.findByTestId("items-row-2-button"));

    expect(getPathname()).toBe("/item/2");
    expect(await screen.findByTestId("detail-title-text")).toHaveTextContent(
      "Item two",
    );
    expect(screen.getByTestId("detail-description-text")).toHaveTextContent(
      "Description of item two",
    );
  });

  it("sends an unknown item id back to the list", async () => {
    const { getPathname } = renderRouter("app", {
      initialUrl: "/item/999",
    });

    expect(await screen.findByTestId("items-main-list")).toBeTruthy();
    expect(getPathname()).toBe("/");
  });

  it("opens the settings page from the items header", () => {
    const { getPathname } = renderRouter("app");

    fireEvent.press(screen.getByTestId("items-settings-link"));

    expect(getPathname()).toBe("/settings");
    expect(screen.getByTestId("settings-theme-switch")).toBeTruthy();
  });

  it("gives every pressable on the list screen a testID and an accessibility label", async () => {
    renderRouter("app");
    await screen.findByTestId("items-main-list");

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
