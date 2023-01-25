# Data Positioning File Store Emulator (Data Connector)

This repository contains the File Store Emulator data connector.

## Installation

```
npm install @datapos/datapos-connector-data-file-store-emulator
```

## Repository Management Commands

The following commands are available for repository management. For implementation details, see the [Grunt](https://gruntjs.com/) configuration file (gruntfile.js).

| Name                    | Key Code    | Notes                                                                                                                                                    |
| ----------------------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Identify Licenses       | cmd+shift+i | Identify licenses for all dependencies.                                                                                                                  |
| Lint                    | cmd+shift+l | Run [ESLint](https://eslint.org/) against the local repository.                                                                                          |
| Publish to NPM          | cmd+shift+n | Publish to [npm](https://www.npmjs.com/). Requires prior synchronisation. Use the command line command 'npm publish' when publishing for the first time. |
| Release                 | cmd+shift+r | Synchronise the local repository with the GitHub repository and publish to [npm](https://www.npmjs.com/).                                                |
| Synchronise with GitHub | cmd+shift+s | Synchronise the local repository with the GitHub repository.                                                                                             |

## IDE Setup

[Visual Studio Code](https://code.visualstudio.com/) with the following extensions: [Code Spell Checker](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker), [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) and [Prettier - Code Formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode).

## Project Install

```sh
cd [parent directory]
git clone https://github.com/datapos/datapos-connector-data-file-store-emulator.git
```

## Project Commands

| Name                      | Key Code    | Notes                                                                      |
| ------------------------- | ----------- | -------------------------------------------------------------------------- |
| Build                     | cmd+shift+B | Type-Check, Compile and Minify for Production                              |
| Engine Update             | cmd+shift+E |                                                                            |
| Lint                      | cmd+shift+L | [ESLint](https://eslint.org/)                                              |
| Sync with Github          | cmd+shift+S |                                                                            |
| Test                      | cmd+shift+T |                                                                            |
| Identify Licenses         | cmd+shift+I |                                                                            |
| Release                   | cmd+shift+R | Use command line command 'npm publish' when publishing for the first time. |
| NPM Publish               | cmd+shift+N |                                                                            |
| Quick Open, Go to File... | cmd+P       |                                                                            |
| Show Command Palette      | cmd+shift+P |                                                                            |

## Useful NPM/NPX Commands

| Command                           | Notes                                                                            |
| --------------------------------- | -------------------------------------------------------------------------------- |
| npm audit [fix]                   |                                                                                  |
| npm outdated                      |                                                                                  |
| npm install "package name"@latest |                                                                                  |
| npx depcheck                      |                                                                                  |
| npm update [--save]               | NOT RECOMMENDED. To update package.json version numbers, append the --save flag. |

## Issues

1. Updating to the latest version of Rollup (v3.0.0 or later) generates plugin dependency errors. Appear to be in '@rollup/plugin-commonjs' and 'rollup-plugin-terser'. Staying with latest version 2 release (2.79.1) for time being.
