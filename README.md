# DPUse File Store Emulator Connector

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![OpenSSF Best Practices](https://www.bestpractices.dev/projects/13327/badge)](https://www.bestpractices.dev/projects/13327)
[![OpenSSF Scorecard](https://api.scorecard.dev/projects/github.com/dpuse/dpuse-connector-file-store-emulator/badge)](https://scorecard.dev/viewer/?uri=github.com/dpuse/dpuse-connector-file-store-emulator)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=dpuse_dpuse-connector-file-store-emulator&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=dpuse_dpuse-connector-file-store-emulator)
<span><!-- OWASP_BADGES_START -->
[![OWASP](https://img.shields.io/badge/OWASP-passed-4CAF50)](https://dpuse.github.io/dpuse-connector-file-store-emulator/dependency-check-reports/dependency-check-report.html)

<!-- OWASP_BADGES_END --></span>

A TypeScript library that implements the File Store Emulator Connector.

Provides access to a sample set of read-only data simulating a hypothetical cloud-based file storage solution. It is intended for demonstration, evaluation, and testing and is freely available to all users.

It emulates services such as Google Drive, Dropbox, and Microsoft OneDrive.

## Installation

There’s no need to install this connector manually. Once released, it is uploaded to the DPUse Engine cloud and becomes instantly available to all new browser app instances. A notification about the new version is also sent to all existing browser apps.

Besides using the connector from the DPUse Engine cloud, developers can clone this repository to build a replacement or use it as the basis for a new connector.

## Reports & Compliance

### Dependency Check Report

The OWASP Dependency Check Report identifies known vulnerabilities in project dependencies. It is generated automatically on each release using the npm package `owasp-dependency-check`. We also rely on GitHub Dependabot to continuously check for vulnerabilities across all dependencies.

[View the OWASP Dependency Check Report](https://dpuse.github.io/dpuse-connector-file-store-emulator/dependency-check-reports/dependency-check-report.html)

### Dependency Licenses

The following table lists all production dependencies. These dependencies (including transitive ones) have been checked and confirmed to use Apache-2.0, BSD-3-Clause, CC0-1.0, or MIT — all permissive, commercially-friendly licenses. Developers cloning this repository should independently verify development dependencies; users of the uploaded library are covered by these checks.

<!-- DEPENDENCY_LICENSES_START -->

| Name                                                                                                       | Version | License(s)   | Document                                                                                     |
| ---------------------------------------------------------------------------------------------------------- | :-----: | ------------ | -------------------------------------------------------------------------------------------- |
| [@borewit/text-codec](https://github.com/Borewit/text-codec)                                               |  0.2.2  | MIT          | [LICENSE](licenses/downloads/@borewit/text-codec@0.2.2-LICENSE.txt)                          |
| [@dpuse/dpuse-connector-file-store-emulator](https://github.com/dpuse/dpuse-connector-file-store-emulator) | 0.2.531 | MIT          | [LICENSE](licenses/downloads/@dpuse/dpuse-connector-file-store-emulator@0.2.531-LICENSE.txt) |
| [@dpuse/dpuse-shared](https://github.com/data-positioning/dpuse-shared)                                    | 0.3.674 | MIT          | [LICENSE](licenses/downloads/@dpuse/dpuse-shared@0.3.674-LICENSE.txt)                        |
| [@dpuse/dpuse-tool-csv-parse](https://github.com/dpuse/dpuse-tool-csv-parse)                               | 0.0.143 | MIT          | [LICENSE](licenses/downloads/@dpuse/dpuse-tool-csv-parse@0.0.143-LICENSE.txt)                |
| [@dpuse/dpuse-tool-file-operators](https://github.com/dpuse/dpuse-tool-file-operators)                     | 0.0.24  | MIT          | [LICENSE](licenses/downloads/@dpuse/dpuse-tool-file-operators@0.0.24-LICENSE.txt)            |
| [@dpuse/dpuse-tool-rust-csv-core](https://github.com/dpuse/dpuse-tool-rust-csv-core)                       | 0.1.21  | MIT          | [LICENSE](licenses/downloads/@dpuse/dpuse-tool-rust-csv-core@0.1.21-LICENSE.txt)             |
| [@tokenizer/inflate](https://github.com/Borewit/tokenizer-inflate)                                         |  0.4.1  | MIT          | [LICENSE](licenses/downloads/@tokenizer/inflate@0.4.1-LICENSE.txt)                           |
| [@tokenizer/token](https://github.com/Borewit/tokenizer-token)                                             |  0.3.0  | MIT          | [LICENSE](licenses/downloads/@tokenizer/token@0.3.0-LICENSE.txt)                             |
| [chardet](https://github.com/runk/node-chardet)                                                            |  2.1.1  | MIT          | [LICENSE](licenses/downloads/chardet@2.1.1-LICENSE.txt)                                      |
| [csv-parse](https://github.com/adaltas/node-csv)                                                           |  6.2.1  | MIT          | [LICENSE](licenses/downloads/csv-parse@6.2.1-LICENSE.txt)                                    |
| [debug](https://github.com/debug-js/debug)                                                                 |  4.4.3  | MIT          | [LICENSE](licenses/downloads/debug@4.4.3-LICENSE.txt)                                        |
| [file-type](https://github.com/sindresorhus/file-type)                                                     | 22.0.1  | MIT          | [LICENSE](licenses/downloads/file-type@22.0.1-LICENSE.txt)                                   |
| [ieee754](https://github.com/feross/ieee754)                                                               |  1.2.1  | BSD-3-Clause | [LICENSE](licenses/downloads/ieee754@1.2.1-LICENSE.txt)                                      |
| [ms](https://github.com/vercel/ms)                                                                         |  2.1.3  | MIT          | [LICENSE](licenses/downloads/ms@2.1.3-LICENSE.txt)                                           |
| [nanoid](https://github.com/ai/nanoid)                                                                     | 5.1.15  | MIT          | [LICENSE](licenses/downloads/nanoid@5.1.15-LICENSE.txt)                                      |
| [strtok3](https://github.com/Borewit/strtok3)                                                              | 10.3.5  | MIT          | [LICENSE](licenses/downloads/strtok3@10.3.5-LICENSE.txt)                                     |
| [token-types](https://github.com/Borewit/token-types)                                                      |  6.1.2  | MIT          | [LICENSE](licenses/downloads/token-types@6.1.2-LICENSE.txt)                                  |
| [uint8array-extras](https://github.com/sindresorhus/uint8array-extras)                                     |  1.5.0  | MIT          | [LICENSE](licenses/downloads/uint8array-extras@1.5.0-LICENSE.txt)                            |

<!-- DEPENDENCY_LICENSES_END -->

The dependency tree below lists every package in this project — direct and transitive — along with its installed version, release date, and update status. Packages flagged ❗ have a newer version available; ⚠️ indicates a package that hasn't been updated in the last 6 months or longer. Neither flag necessarily indicates a problem: we let new releases stabilise before upgrading, and some packages are simply mature and stable, requiring no active development.

<!-- DEPENDENCY_TREE_START -->

- **[@dpuse/dpuse-shared](https://github.com/data-positioning/dpuse-shared)** 0.3.674 — this month: 2026-06-21
- **[@dpuse/dpuse-tool-csv-parse](https://github.com/dpuse/dpuse-tool-csv-parse)** 0.0.143 — 2 months ago: 2026-04-21
    - **[@dpuse/dpuse-shared](https://github.com/data-positioning/dpuse-shared)** 0.3.674 — this month: 2026-06-21
    - **[csv-parse](https://github.com/adaltas/node-csv)** 6.2.1 — 3 months ago: 2026-03-20 → **latest**: 7.0.0 — this month: 2026-06-14 ❗
- **[@dpuse/dpuse-tool-file-operators](https://github.com/dpuse/dpuse-tool-file-operators)** 0.0.24 — 1 month ago: 2026-04-23
    - **[@dpuse/dpuse-shared](https://github.com/data-positioning/dpuse-shared)** 0.3.674 — this month: 2026-06-21
    - **[chardet](https://github.com/runk/node-chardet)** 2.1.1 — 7 months ago: 2025-10-29 ⚠️ → **latest**: 2.2.0 — this month: 2026-06-20 ❗
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
            - **[ieee754](https://github.com/feross/ieee754)** 1.2.1 — 67 months ago: 2020-10-27 ⚠️
        - **[uint8array-extras](https://github.com/sindresorhus/uint8array-extras)** 1.5.0 — 10 months ago: 2025-08-22 ⚠️
- **[@dpuse/dpuse-tool-rust-csv-core](https://github.com/dpuse/dpuse-tool-rust-csv-core)** 0.1.21 — 2 months ago: 2026-04-21
    - **[@dpuse/dpuse-shared](https://github.com/data-positioning/dpuse-shared)** 0.3.674 — this month: 2026-06-21
- **[nanoid](https://github.com/ai/nanoid)** 5.1.15 — this month: 2026-06-20
      <!-- DEPENDENCY_TREE_END -->

### Bundle Analysis Reports

The Bundle Analysis Reports provide detailed breakdowns of the bundle's composition and module sizes, helping to identify which modules contribute most to the final build. Two complementary reports are generated automatically on each release:

- **[rollup-plugin-visualizer](https://github.com/btd/rollup-plugin-visualizer/tree/master)** — generates a static treemap/sunburst view based on pre-build module estimates, useful for a quick visual scan of overall bundle composition, including CSS assets.
- **[Sonda](https://sonda.dev/)** — analyses final source maps to capture the effects of tree-shaking and minification, rather than relying on pre-build estimates. This gives a more accurate picture of what's actually shipped, traces module-level dependencies, and shows the size of each module after tree-shaking and minification for more precise insight into what's driving bundle size. Note: Sonda's Vite reports currently exclude CSS files, since Vite does not generate source maps for CSS.

[View the rollup-plugin-visualizer Report](https://dpuse.github.io/dpuse-connector-file-store-emulator/bundle-analysis-reports/rollup-visualiser/index.html).

[View the Sonda Report](https://dpuse.github.io/dpuse-connector-file-store-emulator/bundle-analysis-reports/sonda/index.html).

## Compliance

The following badge reflects an assessment of this repository's open-source practices.

### SonarCube

[![Quality gate](https://sonarcloud.io/api/project_badges/quality_gate?project=dpuse_dpuse-connector-file-store-emulator)](https://sonarcloud.io/summary/new_code?id=dpuse_dpuse-connector-file-store-emulator)

### OpenSSF Scorecard

[Scorecard](https://scorecard.dev/viewer/?uri=github.com/dpuse/dpuse-connector-file-store-emulator)

## License

[MIT](./LICENSE) © 2026-present Jonathan Terrell

## Rust WebAssembly Helpers

The connector now ships with a lightweight Rust crate located in [rust/dpuse-connector-file-store-emulator-core](rust/dpuse-connector-file-store-emulator-core). It is compiled to WebAssembly with `wasm-pack` so TypeScript can call native Rust logic.

- Run `npm run build:rust` (requires the [`wasm-pack` CLI](https://rustwasm.github.io/wasm-pack/installer/)) whenever you change the Rust sources. The command rebuilds the package into [rust/dpuse-connector-file-store-emulator-core/pkg](rust/dpuse-connector-file-store-emulator-core/pkg).
- The async wrapper in [src/rustBridge.ts](src/rustBridge.ts) lazy-loads the generated bindings and surfaces helpers like `addNumbersWithRust()` and `checksumWithRust()`.
- `FileStoreEmulatorConnector` exposes `addUsingRust()` and `versionChecksumUsingRust()` so consumers can exercise the Rust-backed functionality without dealing with low-level WebAssembly plumbing.
