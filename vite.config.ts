// Dependencies - Vendor.
import config from './config.json';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

// Exposures - Configuration.
export default defineConfig({
    build: {
        lib: {
            entry: resolve('src/index.ts'),
            name: 'DataposFileStoreEmulatorConnector',
            formats: ['es'],
            fileName: (format: string) => `${config.id}.${format}.js`
        },
        target: 'ESNext'
    },
    plugins: [dts({ outDir: 'dist/types' })],
    resolve: {
        alias: { '~': resolve(__dirname, '.'), '@': resolve(__dirname, 'src') }
    }
});
