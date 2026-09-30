// Checks that a vendor's app contains nothing of any other vendor. Every vendor is exported
// as an Android bundle; the export must not contain another vendor's identifying values
// (from its vendor.json) or another vendor's asset files (compared by content).
// Run with `npm run vendor-isolation`.
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const root = join(import.meta.dirname, "..", "..");
const vendorsDir = join(root, "vendors");

const names = readdirSync(vendorsDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();

const problems = [];

/** Every file under a folder, as paths. */
function filesIn(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory()
      ? filesIn(join(dir, entry.name))
      : [join(dir, entry.name)],
  );
}

const sha256 = (file) =>
  createHash("sha256").update(readFileSync(file)).digest("hex");

/** The values that identify a vendor and must never appear in another vendor's app. */
function markersOf(name) {
  const { identity, backend, services } = JSON.parse(
    readFileSync(join(vendorsDir, name, "vendor.json"), "utf8"),
  );
  const values = [
    identity.name,
    identity.scheme,
    identity.iosBundleId,
    identity.androidPackage,
    backend.apiBaseUrl,
    ...Object.values(services),
  ];
  return values.filter((value) => typeof value === "string" && value !== "");
}

const markers = Object.fromEntries(
  names.map((name) => [name, markersOf(name)]),
);
const assetHashes = Object.fromEntries(
  names.map((name) => [
    name,
    new Set(filesIn(join(vendorsDir, name, "assets")).map(sha256)),
  ]),
);

// Two vendors may not share a value, or one contains the other, or a search for one would
// also match the other.
for (const a of names) {
  for (const b of names.filter((other) => other > a)) {
    for (const x of markers[a]) {
      for (const y of markers[b]) {
        if (x.includes(y) || y.includes(x)) {
          problems.push(
            `Vendors "${a}" and "${b}" have overlapping values "${x}" and "${y}". Give each vendor its own.`,
          );
        }
      }
    }
  }
}

for (const name of names) {
  const output = mkdtempSync(join(tmpdir(), `vendor-${name}-`));
  try {
    try {
      execFileSync(
        "npx",
        [
          "expo",
          "export",
          "--platform",
          "android",
          "--no-bytecode",
          "--output-dir",
          output,
        ],
        {
          cwd: root,
          env: { ...process.env, APP_VARIANT: name },
          stdio: "pipe",
        },
      );
    } catch (error) {
      problems.push(
        `Exporting "${name}" failed:\n${String(error.stderr).trim().split("\n").slice(-8).join("\n")}`,
      );
      continue;
    }
    const exported = filesIn(output);
    const code = exported
      .filter((file) => file.endsWith(".js"))
      .map((file) => readFileSync(file, "utf8"))
      .join("\n");

    // A check that finds nothing in its own app would pass for the wrong reason.
    if (!code.includes(markers[name][0])) {
      problems.push(
        `The export for "${name}" does not contain its own name, so the check cannot be trusted.`,
      );
    }

    for (const other of names.filter((n) => n !== name)) {
      for (const marker of markers[other]) {
        if (code.includes(marker)) {
          problems.push(
            `The app for "${name}" contains "${marker}", which belongs to "${other}".`,
          );
        }
      }
      for (const file of exported) {
        if (statSync(file).size > 0 && assetHashes[other].has(sha256(file))) {
          problems.push(
            `The app for "${name}" contains ${file.slice(output.length + 1)}, a file that belongs to "${other}".`,
          );
        }
      }
    }
  } finally {
    rmSync(output, { recursive: true, force: true });
  }
}

if (problems.length > 0) {
  console.error(problems.join("\n"));
  process.exit(1);
}
console.log(`Vendors are isolated: ${names.join(", ")}.`);
