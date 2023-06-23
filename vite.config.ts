// Dependencies - Framework/Vendor
import config from './src/config.json';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

// Configuration.
export default defineConfig({
    build: {
        target: 'ESNext',
        lib: {
            entry: resolve('src/index.ts'),
            name: 'DataPosEngine',
            formats: ['es'],
            fileName: (format) => {
                console.log(`${config.id}-${format}.js`, config, format);
                return `${config.id}.${format}.js`;
            } // ./dist/${config.id}-es.js
        }
    },
    plugins: [dts({ outputDir: 'dist/types' })]
});
