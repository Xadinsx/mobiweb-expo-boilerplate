---
name: new-project
description: Turn a fresh copy of this boilerplate into a client project once: set the project and first vendor identity, choose which modules to keep, swap or drop, remove the boilerplate's sample material, and delete itself. Use only at the start of a new project.
disable-model-invocation: true
---

# Start a new project from the boilerplate

Run this once, in a fresh copy of the boilerplate (a repository made from the template), on a new branch. It makes the copy the client's project. Read `docs/vendors.md` and `docs/modules/README.md` first. Later vendors are added with `/add-vendor`, and later module changes use `/module`.

Refuse and say why if `vendors/sample-single` does not exist (the project was already started), or `git status` shows uncommitted changes you did not make.

## 1. Ask

1. **Project:** the client's name (display name for the app and the README), and a short kebab-case slug for `package.json`.
2. **First vendor identity:** URL scheme, iOS bundle id, Android package. Reject, and explain, a bundle id or package that is not reverse-domain style (lowercase letters, digits and dots, at least two parts, each part starting with a letter, for example `com.client.app`), and a scheme that has anything but lowercase letters and digits. Tell the user these ids are permanent once the app is in a store.
3. **EAS:** owner, project id and slug, if the client's EAS project exists. If not, say that `eas init` creates it, and leave a clearly marked gap to fill; do not invent ids.
4. **Look, schemes, languages, features, backend, services:** the same questions as `/add-vendor` (see `.claude/skills/add-vendor/SKILL.md`, section "Ask"), including that service ids must be public. A language that is not in the registry follows `/add-vendor`, section 4.
5. **Code owners:** the real GitHub team or users for `.github/CODEOWNERS`.
6. **Modules:** show the index in `docs/modules/README.md`. For each module ask: keep the recommended default, swap, or drop. Say the recommendation and its reason (from the manifest) before asking, and ask the reason for any swap or drop, because it is recorded as a deviation.

## 2. Make the first vendor

The folder stays `vendors/default` for the life of the project, so nothing else has to refer to a changed name.

- Rewrite `vendors/default/vendor.json` from the answers, in the shape of the current file.
- Replace `vendors/default/assets/` with the files they gave, or placeholders from `python3 .claude/skills/add-vendor/placeholder-assets.py vendors/default/assets <background-hex> <accent-hex>`. Run exactly that script and do not use or install any other image tool.
- Rewrite `vendors/default/qa-notes.md` for the client's app (keep "- App id: `${APP_ID}`.").
- Remove `vendors/sample-single` completely with `git rm -r`, and the sample vendor's mentions: the `sample-single` paragraph in `docs/vendors.md`.
- In `app.config.ts`, put the client's EAS owner, project id and slug in `boilerplateEas`. If they are not known yet, ask the user to run `eas init` and say you have left it for them.
- Set the `name` in `package.json` and, if it still has the boilerplate's, the version to `0.1.0`.

## 3. Make the project's own docs

- Rewrite the first heading and opening of `README.md` and `CLAUDE.md` for the client's project. Keep the command tables, the workflow and the links. Remove sentences that describe the boilerplate itself, such as what the template contains.
- Replace the `@your-org/your-team` placeholder in `.github/CODEOWNERS` and remove its "Replace ..." comment. Remove the matching sentence in `docs/ai/lifecycle.md`.
- Delete `docs/plans/` content that belongs to the boilerplate (every file there now) with `git rm -r`. The boilerplate's ADRs in `docs/adr/` stay as the decisions the project inherits; do not edit them.
- Add a sentence to `docs/adr/README.md` saying the ADRs that exist now are inherited from the boilerplate, and the project's own continue the numbering.

## 4. Apply the module choices

For each module the user swapped or dropped, follow `.claude/skills/module/SKILL.md` for it, one module at a time, so each gets its own manifest update and deviation ADR. Do not batch. Kept modules need nothing.

## 5. Delete this skill

Remove `.claude/skills/new-project/` with `git rm -r`. Keep `add-vendor` and `module`.

## 6. Check until green

Run, and fix what they report, until all pass (skip only checks of a dropped module):

```bash
npx eslint . --fix
npm run typecheck
npm test
npm run fsd
npm run dead-code
npm run vendor-isolation
```

Then confirm nothing of the boilerplate is left. This must return nothing:

```bash
grep -rniI "mobiweb\|expoboilerplate\|sample-single\|samplesingle\|@your-org" . --exclude-dir=node_modules --exclude-dir=.git --exclude-dir=adr --exclude=package-lock.json
```

ADRs may still name the boilerplate's origin; that is history and stays. Also run `APP_VARIANT=default npx expo config --type public` and check the name and ids are the client's. Check `git diff package.json`: the `android` and `ios` scripts stay `expo run:android` and `expo run:ios`. If you cannot get green, stop and list what is left; never report success.

## 7. Report

Show `git status`. List what was set, what was left for the user (EAS ids if `eas init` has not run; GitHub repository settings such as branch protection and required checks; the `qa-agent` environment and `CLAUDE_CODE_OAUTH_TOKEN` secret if the QA agent is kept; and `REFERENCE_VENDOR`, which is optional because `default` is the reference), the deviations recorded, and that a person must review the diff. Tell them to commit on a branch and open a PR, and to note the session's token use from the app's usage view (you cannot read it).
