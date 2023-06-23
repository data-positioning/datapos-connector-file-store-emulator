// TODO: Consider using 'rollup-plugin-esbuild' and 'rollup-plugin-dts' to build distribution. See https://blog.logrocket.com/using-rollup-package-library-typescript-javascript/.
// TODO: Not possible until rollup is upgraded (version3 or later). Updating to the latest version of Rollup (v3.0.0 or later) generates plugin dependency errors.
// Appear to be in '@rollup/plugin-commonjs' and 'rollup-plugin-terser'. Staying with latest version 2 release (2.79.1) for time being. Maybe we should move to Vite?

// TODO: Upgrade syntax for JSON file imports. See: https://rollupjs.org/guide/en/#importing-packagejson.
// The latest syntax (line below) triggers a VSCode ESlint error, so temporarily using older 'require' syntax.
// import config from './src/config.json' assert { type: 'json' };
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const config = require('./src/config.json');

// Dependencies - Framework/Vendor
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import nodeResolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import typescript from 'rollup-plugin-typescript2';

// Configuration: Generate ES module bundle.
export default [
    {
        input: 'src/index.ts',
        output: [{ exports: 'auto', file: `./dist/${config.id}-es.js`, format: 'es' }],
        plugins: [nodeResolve(), commonjs(), json(), typescript(), terser({ output: { comments: false } })]
    }
];
