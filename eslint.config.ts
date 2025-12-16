/**
 * ESLint configuration.
 */

// Dependencies - Framework.
import datapos from '@datapos/eslint-config-datapos';

// Exposures - Configuration.
export default [
    ...datapos,
    {
        settings: {
            'import/resolver': {
                typescript: {
                    project: './tsconfig.json' // Teach eslint-plugin-import about TS aliases.
                }
            }
        }
    }
];
