// Builds the Expo config for the vendor chosen by APP_VARIANT. The vendor's data is a plain
// vendor.json, because Expo evaluates this file with Node and cannot load other TypeScript files.
import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

import type { ExpoConfig } from "expo/config";

import type { VendorConfig } from "./src/shared/config/vendor/vendor-config";

// Used by every vendor until a vendor brings its own EAS project (vendor.eas).
const boilerplateEas = {
  owner: "filipeleite",
  projectId: "85a3fbb2-a9d0-4af9-941d-ca302623da51",
  slug: "mobiweb-expo-boilerplate",
};

const vendorsDir = join(__dirname, "vendors");

export function vendorNames(): string[] {
  return readdirSync(vendorsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((name) => existsSync(join(vendorsDir, name, "vendor.json")))
    .sort();
}

const isText = (value: unknown) =>
  typeof value === "string" && value.trim() !== "";
const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

/** Checks a vendor's data has every field with the right kind of value. */
export function validateVendor(name: string, data: unknown): VendorConfig {
  const problems: string[] = [];
  const need = (ok: boolean, message: string) => {
    if (!ok) problems.push(message);
  };
  const config = isObject(data) ? data : {};
  const identity = isObject(config.identity) ? config.identity : {};
  const adaptive = isObject(identity.adaptiveIcon) ? identity.adaptiveIcon : {};
  const look = isObject(config.look) ? config.look : {};
  const palettes = isObject(look.palettes) ? look.palettes : {};
  const schemes = isObject(config.schemes) ? config.schemes : {};
  const languages = isObject(config.languages) ? config.languages : {};
  const supportedSchemes = Array.isArray(schemes.supported)
    ? schemes.supported
    : [];
  const supportedLanguages = Array.isArray(languages.supported)
    ? languages.supported
    : [];

  for (const key of [
    "name",
    "scheme",
    "iosBundleId",
    "androidPackage",
    "icon",
  ]) {
    need(isText(identity[key]), `identity.${key} must be text`);
  }
  for (const key of [
    "foreground",
    "background",
    "monochrome",
    "backgroundColor",
  ]) {
    need(isText(adaptive[key]), `identity.adaptiveIcon.${key} must be text`);
  }
  need(
    supportedSchemes.length > 0,
    "schemes.supported must list at least one scheme",
  );
  for (const scheme of supportedSchemes) {
    need(
      scheme === "light" || scheme === "dark",
      `unknown scheme "${String(scheme)}"`,
    );
    const palette = isObject(palettes[scheme]) ? palettes[scheme] : {};
    for (const key of ["background", "text", "mutedText", "border", "accent"]) {
      need(
        isText(palette[key]),
        `look.palettes.${String(scheme)}.${key} must be text`,
      );
    }
  }
  need(
    supportedSchemes.includes(schemes.default),
    "schemes.default must be one of schemes.supported",
  );
  need(
    typeof schemes.userChoice === "boolean",
    "schemes.userChoice must be true or false",
  );
  need(
    supportedLanguages.length > 0,
    "languages.supported must list at least one language",
  );
  need(
    supportedLanguages.every(isText),
    "languages.supported must be a list of language codes",
  );
  need(
    supportedLanguages.includes(languages.default),
    "languages.default must be one of languages.supported",
  );
  need(
    typeof languages.userChoice === "boolean",
    "languages.userChoice must be true or false",
  );
  need(isObject(config.features), "features must be an object");
  need(
    isObject(config.backend) && isText(config.backend.apiBaseUrl),
    "backend.apiBaseUrl must be text",
  );
  need(isObject(config.services), "services must be an object");

  if (problems.length > 0) {
    throw new Error(`Vendor "${name}" is invalid:\n- ${problems.join("\n- ")}`);
  }
  return data as VendorConfig;
}

export function loadVendor(name: string): VendorConfig {
  const names = vendorNames();
  if (!names.includes(name)) {
    throw new Error(
      `Unknown APP_VARIANT "${name}". Vendors that exist: ${names.join(", ")}.`,
    );
  }
  return validateVendor(name, require(join(vendorsDir, name, "vendor.json")));
}

export function buildExpoConfig(variant: string): ExpoConfig {
  const vendor = loadVendor(variant);
  const eas = vendor.eas ?? boilerplateEas;
  const assets = (path: string) => `./vendors/${variant}/${path}`;
  const { identity } = vendor;

  return {
    name: identity.name,
    slug: eas.slug,
    version: "1.0.0",
    orientation: "portrait",
    icon: assets(identity.icon),
    scheme: identity.scheme,
    owner: eas.owner,
    ios: {
      supportsTablet: true,
      bundleIdentifier: identity.iosBundleId,
    },
    android: {
      package: identity.androidPackage,
      predictiveBackGestureEnabled: false,
      adaptiveIcon: {
        backgroundColor: identity.adaptiveIcon.backgroundColor,
        foregroundImage: assets(identity.adaptiveIcon.foreground),
        backgroundImage: assets(identity.adaptiveIcon.background),
        monochromeImage: assets(identity.adaptiveIcon.monochrome),
      },
    },
    plugins: [["expo-router", { root: "app" }], "expo-localization"],
    extra: { eas: { projectId: eas.projectId } },
  };
}

export default () => buildExpoConfig(process.env.APP_VARIANT ?? "default");
