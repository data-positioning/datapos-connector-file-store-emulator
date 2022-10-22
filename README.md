# Data Positioning Application - Data Connector - File Store Emulator

The File Store Emulator data connector for the Data Positioning Application (DPA).

## IDE Setup

Visual Studio Code with the following extensions: [Code Spell Checker](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker), [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) and [Prettier - Code Formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode).

## Project Install

```sh
cd [parent directory]
git clone https://github.com/dataposapp/dataposapp-connector-data-file-store-emulator.git
```

## Project Commands

| Name                      | Key Code    | Notes                                         |
| ------------------------- | ----------- | --------------------------------------------- |
| Build                     | cmd+shift+B | Type-Check, Compile and Minify for Production |
| Engine Update             | cmd+shift+E |                                               |
| Lint                      | cmd+shift+L | [ESLint](https://eslint.org/)                 |
| Sync with Github          | cmd+shift+S |                                               |
| Test                      | cmd+shift+T |                                               |
| Identify Licenses         | cmd+shift+I |                                               |
| Release                   | cmd+shift+R |                                               |
| NPM Publish               | cmd+shift+N |                                               |
| Quick Open, Go to File... | cmd+P       |                                               |
| Show Command Palette      | cmd+shift+P |                                               |

## Useful NPM/NPX Commands

| Command                           | Notes                                                                            |
| --------------------------------- | -------------------------------------------------------------------------------- |
| npm audit                         |                                                                                  |
| npm outdated                      |                                                                                  |
| npm install "package name"@latest |                                                                                  |
| npx depcheck                      |                                                                                  |
| npm update [--save]               | NOT RECOMMENDED. To update package.json version numbers, append the --save flag. |

## Issues

1. Updating to the latest version of Rollup (v3.0.0 or later) generates plugin dependency errors. Appear to be in '@rollup/plugin-commonjs' and 'rollup-plugin-terser'. Staying with latest version 2 release (2.79.1) for time being.
