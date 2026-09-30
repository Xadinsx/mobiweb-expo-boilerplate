import type { VendorConfig } from "../vendor";

/**
 * The stored choice if users may choose and it is supported, then the device language if
 * supported, then the vendor default.
 */
export function resolveInitialLanguage(
  languages: VendorConfig["languages"],
  stored: string | undefined,
  deviceLanguage: string | null | undefined,
): string {
  const isSupported = (code: string | null | undefined) =>
    languages.supported.some((supported) => supported === code);

  if (languages.userChoice && isSupported(stored)) {
    return stored as string;
  }
  if (isSupported(deviceLanguage)) {
    return deviceLanguage as string;
  }
  return languages.default;
}
