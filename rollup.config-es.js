/**
 * @author Jonathan Terrell <jonathan.terrell@springbrook.es>
 * @copyright Copyright (c) 2019-2021 Springbrook S.L.
 * @license "ISC"
 */

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
                file: './dist/nectis-connector-data-sample-files-es.js',
                format: 'es'
            }
        ],
        plugins: [typescript(), terser()]
    }
];
