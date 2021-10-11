/**
 * @author Jonathan Terrell <jonathan.terrell@springbrook.es>
 * @copyright Copyright (c) 2019-2021 Springbrook S.L.
 * @license "Apache-2.0 with Commons Clause"
 */

import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import nodeResolve from '@rollup/plugin-node-resolve';
import pkg from './package.json';
import typescript from 'rollup-plugin-typescript2';

// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

export default [
    {
        external: [],
        input: pkg.main,
        output: [
            {
                exports: 'auto',
                file: './dist/nectis-connector-sample-files-cjs.js',
                format: 'cjs'
            }
        ],
        plugins: [json(), nodeResolve({ preferBuiltins: true }), commonjs(), typescript()]
    }
];
