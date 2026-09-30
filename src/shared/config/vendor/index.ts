import type { VendorConfig } from "./vendor-config";

import vendorData from "@vendor/vendor.json";

export { logo as vendorLogo } from "@vendor/runtime";
export type { ColorScheme, Palette, VendorConfig } from "./vendor-config";

/** The config of the vendor this build is for, chosen by APP_VARIANT. */
export const vendor = vendorData as VendorConfig;
