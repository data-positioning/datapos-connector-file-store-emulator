/**
 * @author Jonathan Terrell <terrell.jm@gmail.com>
 * @copyright 2022 Jonathan Terrell
 * @file rollup.config-es.js
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
                file: `./dist/${config.id}-es.js`,
                format: 'es'
            }
        ],
        plugins: [json(), typescript(), terser()]
    }
];
