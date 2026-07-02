// ── External Dependencies & Registrations
import { dpuseESLintConfig } from '@dpuse/eslint-config-dpuse';
import type { Linter } from 'eslint';

// ── ESLint Configuration ─────────────────────────────────────────────────────────────────────────────────────────────

const config: Linter.Config[] = dpuseESLintConfig({
    files: ['eslint.config.ts', 'src/**/*.ts', 'vite.config.ts', 'vitest.config.ts'],
    ignores: ['rust/**'],
    importCoreModules: ['cloudflare:workers'],
    tsconfigPath: './tsconfig.json',
    tsconfigRootDir: import.meta.dirname,
    rules: {}
});

export default config;
