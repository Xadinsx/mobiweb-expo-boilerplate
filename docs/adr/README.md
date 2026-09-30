# Architecture decision records

An ADR records one decision that was weighed: what we chose, what we rejected, and why. Write one when a choice would be expensive to reverse or when a new developer would ask "why is it done this way?". Small choices belong in the PR description.

How to add one:

1. Copy `template.md` to `NNNN-short-title.md`, using the next number.
2. Fill it in. Keep it to one page.
3. Add it to the PR that makes the decision. Do not edit an accepted ADR; write a new one that supersedes it and change the old one's status.

| ADR | Decision |
|---|---|
| [0001](0001-feature-sliced-design.md) | Feature-Sliced Design with routes in a root `app/` folder |
