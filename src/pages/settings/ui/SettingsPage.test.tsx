import { fireEvent, render, screen } from "@testing-library/react-native";

import { SettingsPage } from "./SettingsPage";
import { setLanguage, setTheme, vendor } from "@/shared/config";
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

  it("shows both choices for a vendor that offers both", () => {
    render(<SettingsPage />);

    expect(screen.getByTestId("settings-theme-switch")).toBeTruthy();
    expect(screen.getByTestId("settings-language-en-button")).toBeTruthy();
    expect(screen.getByTestId("settings-language-pt-button")).toBeTruthy();
    expect(screen.queryByTestId("settings-nothing-text")).toBeNull();
  });

  it("shows nothing to choose for a vendor with one language and one color scheme", () => {
    const single = {
      ...vendor,
      schemes: {
        supported: ["light" as const],
        default: "light" as const,
        userChoice: true,
      },
      languages: { supported: ["pt"], default: "pt", userChoice: true },
    };

    render(<SettingsPage config={single} />);

    expect(screen.queryByTestId("settings-theme-switch")).toBeNull();
    expect(screen.queryByTestId("settings-language-pt-button")).toBeNull();
    expect(screen.getByTestId("settings-nothing-text")).toBeTruthy();
  });

  it("hides a choice the vendor does not let users make", () => {
    const fixedLanguage = {
      ...vendor,
      languages: { ...vendor.languages, userChoice: false },
    };

    render(<SettingsPage config={fixedLanguage} />);

    expect(screen.getByTestId("settings-theme-switch")).toBeTruthy();
    expect(screen.queryByTestId("settings-language-en-button")).toBeNull();
  });
});
