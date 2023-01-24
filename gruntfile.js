/**
 * @author Jonathan Terrell <terrell.jm@gmail.com>
 * @copyright 2022 Jonathan Terrell
 * @file datapos-connector-data-file-store-emulator/gruntfile.js
 * @license ISC
 */

// TODO: See new formatting in datapos-content. Has been implemented here, but needs to be implemented in all other connectors.

// Application Dependencies
// const { loadConnector } = require('@datapos/datapos-operations/gruntPluginHelpers');
const config = require('./src/config.json');
const env = require('./.env.json');
const pkg = require('./package.json');

// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// Initialisation
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

module.exports = (grunt) => {
    // Initialise configuration.
    grunt.initConfig({
        bump: { options: { commitFiles: ['-a'], commitMessage: 'Release v%VERSION%', pushTo: 'origin', updateConfigs: ['pkg'] } },
        gitadd: { task: { options: { all: true } } },
        pkg,
        run: {
            copyToFirebase: { args: ['cp', 'dist/datapos-*', 'gs://datapos-v00-dev-alpha.appspot.com/plugins/connectors/data/'], cmd: 'gsutil' },
            engineUpdate: { args: ['install', '@datapos/datapos-engine@latest'], cmd: 'npm' },
            identifyLicensesUsingLicenseChecker: { args: ['license-checker', '--production', '--json', '--out', 'LICENSES.json'], cmd: 'npx' },
            identifyLicensesUsingNLF: { args: ['nlf', '-d'], cmd: 'npx' },
            lint: { args: ['eslint', 'src/index.ts'], cmd: 'npx' },
            npmPublish: { args: ['publish'], cmd: 'npx' },
            outdated: { args: ['npm', 'outdated'], cmd: 'npx' },
            rollup_cjs: { args: ['rollup', '-c', 'rollup.config-cjs.js', '--environment', 'BUILD:production'], cmd: 'npx' },
            rollup_iife: { args: ['rollup', '-c', 'rollup.config-iife.js', '--environment', 'BUILD:production'], cmd: 'npx' },
            rollup_es: { args: ['rollup', '-c', 'rollup.config-es.js', '--environment', 'BUILD:production'], cmd: 'npx' },
            rollup_umd: { args: ['rollup', '-c', 'rollup.config-umd.js', '--environment', 'BUILD:production'], cmd: 'npx' }
        }
    });
    // Load external tasks.
    grunt.loadNpmTasks('grunt-bump');
    grunt.loadNpmTasks('grunt-git');
    grunt.loadNpmTasks('grunt-run');

    // Register load connector task.
    // grunt.registerTask('loadConnector', 'Load Connector', async function () {
    //     const done = this.async();
    //     try {
    //         const status = await loadConnector(
    //             grunt,
    //             config,
    //             env.FIREBASE_API_KEY,
    //             env.FIREBASE_EMAIL_ADDRESS,
    //             env.FIREBASE_PASSWORD,
    //             env.FIREBASE_PROJECT_ID,
    //             env.SANITY_API_TOKEN,
    //             await import('node-fetch')
    //         );
    //         done(status);
    //     } catch (error) {
    //         console.log(error);
    //         done(false);
    //     }
    // });

    // Register standard tasks.
    // grunt.registerTask('forceOn', () => grunt.option('force', true));
    // grunt.registerTask('forceOff', () => grunt.option('force', false));
    // grunt.registerTask('build', ['run:rollup_cjs', 'run:rollup_es']); // cmd+shift+b.
    // grunt.registerTask('engineUpdate', ['forceOn', 'run:outdated', 'run:engineUpdate']); // cmd+shift+e.
    // grunt.registerTask('identifyLicenses', ['run:identifyLicensesUsingLicenseChecker', 'run:identifyLicensesUsingNLF']); // cmd+shift+i.
    // grunt.registerTask('lint', ['run:lint']); // cmd+shift+l.
    // grunt.registerTask('npmPublish', ['run:npmPublish']); // cmd+shift+n.
    // grunt.registerTask('release', ['gitadd', 'bump', 'run:rollup_cjs', 'run:rollup_es', 'run:copyToFirebase', 'loadConnector']); // cmd+shift+r.
    grunt.registerTask('synchronise', ['gitadd', 'bump']); // cmd+shift+s.
    // grunt.registerTask('test', ['loadConnector']); // TODO: Remove this after testing.
};
