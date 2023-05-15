/**
 * @file datapos-connector-data-file-store-emulator/rollup.config-iife.js
 * @description Rollup configuration file for generating IIFE module bundle of the data file store emulator connector.
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

import camelcase from 'lodash.camelcase';
import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';
import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';

export default [
    {
        input: 'src/index.ts',
        output: [
            {
                exports: 'auto',
                file: `./dist/${config.id}-iife.js`,
                format: 'iife',
                name: camelcase(config.id)
            }
        ],
        plugins: [nodeResolve({ browser: true }), commonjs(), json(), typescript(), terser({ output: { comments: false } })]
    }
];
