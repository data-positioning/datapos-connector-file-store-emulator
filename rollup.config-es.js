/**
 * @author Jonathan Terrell <terrell.jm@gmail.com>
 * @copyright 2022 Jonathan Terrell
 * @file dataposapp-connector-data-file-store-emulator/rollup.config-es.js
 * @license ISC
 */

import commonjs from '@rollup/plugin-commonjs';
import config from './src/config.json';
import nodeResolve from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';
import pkg from './package.json';
import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';

export default [
    {
        external: [],
        input: pkg.main,
        output: [
            {
                exports: 'auto',
                file: `./dist/${config.id}-es.js`,
                format: 'es'
            }
        ],
        plugins: [nodeResolve({ browser: true }), commonjs(), json(), typescript()]
    }
];
