/**
 * @author Jonathan Terrell <terrell.jm@gmail.com>
 * @copyright 2022 Jonathan Terrell
 * @file rollup.config-cjs.js
 * @license "ISC"
 */

import config from './src/config.json';
import json from '@rollup/plugin-json';
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
                file: `./dist/${config.id}-cjs.js`,
                format: 'cjs'
            }
        ],
        plugins: [json(), typescript(), terser()]
    }
];
