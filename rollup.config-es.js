/**
 * @author Jonathan Terrell <terrell.jm@gmail.com>
 * @copyright 2022 Jonathan Terrell
 * @file dataposapp-connector-data-sample-files/rollup.config-es.js
 * @license ISC
 */

import commonJS from '@rollup/plugin-commonjs';
import config from './src/config.json';
import json from '@rollup/plugin-json';
import nodeResolve from '@rollup/plugin-node-resolve';
import pkg from './package.json';
import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';

export default [
    {
        external: ['chardet'],
        input: pkg.main,
        output: [
            {
                exports: 'auto',
                file: `./dist/${config.id}-es.js`,
                format: 'es'
            }
        ],
        plugins: [commonJS(), json(), nodeResolve(), typescript(), terser({ output: { comments: false } })]
    }
];
