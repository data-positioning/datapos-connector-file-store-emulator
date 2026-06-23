/**
 * Vitest configuration.
 */

// Dependencies - Vendor.
import { defineConfig } from 'vitest/config';
import path from 'node:path';

// Exposures - Configuration.
export default defineConfig({
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src')
        }
    },
    test: {
        globals: true,
        include: ['tests/**/*.test.ts'],
        environment: 'node'
    }
});
