# DPUse File Store Emulator Connector

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![OpenSSF Scorecard](https://api.scorecard.dev/projects/github.com/dpuse/dpuse-connector-file-store-emulator/badge)](https://scorecard.dev/viewer/?uri=github.com/dpuse/dpuse-connector-file-store-emulator)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=dpuse_dpuse-connector-file-store-emulator&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=dpuse_dpuse-connector-file-store-emulator)
<span><!-- OWASP_BADGES_START -->
[![OWASP](https://img.shields.io/badge/OWASP-passed-4CAF50)](https://dpuse.github.io/dpuse-connector-file-store-emulator/dependency-check-reports/dependency-check-report.html)
<!-- OWASP_BADGES_END --></span>

A TypeScript library that implements the File Store Emulator connector. It provides easy access to a curated set of files for demonstration and evaluation purposes.

## Rust WebAssembly Helpers

The connector now ships with a lightweight Rust crate located in [rust/dpuse-connector-file-store-emulator-core](rust/dpuse-connector-file-store-emulator-core). It is compiled to WebAssembly with `wasm-pack` so TypeScript can call native Rust logic.

- Run `npm run build:rust` (requires the [`wasm-pack` CLI](https://rustwasm.github.io/wasm-pack/installer/)) whenever you change the Rust sources. The command rebuilds the package into [rust/dpuse-connector-file-store-emulator-core/pkg](rust/dpuse-connector-file-store-emulator-core/pkg).
- The async wrapper in [src/rustBridge.ts](src/rustBridge.ts) lazy-loads the generated bindings and surfaces helpers like `addNumbersWithRust()` and `checksumWithRust()`.
- `FileStoreEmulatorConnector` exposes `addUsingRust()` and `versionChecksumUsingRust()` so consumers can exercise the Rust-backed functionality without dealing with low-level WebAssembly plumbing.

## Installation

There’s no need to install this connector manually. Once released, it’s uploaded to the DPUse Engine cloud and becomes instantly available to all new instances of the browser app. A notification about the new version is also sent to all existing browser apps.

## Reports & Compliance

### Dependency Check Report

The OWASP Dependency Check Report identifies known vulnerabilities in project dependencies. It is generated automatically on each release using the npm package `owasp-dependency-check`. We also rely on GitHub Dependabot to continuously check for vulnerabilities across all dependencies.

[View the OWASP Dependency Check Report](https://dpuse.github.io/dpuse-connector-file-store-emulator/dependency-check-reports/dependency-check-report.html)

### Dependency Licenses

The following table lists top-level production and peer dependencies. All these dependencies (including transitive ones) have been recursively verified to use Apache-2.0, CC0-1.0, or MIT—commercially friendly licenses with minimal restrictions. Developers cloning this repository should independently verify dev and optional dependencies; users of the uploaded library are covered by these checks.

<!-- DEPENDENCY_LICENSES_START -->
|Name|Type|Installed|Latest|Latest Released|Deps|Document|
|:-|:-|:-:|:-:|:-|-:|:-|
|@borewit/text-codec|MIT|0.2.2|0.2.2|3 months ago: 2026-03-11|n/a|[text-codec@0.2.2-LICENSE.txt](downloads/@borewit/text-codec@0.2.2-LICENSE.txt)|
|@dpuse/dpuse-connector-file-store-emulator|MIT|0.2.515|0.2.515|this month: 2026-06-21|n/a|[dpuse-connector-file-store-emulator@0.2.515-LICENSE.txt](downloads/@dpuse/dpuse-connector-file-store-emulator@0.2.515-LICENSE.txt)|
|@dpuse/dpuse-shared|MIT|0.3.674|0.3.674|this month: 2026-06-21|n/a|[dpuse-shared@0.3.674-LICENSE.txt](downloads/@dpuse/dpuse-shared@0.3.674-LICENSE.txt)|
|@dpuse/dpuse-tool-csv-parse|MIT|0.0.143|0.0.143|2 months ago: 2026-04-21|n/a|[dpuse-tool-csv-parse@0.0.143-LICENSE.txt](downloads/@dpuse/dpuse-tool-csv-parse@0.0.143-LICENSE.txt)|
|@dpuse/dpuse-tool-file-operators|MIT|0.0.24|0.0.24|1 month ago: 2026-04-23|n/a|[dpuse-tool-file-operators@0.0.24-LICENSE.txt](downloads/@dpuse/dpuse-tool-file-operators@0.0.24-LICENSE.txt)|
|@dpuse/dpuse-tool-rust-csv-core|MIT|0.1.21|0.1.21|2 months ago: 2026-04-21|n/a|[dpuse-tool-rust-csv-core@0.1.21-LICENSE.txt](downloads/@dpuse/dpuse-tool-rust-csv-core@0.1.21-LICENSE.txt)|
|@tokenizer/inflate|MIT|0.4.1|0.4.1|7 months ago: 2025-11-18 ⚠️|n/a|[inflate@0.4.1-LICENSE.txt](downloads/@tokenizer/inflate@0.4.1-LICENSE.txt)|
|@tokenizer/token|MIT|0.3.0|0.3.0|59 months ago: 2021-07-12❗|n/a|[token@0.3.0-LICENSE.txt](downloads/@tokenizer/token@0.3.0-LICENSE.txt)|
|chardet|MIT|2.1.1|2.1.1|7 months ago: 2025-10-29 ⚠️|n/a|[chardet@2.1.1-LICENSE.txt](downloads/chardet@2.1.1-LICENSE.txt)|
|csv-parse|MIT|6.2.1|6.2.1|3 months ago: 2026-03-20|n/a|[csv-parse@6.2.1-LICENSE.txt](downloads/csv-parse@6.2.1-LICENSE.txt)|
|debug|MIT|4.4.3|4.4.3|9 months ago: 2025-09-13 ⚠️|n/a|[debug@4.4.3-LICENSE.txt](downloads/debug@4.4.3-LICENSE.txt)|
|file-type|MIT|22.0.1|22.0.1|2 months ago: 2026-04-09|n/a|[file-type@22.0.1-LICENSE.txt](downloads/file-type@22.0.1-LICENSE.txt)|
|ieee754|BSD-3-Clause|1.2.1|1.2.1|67 months ago: 2020-10-27❗|n/a|[ieee754@1.2.1-LICENSE.txt](downloads/ieee754@1.2.1-LICENSE.txt)|
|ms|MIT|2.1.3|2.1.3|66 months ago: 2020-12-08❗|n/a|[ms@2.1.3-LICENSE.txt](downloads/ms@2.1.3-LICENSE.txt)|
|nanoid|MIT|5.1.15|5.1.15|this month: 2026-06-20|n/a|[nanoid@5.1.15-LICENSE.txt](downloads/nanoid@5.1.15-LICENSE.txt)|
|strtok3|MIT|10.3.5|10.3.5|3 months ago: 2026-03-21|n/a|[strtok3@10.3.5-LICENSE.txt](downloads/strtok3@10.3.5-LICENSE.txt)|
|token-types|MIT|6.1.2|6.1.2|5 months ago: 2026-01-01|n/a|[token-types@6.1.2-LICENSE.txt](downloads/token-types@6.1.2-LICENSE.txt)|
|uint8array-extras|MIT|1.5.0|1.5.0|10 months ago: 2025-08-22 ⚠️|n/a|[uint8array-extras@1.5.0-LICENSE.txt](downloads/uint8array-extras@1.5.0-LICENSE.txt)|

<!-- DEPENDENCY_LICENSES_END -->

**Installed dependencies are kept up-to-date with latest releases.**

### Bundle Analysis Report

The Bundle Analysis Report provides a detailed breakdown of the bundle's composition and module sizes, helping to identify which modules contribute most to the final build. It is generated automatically on each release using the npm package `rollup-plugin-visualizer`.

[View the Bundle Analysis Report](https://dpuse.github.io/dpuse-connector-file-store-emulator/stats/index.html)

## Repository Management Commands

The following list details the repository management commands implementation by this project. For more details, please refer to the scripts section of the 'package.json' file in this project.

| Name                 | VSCode Shortcuts | Notes                                                                                                    |
| -------------------- | ---------------- | -------------------------------------------------------------------------------------------------------- |
| audit                | alt+ctrl+shift+a | Audit the project's dependencies for known security vulnerabilities.                                     |
| build                | alt+ctrl+shift+b | Type-check, compile and minify for production. Output in '/dist' directory.                              |
| build:rust           |                  | Compile the Rust helper crate to WebAssembly via `wasm-pack`. Requires the `wasm-pack` CLI in your PATH. |
| buildConnectorConfig |                  |                                                                                                          |
| bumpVersion          | alt+ctrl+shift+v |                                                                                                          |
| check                | alt+ctrl+shift+c | List the dependencies in the project that are outdated.                                                  |
| document             | alt+ctrl+shift+d | Identify the licenses of the project's dependencies.                                                     |
| format               | alt+ctrl+shift+f | Enforce formatting style rules.                                                                          |
| lint                 | alt+ctrl+shift+l | Check the code for potential errors and enforces coding styles.                                          |
| publishToNPM         | alt+ctrl+shift+p | ❌ Not implemented.                                                                                      |
| release              | alt+ctrl+shift+r | Synchronise local repository with the main GitHub repository and upload connector to PDUse platform.     |
| syncWithGitHub       | alt+ctrl+shift+s | Synchronise local repository with the main GitHub repository.                                            |
| updateDependencies   | alt+ctrl+shift+l | Install the latest version of all DPUse dependencies.                                                    |

## Compliance

The following badge reflects an assessment of this repository's open-source practices.

### SonarCube

[![Quality gate](https://sonarcloud.io/api/project_badges/quality_gate?project=dpuse_dpuse-connector-file-store-emulator)](https://sonarcloud.io/summary/new_code?id=dpuse_dpuse-connector-file-store-emulator)

### OpenSSF Scorecard

[Scorecard](https://scorecard.dev/viewer/?uri=github.com/dpuse/dpuse-connector-file-store-emulator)

## License

[MIT](./LICENSE) © 2026-present Jonathan Terrell
