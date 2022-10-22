# Data Positioning Application - Data Connector - File Store Emulator

...

## IDE Setup

Visual Studio Code with the following extensions: [Code Spell Checker](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker), [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) and [Prettier - Code Formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode).

## Project Install

```sh
cd [parent directory]
git clone https://github.com/dataposapp/dataposapp-connector-data-file-store-emulator.git
```

## Project Commands

| Name              | Key Code    | Notes                                         |
| ----------------- | ----------- | --------------------------------------------- |
| Build             | cmd/shift/B | Type-Check, Compile and Minify for Production |
| Engine Update     | cmd/shift/E |                                               |
| Lint              | cmd/shift/L |                                               |
| Sync with Github  | cmd/shift/S |                                               |
| Test              | cmd/shift/T |                                               |
| Identify Licenses | cmd/shift/I |                                               |
| Release           | cmd/shift/R |                                               |
| Publish to NPM    | cmd/shift/N |                                               |
|                   | cmd/shift/P |                                               |

## NPM/NPX Commands

| Command                           |
| --------------------------------- |
| npm audit                         |
| npm outdated                      |
| npm install "package name"@latest |
| npx depcheck                      |

## Issues

1. Updating to the latest version of Rollup (v3.0.0 or later) generates plugin dependency errors. Appear to be in '@rollup/plugin-commonjs' and 'rollup-plugin-terser'. Staying with latest version 2 release (2.79.1) for time being.
