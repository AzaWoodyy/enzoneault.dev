# anti-slop provenance

- Source: https://github.com/dmmulroy/anti-slop
- Commit: `13909c9e07590f5a85d93c62712259fe14a883f7` (2026-10-13)
- Copied with `skills/install-anti-slop/scripts/install.mjs` from that commit (bundled `assets/anti-slop`).
- Installed path: `tools/oxlint/anti-slop/` — entry point `index.ts`, registered in `oxlint.config.ts`.
- Deviations: removed `effect/` (opt-in Effect rules; this project does not depend on `effect`).
- Tooling: `oxlint` and `@oxlint/plugins` pinned at `1.93.0`.
