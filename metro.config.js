const fs = require("node:fs");
const path = require("node:path");

const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// "@vendor/x" resolves to vendors/<APP_VARIANT>/x, so only the chosen vendor is bundled.
const variant = process.env.APP_VARIANT || "default";
const vendorRoot = path.resolve(__dirname, "vendors", variant);

if (!fs.existsSync(path.join(vendorRoot, "vendor.json"))) {
  const names = fs
    .readdirSync(path.join(__dirname, "vendors"), { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);
  throw new Error(`Unknown APP_VARIANT "${variant}". Vendors that exist: ${names.join(", ")}.`);
}

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName.startsWith("@vendor/")) {
    const target = path.join(vendorRoot, moduleName.slice("@vendor/".length));
    return context.resolveRequest(context, target, platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
