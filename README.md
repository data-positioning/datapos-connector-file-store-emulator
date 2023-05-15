# Data Positioning File Store Emulator Data Connector

This repository contains the File Store Emulator data connector.

## Installation

The Data Positioning Engine automatically downloads the connector associated with a given connection at runtime.

## Repository Management Commands

The following list details the common repository management commands implementation for this project. For more details, please refer to the [Grunt](https://gruntjs.com/) configuration file (gruntfile.js) in this project.

| Name        | Key Code         | Notes                                                                                                               |
| ----------- | ---------------- | ------------------------------------------------------------------------------------------------------------------- |
| Audit       | alt+ctrl+shift+a | Audit the project's dependencies for known security vulnerabilities.                                                |
| Build       | alt+ctrl+shift+b | Type-check, compile and minify for production. Output in '/dist' directory.                                         |
| Check       | alt+ctrl+shift+c | List the dependencies in the project that are outdated.                                                             |
| Document    | alt+ctrl+shift+d | Identify the licenses of the project's dependencies.                                                                |
| Format      | alt+ctrl+shift+f | NOT implemented.                                                                                                    |
| Lint        | alt+ctrl+shift+l | Check the code for potential errors and enforces coding styles.                                                     |
| Migrate     | alt+ctrl+shift+l | Install latest version of dependencies.                                                                             |
| Publish     | alt+ctrl+shift+n | NOT implemented.                                                                                                    |
| Release     | alt+ctrl+shift+r | Synchronise the local repository with the main GitHub repository and upload connector to Data Positioning platform. |
| Synchronise | alt+ctrl+shift+s | Synchronise the local repository with the main GitHub repository.                                                   |
| Test        | alt+ctrl+shift+l | NOT implemented.                                                                                                    |
| Update      | alt+ctrl+shift+l | Install the latest version of Data Positioning dependencies.                                                        |

## Issues

1. Updating to the latest version of Rollup (v3.0.0 or later) generates plugin dependency errors. Appear to be in '@rollup/plugin-commonjs' and 'rollup-plugin-terser'. Staying with latest version 2 release (2.79.1) for time being. Maybe we should move to Vite?
