/**
 * @author Jonathan Terrell <terrell.jm@gmail.com>
 * @copyright 2022 Jonathan Terrell
 * @file dataposapp-connector-data-file-store-emulator/rollup.config-iife.js
 * @license ISC
 */

import camelcase from 'lodash.camelcase';
import config from './src/config.json';
import json from '@rollup/plugin-json';
import pkg from './package.json';
import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';

export default [
    {
        external: ['@dataposapp/dataposapp-engine-main'],
        input: pkg.main,
        output: [
            {
                exports: 'auto',
                file: `./dist/${config.id}-iife.js`,
                format: 'iife',
                name: camelcase(config.id)
            }
        ],
        plugins: [json(), typescript(), terser({ output: { comments: false } })]
    }
];
