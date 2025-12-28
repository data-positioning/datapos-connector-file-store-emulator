/**
 * Vite configuration.
 */

// Dependencies - Vendor.
import dts from 'vite-plugin-dts'; // Emit .d.ts files alongside the bundle.
import Sonda from 'sonda/vite'; // Visualize bundle results with Sonda plugin.
import { visualizer } from 'rollup-plugin-visualizer'; // Generate bundle size report.
import wasm from 'vite-plugin-wasm'; // Allow bundling wasm modules emitted by wasm-pack.
import { defineConfig, type PluginOption } from 'vite'; // Core Vite API.
import { fileURLToPath, URL } from 'node:url'; // ESM-safe path helpers.

// Dependencies - Data,
import config from './config.json';

const wasmPlugin = wasm() as PluginOption;

// Exposures - Configuration.
export default defineConfig({
    base: '',
    build: {
        lib: {
            entry: fileURLToPath(new URL('src/index.ts', import.meta.url)), // Absolute entry path.
            fileName: (format) => `${config.id}.${format}.js`, // Bundle name derived from config identifier and format.
            formats: ['es'] // Only emit native ES modules.
        },
        rollupOptions: {
            external: [/^https:\/\/engine-eu\.datapos\.app\//],
            plugins: [
                Sonda({
                    filename: 'index', // Output file name.
                    format: 'html', // Output file format.
                    gzip: true, // Include gzip sizes.
                    brotli: true, // Include brotli sizes.
                    open: false, // Do not auto-open browser post-build.
                    outputDir: './bundle-analysis-reports/sonda' // Output directory.
                }), // Run Sonda analyser to generate additional bundle insights.
                visualizer({
                    filename: './bundle-analysis-reports/rollup-visualiser/index.html', // Output file path.
                    open: false, // Do not auto-open browser post-build.
                    gzipSize: true, // Include gzip sizes.
                    brotliSize: true // Include brotli sizes.
                })
            ]
        },
        sourcemap: true,
        target: 'ESNext'
    },
    plugins: [dts({ outDir: 'dist/types' }), wasmPlugin],
    resolve: {
        alias: {
            '~': fileURLToPath(new URL('./', import.meta.url)), // Base alias matching tsconfig.
            '@': fileURLToPath(new URL('src', import.meta.url)) // Source alias matching tsconfig.
        }
    }
});
