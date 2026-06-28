# DPUse File Store Emulator Connector

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![DPUse version](https://img.shields.io/github/v/release/dpuse/dpuse-connector-file-store-emulator?color=f6821f&label=DPUse)](https://github.com/dpuse/dpuse-connector-file-store-emulator/releases/latest)
[![CodeQL](https://github.com/dpuse/dpuse-connector-file-store-emulator/actions/workflows/codeql.yml/badge.svg)](https://github.com/dpuse/dpuse-connector-file-store-emulator/actions/workflows/codeql.yml)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=dpuse_dpuse-connector-file-store-emulator&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=dpuse_dpuse-connector-file-store-emulator)
[![CI](https://github.com/dpuse/dpuse-connector-file-store-emulator/actions/workflows/ci.yml/badge.svg)](https://github.com/dpuse/dpuse-connector-file-store-emulator/actions/workflows/ci.yml)

## Introduction

A TypeScript library that implements the File Store Emulator Connector.

Provides access to a sample set of read-only data simulating a hypothetical cloud-based file storage solution. It is intended for demonstration, evaluation, and testing and is freely available to all users.

It emulates services such as Google Drive, Dropbox, and Microsoft OneDrive.

## Supported Actions

<!-- CONNECTOR_ACTIONS_START -->
|Action|Supported|
|:----|:-------:|
| Abort Operation | ✓ |
| Audit Object Content | ✓ |
| Create Object |  |
| Describe Connection |  |
| Drop Object |  |
| Find Object | ✓ |
| Get Readable Stream | ✓ |
| Get Record |  |
| List Nodes | ✓ |
| Preview Object | ✓ |
| Remove Records |  |
| Retrieve Chunks |  |
| Retrieve Records | ✓ |
| Upsert Records |  |

<!-- CONNECTOR_ACTIONS_END -->

## Installation

There’s no need to install this connector manually. Once released, it is uploaded to the DPUse Engine cloud and becomes instantly available to all new browser app instances. A notification about the new version is also sent to all existing browser apps.

Besides using the connector from the DPUse Engine cloud, developers can clone this repository to build a replacement or use it as the basis for a new connector.

## Development

**Prerequisites:** [Node.js 22](https://nodejs.org/) or later and npm.

```bash
git clone https://github.com/dpuse/dpuse-connector-file-store-emulator.git
cd dpuse-connector-file-store-emulator
npm install
```

Key scripts:

| Command          | Description        |
| ---------------- | ------------------ |
| `npm run build`  | Build the library  |
| `npm test`       | Run the test suite |
| `npm run lint`   | Lint the source    |
| `npm run format` | Format the source  |

> **Note:** `npm run build` also compiles the Rust WebAssembly module and requires [`wasm-pack`](https://rustwasm.github.io/wasm-pack/installer/).

## Dependency Licenses

License data is collected automatically on each release using [license-checker](https://github.com/RSeidelsohn/license-checker-rseidelsohn). The following table lists all production dependencies. These dependencies (including transitive ones) have been checked and confirmed to use Apache-2.0, BSD-3-Clause, CC0-1.0, or MIT — all permissive, commercially-friendly licenses. Developers cloning this repository should independently verify development dependencies; users of the uploaded library are covered by these checks.

<!-- DEPENDENCY_LICENSES_START -->
|Dependency|Version|License(s)|Document|
|:-|:-:|:-|:-|
|[@borewit/text-codec](https://github.com/Borewit/text-codec)|0.2.2|MIT|[LICENSE](licenses/downloads/@borewit/text-codec@0.2.2-LICENSE.txt)|
|[@dpuse/dpuse-shared](https://github.com/dpuse/dpuse-shared)|0.3.711|MIT|[LICENSE](licenses/downloads/@dpuse/dpuse-shared@0.3.711-LICENSE.txt)|
|[@dpuse/dpuse-tool-csv-parse](https://github.com/dpuse/dpuse-tool-csv-parse)|0.0.143|MIT|[LICENSE](licenses/downloads/@dpuse/dpuse-tool-csv-parse@0.0.143-LICENSE.txt)|
|[@dpuse/dpuse-tool-file-operators](https://github.com/dpuse/dpuse-tool-file-operators)|0.0.24|MIT|[LICENSE](licenses/downloads/@dpuse/dpuse-tool-file-operators@0.0.24-LICENSE.txt)|
|[@dpuse/dpuse-tool-rust-csv-core](https://github.com/dpuse/dpuse-tool-rust-csv-core)|0.1.21|MIT|[LICENSE](licenses/downloads/@dpuse/dpuse-tool-rust-csv-core@0.1.21-LICENSE.txt)|
|[@tokenizer/inflate](https://github.com/Borewit/tokenizer-inflate)|0.4.1|MIT|[LICENSE](licenses/downloads/@tokenizer/inflate@0.4.1-LICENSE.txt)|
|[@tokenizer/token](https://github.com/Borewit/tokenizer-token)|0.3.0|MIT|[LICENSE](licenses/downloads/@tokenizer/token@0.3.0-LICENSE.txt)|
|[chardet](https://github.com/runk/node-chardet)|2.1.1|MIT|[LICENSE](licenses/downloads/chardet@2.1.1-LICENSE.txt)|
|[csv-parse](https://github.com/adaltas/node-csv)|6.2.1|MIT|[LICENSE](licenses/downloads/csv-parse@6.2.1-LICENSE.txt)|
|[debug](https://github.com/debug-js/debug)|4.4.3|MIT|[LICENSE](licenses/downloads/debug@4.4.3-LICENSE.txt)|
|[file-type](https://github.com/sindresorhus/file-type)|22.0.1|MIT|[LICENSE](licenses/downloads/file-type@22.0.1-LICENSE.txt)|
|[ieee754](https://github.com/feross/ieee754)|1.2.1|BSD-3-Clause|[LICENSE](licenses/downloads/ieee754@1.2.1-LICENSE.txt)|
|[ms](https://github.com/vercel/ms)|2.1.3|MIT|[LICENSE](licenses/downloads/ms@2.1.3-LICENSE.txt)|
|[nanoid](https://github.com/ai/nanoid)|5.1.16|MIT|[LICENSE](licenses/downloads/nanoid@5.1.16-LICENSE.txt)|
|[strtok3](https://github.com/Borewit/strtok3)|10.3.5|MIT|[LICENSE](licenses/downloads/strtok3@10.3.5-LICENSE.txt)|
|[token-types](https://github.com/Borewit/token-types)|6.1.2|MIT|[LICENSE](licenses/downloads/token-types@6.1.2-LICENSE.txt)|
|[uint8array-extras](https://github.com/sindresorhus/uint8array-extras)|1.5.0|MIT|[LICENSE](licenses/downloads/uint8array-extras@1.5.0-LICENSE.txt)|

<!-- DEPENDENCY_LICENSES_END -->

### Dependency Tree

The dependency tree below lists every package in this project — direct and transitive — along with its installed version, release date, and update status. Packages flagged ❗ have a newer version available; ⚠️ indicates a package that hasn't been updated in the last 6 months or longer. Neither flag necessarily indicates a problem: we let new releases stabilise before upgrading, and some packages are simply mature and stable, requiring no active development.

<!-- DEPENDENCY_TREE_START -->
- **[@dpuse/dpuse-shared](https://github.com/dpuse/dpuse-shared)** 0.3.711 — this month: 2026-06-28
- **[@dpuse/dpuse-tool-csv-parse](https://github.com/dpuse/dpuse-tool-csv-parse)** 0.0.143 — 2 months ago: 2026-04-21
  - **[@dpuse/dpuse-shared](https://github.com/dpuse/dpuse-shared)** 0.3.711 — this month: 2026-06-28
  - **[csv-parse](https://github.com/adaltas/node-csv)** 6.2.1 — 3 months ago: 2026-03-20 → **latest**: 7.0.0 — this month: 2026-06-14 ❗
- **[@dpuse/dpuse-tool-file-operators](https://github.com/dpuse/dpuse-tool-file-operators)** 0.0.24 — 2 months ago: 2026-04-23
  - **[@dpuse/dpuse-shared](https://github.com/dpuse/dpuse-shared)** 0.3.711 — this month: 2026-06-28
  - **[chardet](https://github.com/runk/node-chardet)** 2.1.1 — 7 months ago: 2025-10-29 ⚠️  → **latest**: 2.2.0 — this month: 2026-06-20 ❗
  - **[file-type](https://github.com/sindresorhus/file-type)** 22.0.1 — 2 months ago: 2026-04-09
    - **[@tokenizer/inflate](https://github.com/Borewit/tokenizer-inflate)** 0.4.1 — 7 months ago: 2025-11-18 ⚠️ 
      - **[debug](https://github.com/debug-js/debug)** 4.4.3 — 9 months ago: 2025-09-13 ⚠️ 
        - **[ms](https://github.com/vercel/ms)** 2.1.3 — 66 months ago: 2020-12-08 ⚠️ 
      - **[token-types](https://github.com/Borewit/token-types)** 6.1.2 — 5 months ago: 2026-01-01
    - **[strtok3](https://github.com/Borewit/strtok3)** 10.3.5 — 3 months ago: 2026-03-21
      - **[@tokenizer/token](https://github.com/Borewit/tokenizer-token)** 0.3.0 — 59 months ago: 2021-07-12 ⚠️ 
    - **[token-types](https://github.com/Borewit/token-types)** 6.1.2 — 5 months ago: 2026-01-01
      - **[@borewit/text-codec](https://github.com/Borewit/text-codec)** 0.2.2 — 3 months ago: 2026-03-11
      - **[@tokenizer/token](https://github.com/Borewit/tokenizer-token)** 0.3.0 — 59 months ago: 2021-07-12 ⚠️ 
      - **[ieee754](https://github.com/feross/ieee754)** 1.2.1 — 68 months ago: 2020-10-27 ⚠️ 
    - **[uint8array-extras](https://github.com/sindresorhus/uint8array-extras)** 1.5.0 — 10 months ago: 2025-08-22 ⚠️ 
- **[@dpuse/dpuse-tool-rust-csv-core](https://github.com/dpuse/dpuse-tool-rust-csv-core)** 0.1.21 — 2 months ago: 2026-04-21
  - **[@dpuse/dpuse-shared](https://github.com/dpuse/dpuse-shared)** 0.3.711 — this month: 2026-06-28
- **[nanoid](https://github.com/ai/nanoid)** 5.1.16 — this month: 2026-06-24
<!-- DEPENDENCY_TREE_END -->

## Bundle Analysis

The Bundle Analysis Reports provide detailed breakdowns of the bundle's composition and module sizes, helping to identify which modules contribute most to the final build. Two complementary reports are generated automatically on each release:

- **[rollup-plugin-visualizer](https://github.com/btd/rollup-plugin-visualizer/tree/master)** — generates a static treemap/sunburst view based on pre-build module estimates, useful for a quick visual scan of overall bundle composition, including CSS assets.
- **[Sonda](https://sonda.dev/)** — analyses final source maps to capture the effects of tree-shaking and minification, rather than relying on pre-build estimates. This gives a more accurate picture of what's actually shipped, traces module-level dependencies, and shows the size of each module after tree-shaking and minification for more precise insight into what's driving bundle size. Note: Sonda's Vite reports currently exclude CSS files, since Vite does not generate source maps for CSS.

[View the rollup-plugin-visualizer Report](https://dpuse.github.io/dpuse-connector-file-store-emulator/bundle-analysis-reports/rollup-visualiser/index.html).

[View the Sonda Report](https://dpuse.github.io/dpuse-connector-file-store-emulator/bundle-analysis-reports/sonda/index.html).

<!-- BUNDLE_START -->

|Chunk/Module/File|Composition|
|:------ |:-----------|
| dpuse-connector-file-store-emulator.es.js | 59.2 kB · gz 15.8 kB · br 13.0 kB |
| &nbsp;&nbsp;&nbsp;&nbsp;src | `█████████████░░░░░░░` 67.1% |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;fileStoreFolderPaths.json | `███████████░░░░░░░░░` 55.8% |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;index.ts | `█░░░░░░░░░░░░░░░░░░░` 6.9% |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;config.json | `█░░░░░░░░░░░░░░░░░░░` 3.7% |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;rustBridge.ts | `░░░░░░░░░░░░░░░░░░░░` 0.6% |
| &nbsp;&nbsp;&nbsp;&nbsp;@dpuse/dpuse-shared | `█░░░░░░░░░░░░░░░░░░░` 3.8% |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;dist/dpuse-shared-errors.es.js | `░░░░░░░░░░░░░░░░░░░░` 1.7% |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;dist/dpuse-shared-utilities.es.js | `░░░░░░░░░░░░░░░░░░░░` 0.8% |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;dist/dpuse-shared-componentDataView.es.js | `░░░░░░░░░░░░░░░░░░░░` 0.7% |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;dist/dpuse-shared-componentModuleTool.es.js | `░░░░░░░░░░░░░░░░░░░░` 0.4% |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;dist/dpuse-shared-locale.es.js | `░░░░░░░░░░░░░░░░░░░░` 0.2% |
| &nbsp;&nbsp;&nbsp;&nbsp;nanoid | `░░░░░░░░░░░░░░░░░░░░` 0.4% |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;index.browser.js | `░░░░░░░░░░░░░░░░░░░░` 0.3% |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;url-alphabet/index.js | `░░░░░░░░░░░░░░░░░░░░` 0.2% |
| dpuse_connector_file_store_emulator_core-BbpaeCh_.js | 24.1 kB · gz 11.4 kB · br 10.1 kB |
| &nbsp;&nbsp;&nbsp;&nbsp;wasm | `██████░░░░░░░░░░░░░░` 28.4% |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;dpuse_connector_file_store_emulator_core_bg.wasm?url | `████░░░░░░░░░░░░░░░░` 22.4% |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;dpuse_connector_file_store_emulator_core_bg.js | `█░░░░░░░░░░░░░░░░░░░` 3.3% |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;dpuse_connector_file_store_emulator_core_bg.wasm | `░░░░░░░░░░░░░░░░░░░░` 1.3% |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;__vite-plugin-wasm-helper | `░░░░░░░░░░░░░░░░░░░░` 1.2% |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;dpuse_connector_file_store_emulator_core.js | `░░░░░░░░░░░░░░░░░░░░` 0.2% |
| &nbsp;&nbsp;&nbsp;&nbsp;(runtime) → rolldown/runtime.js | `░░░░░░░░░░░░░░░░░░░░` 0.4% |

<!-- BUNDLE_END -->

## Security & Quality

### CodeQL

[CodeQL](https://github.com/dpuse/dpuse-connector-file-store-emulator/security/code-scanning) static analysis runs on every push to `main` and on a weekly schedule, scanning TypeScript, JavaScript, Rust, and GitHub Actions workflow files for security vulnerabilities and coding errors.

### SonarCloud

[SonarCloud](https://sonarcloud.io/summary/new_code?id=dpuse_dpuse-connector-file-store-emulator) performs continuous code quality and security analysis on every push, detecting bugs, code smells, and security vulnerabilities in the TypeScript source.

### Vulnerability Scanning

Two complementary tools continuously monitor dependencies for known vulnerabilities:

- **[GitHub Dependabot](https://docs.github.com/en/code-security/dependabot)** automatically raises pull requests to update vulnerable dependencies, drawing on the GitHub Advisory Database which combines NVD and npm-specific advisories.
- **npm audit** runs on every push to `main` via the CI workflow, failing the build if any high or critical severity vulnerabilities are detected.

### Supply Chain Security

[Socket.dev](https://socket.dev) monitors all dependencies for supply chain risk — detecting malicious packages, dependency confusion, typosquatting, and suspicious behaviour that may not yet have a CVE.

### Reporting Vulnerabilities

Please do not open public GitHub issues for security vulnerabilities. Use [GitHub private vulnerability reporting](https://github.com/dpuse/dpuse-connector-file-store-emulator/security/advisories/new) instead. See [SECURITY.md](./SECURITY.md) for the full disclosure policy, contact details, and expected response times.

### OpenSSF 🚧

[![OpenSSF Scorecard](https://api.scorecard.dev/projects/github.com/dpuse/dpuse-connector-file-store-emulator/badge)](https://scorecard.dev/viewer/?uri=github.com/dpuse/dpuse-connector-file-store-emulator)

This project is working towards the [OpenSSF Best Practices](https://www.bestpractices.dev) Passing badge, a self-certification covering security policy, vulnerability reporting, build processes, code quality, and more. The [OpenSSF Scorecard](https://scorecard.dev/viewer/?uri=github.com/dpuse/dpuse-connector-file-store-emulator) provides an independent automated assessment of the project's security practices and is an ongoing area of improvement.

## Contributing

This repository is maintained solely by its owner and does not accept external contributions. It is part of a larger closed application suite and is published for informational and cloning purposes only.

If you find a security vulnerability, see [Reporting Vulnerabilities](#reporting-vulnerabilities). For bugs, inconsistencies, or other feedback, you are welcome to [open a GitHub issue](https://github.com/dpuse/dpuse-connector-file-store-emulator/issues) — feedback is read, but responses and fixes are at the maintainer's discretion.

## License

This project is licensed under the MIT License, permitting free use, modification, and distribution.

[MIT](./LICENSE) © 2026-present Jonathan Terrell

## Rust WebAssembly Helpers

The connector now ships with a lightweight Rust crate located in [rust/dpuse-connector-file-store-emulator-core](rust/dpuse-connector-file-store-emulator-core). It is compiled to WebAssembly with `wasm-pack` so TypeScript can call native Rust logic.

- Run `npm run build:rust` (requires the [`wasm-pack` CLI](https://rustwasm.github.io/wasm-pack/installer/)) whenever you change the Rust sources. The command rebuilds the package into [rust/dpuse-connector-file-store-emulator-core/pkg](rust/dpuse-connector-file-store-emulator-core/pkg).
- The async wrapper in [src/rustBridge.ts](src/rustBridge.ts) lazy-loads the generated bindings and surfaces helpers like `addNumbersWithRust()` and `checksumWithRust()`.
- `FileStoreEmulatorConnector` exposes `addUsingRust()` and `versionChecksumUsingRust()` so consumers can exercise the Rust-backed functionality without dealing with low-level WebAssembly plumbing.
