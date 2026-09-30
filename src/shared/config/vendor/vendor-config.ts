// What differs between one vendor's app and another's. Plain data only: no code, no requires,
// and no secrets. Anything in an app can be read, so `services` holds public identifiers only.

type ColorScheme = "light" | "dark";

type Palette = {
  background: string;
  text: string;
  mutedText: string;
  border: string;
  accent: string;
};

export type VendorConfig = {
  identity: {
    name: string;
    scheme: string;
    iosBundleId: string;
    androidPackage: string;
    /** Paths relative to the vendor folder. */
    icon: string;
    adaptiveIcon: {
      foreground: string;
      background: string;
      monochrome: string;
      backgroundColor: string;
    };
  };
  look: {
    /** One palette for each color scheme the vendor supports. */
    palettes: Partial<Record<ColorScheme, Palette>>;
  };
  schemes: {
    supported: ColorScheme[];
    default: ColorScheme;
    /** Whether users can switch scheme. */
    userChoice: boolean;
  };
  languages: {
    supported: string[];
    default: string;
    /** Whether users can switch language. */
    userChoice: boolean;
  };
  features: Record<string, boolean>;
  backend: { apiBaseUrl: string };
  /** Public client identifiers, such as a crash-reporting DSN. Never a secret. */
  services: Record<string, string>;
  /** Only for a vendor with its own EAS project. Others use the boilerplate's. */
  eas?: { owner: string; projectId: string; slug: string };
};
