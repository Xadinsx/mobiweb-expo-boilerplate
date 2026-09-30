// Runtime assets for this vendor. Metro needs literal requires, so they live here and not
// in vendor.ts, which Node also loads.
import type { ImageSourcePropType } from "react-native";

export const logo: ImageSourcePropType = require("./assets/icon.png");
