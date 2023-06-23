// Dependencies - Framework/Vendor
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
            fileName: (format) => `datapos-engine-support.${format}.js`
        }
    },
    plugins: [dts({ outputDir: 'dist/types' })]
});
