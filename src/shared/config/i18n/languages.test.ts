import { languageOptions } from "./languages";

describe("languageOptions", () => {
  it("returns a button for each supported language, named in its own language", () => {
    expect(languageOptions(["en", "pt"])).toEqual([
      { code: "en", name: "English" },
      { code: "pt", name: "Português" },
    ]);
  });

  it("leaves out a code that has no translation", () => {
    expect(languageOptions(["en", "xx"]).map((option) => option.code)).toEqual([
      "en",
    ]);
  });
});
