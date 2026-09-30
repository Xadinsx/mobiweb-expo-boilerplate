import type { en } from "./resources";

// Makes t("items.title") check its key against the English resources.
declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "translation";
    resources: { translation: typeof en };
  }
}
