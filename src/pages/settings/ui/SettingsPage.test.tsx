import { fireEvent, render, screen } from "@testing-library/react-native";

import { SettingsPage } from "./SettingsPage";
import { setLanguage, setTheme } from "@/shared/config";
import { storage } from "@/shared/lib";

afterEach(() => {
  setLanguage("en");
  setTheme("light");
});

describe("SettingsPage", () => {
  it("switches the text to Portuguese and remembers the choice", () => {
    render(<SettingsPage />);
    expect(screen.getByText("Language")).toBeTruthy();

    fireEvent.press(screen.getByTestId("settings-language-pt-button"));

    expect(screen.getByText("Idioma")).toBeTruthy();
    expect(storage.getString("language")).toBe("pt");
  });

  it("remembers the dark theme when the switch is turned on", () => {
    render(<SettingsPage />);

    fireEvent(screen.getByTestId("settings-theme-switch"), "valueChange", true);

    expect(storage.getString("theme")).toBe("dark");
  });
});
