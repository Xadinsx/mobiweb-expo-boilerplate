import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = join(__dirname, "..", "..");
const read = (file: string) => readFileSync(join(root, file), "utf8");

// The Node major and the pnpm version are pinned in .nvmrc and package.json. EAS builds
// cannot read those files, so eas.json repeats them; this test keeps the copies in step.
const nodeMajor = read(".nvmrc").trim();
const pkg = JSON.parse(read("package.json"));
const eas = JSON.parse(read("eas.json"));
const pnpmVersion = String(pkg.packageManager).replace(/^pnpm@/, "");
const profiles = Object.entries<{ node?: string; pnpm?: string }>(eas.build);

describe("pinned tool versions", () => {
  it("pins pnpm in package.json", () => {
    expect(pkg.packageManager).toMatch(/^pnpm@\d+\.\d+\.\d+$/);
  });

  it("allows the Node major from .nvmrc in package.json engines", () => {
    const [, lower, upper] =
      /^>=(\d+)\.\d+\.\d+ <(\d+)$/.exec(pkg.engines.node) ?? [];

    expect(Number(lower)).toBe(Number(nodeMajor));
    expect(Number(upper)).toBe(Number(nodeMajor) + 1);
  });

  it.each(profiles)(
    "pins the same Node major and pnpm in the %s EAS profile",
    (_, profile) => {
      expect(profile.node?.split(".")[0]).toBe(nodeMajor);
      expect(profile.pnpm).toBe(pnpmVersion);
    },
  );
});
