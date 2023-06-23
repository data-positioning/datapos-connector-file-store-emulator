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
            fileName: (format) => `${config.id}-${format}.js`
        }
    },
    plugins: [dts({ outputDir: 'dist/types' })]
});
