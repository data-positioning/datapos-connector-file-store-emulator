/**
 * Vite configuration.
 */

// Dependencies - Vendor.
import config from './config.json';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { resolve } from 'node:path';
import { visualizer } from 'rollup-plugin-visualizer';

// Exposures - Configuration.
export default defineConfig({
    base: 'https://engine-eu.datapos.app/',
    build: {
        lib: {
            entry: resolve('src/index.ts'),
            name: 'DataposFileStoreEmulatorConnector',
            formats: ['es'],
            fileName: (format: string) => `${config.id}.${format}.js`
        },
        rollupOptions: {
            external: [/^https:\/\/engine-eu\.datapos\.app\//],
            plugins: [
                visualizer({
                    filename: 'stats/index.html', // HTML report.
                    open: false, // Automatically opens in browser.
                    gzipSize: true, // Show gzip sizes.
                    brotliSize: true // Show brotli sizes.
                })
            ]
        },
        target: 'ESNext'
    },
    plugins: [dts({ outDir: 'dist/types' })],
    resolve: {
        alias: {
            '~': resolve(__dirname, '.'),
            '@': resolve(__dirname, 'src')
        }
    }
});
