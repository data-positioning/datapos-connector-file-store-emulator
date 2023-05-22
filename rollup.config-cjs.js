/**
 * @file datapos-connector-data-file-store-emulator/rollup.config-cjs.js
 * @description Rollup configuration file for generating CJS module bundle of the data file store emulator connector.
 * @license ISC Licensed under the ISC license, Version 2.0. See the LICENSE.md file for details.
 * @author Jonathan Terrell <terrell.jm@gmail.com>
 * @copyright 2023 Jonathan Terrell
 */

// TODO: Upgrade syntax for JSON file imports. See: https://rollupjs.org/guide/en/#importing-packagejson.
// The latest syntax (line below) triggers a VSCode ESlint error, so temporarily using older 'require' syntax.
// import config from './src/config.json' assert { type: 'json' };
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const config = require('./src/config.json');

import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import nodeResolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import typescript from 'rollup-plugin-typescript2';

export default [
    {
        input: 'src/index.ts',
        output: [
            {
                exports: 'auto',
                file: `./dist/${config.id}-cjs.js`,
                format: 'cjs'
            }
        ],
        plugins: [nodeResolve(), commonjs(), json(), typescript(), terser({ output: { comments: false } })]
    }
];
