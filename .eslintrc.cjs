// Configuration
module.exports = {
    env: { browser: true, node: true, es2022: true },
    extends: ['eslint:recommended'],
    ignorePatterns: ['/dist/**/*'],
    overrides: [
        { files: ['*.js'], parser: 'espree' }, // Use the default parser for JavaScript files.
        { files: ['**/*.ts'], extends: ['plugin:@typescript-eslint/recommended', 'plugin:@typescript-eslint/recommended-requiring-type-checking'] }
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: { sourceType: 'module', project: './tsconfig.json', tsconfigRootDir: '.' },
    plugins: ['@typescript-eslint', 'import'],
    root: true,
    rules: {
        'import/consistent-type-specifier-style': 'error',
        'import/no-duplicates': ['error', { 'prefer-inline': true }],
        'sort-imports': ['warn', { allowSeparatedGroups: true, ignoreCase: true, memberSyntaxSortOrder: ['none', 'all', 'single', 'multiple'] }],

        'no-empty': 'warn',
        'no-unused-vars': 'warn',

        '@typescript-eslint/consistent-type-imports': 'error',
        '@typescript-eslint/no-import-type-side-effects': 'error'
    }
};
