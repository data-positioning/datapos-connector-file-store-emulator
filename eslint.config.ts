/**
 * ESLint configuration.
 */

/** Dependencies - Framework. */
import datapos from '@datapos/eslint-config-datapos';

/** Exposures - Configuration. */
export default [
    ...datapos,
    {
        rules: {
            '@typescript-eslint/no-confusing-void-expression': 'off'
        }
    }
];
