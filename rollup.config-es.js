/**
 * @author Jonathan Terrell <jonathan.terrell@springbrook.es>
 * @copyright Copyright (c) 2019-2021 Springbrook S.L.
 * @license "ISC"
 */

// import commonjs from '@rollup/plugin-commonjs';
// import json from '@rollup/plugin-json';
// import nodePolyfills from 'rollup-plugin-node-polyfills';
// import nodeResolve from '@rollup/plugin-node-resolve';
import pkg from './package.json';
import typescript from 'rollup-plugin-typescript2';

export default [
    {
        external: [],
        input: pkg.main,
        output: [
            {
                exports: 'auto',
                file: './dist/nectis-connector-sample-files-es.js',
                format: 'es'
            }
        ],
        plugins: [/* json(), nodeResolve({ browser: true, preferBuiltins: false }), commonjs(), nodePolyfills(), */ typescript()]
    }
];
