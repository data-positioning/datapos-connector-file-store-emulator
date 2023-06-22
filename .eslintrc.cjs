/**
 * @file datapos-workbench-vue/eslintrc.cjs
 * @description ESlint configuration file.
 * @license ISC Licensed under the ISC license, Version 2.0. See the LICENSE.md file for details.
 * @author Jonathan Terrell <terrell.jm@gmail.com>
 * @copyright 2023 Jonathan Terrell
 */

// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

module.exports = {
    env: { browser: true, node: true },
    extends: ['eslint:recommended'],
    globals: {},
    overrides: [
        { files: ['*.js'], parser: 'espree' }, // Use the default parser for JavaScript files.
        { files: ['**/*.ts'], extends: ['plugin:@typescript-eslint/recommended', 'plugin:@typescript-eslint/recommended-requiring-type-checking'] }
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: { ecmaVersion: 'latest', sourceType: 'module', project: './tsconfig.json', tsconfigRootDir: '.' },
    plugins: ['@typescript-eslint', 'import'],
    root: true,
    rules: {
        'no-unused-vars': 'warn',
        'sort-imports': ['warn', { allowSeparatedGroups: true, ignoreCase: true, memberSyntaxSortOrder: ['none', 'all', 'single', 'multiple'] }],
        '@typescript-eslint/consistent-type-imports': 'error',
        '@typescript-eslint/no-import-type-side-effects': 'error',
        'import/consistent-type-specifier-style': 'error',
        'import/no-duplicates': ['error', { 'prefer-inline': true }]
    }
};
