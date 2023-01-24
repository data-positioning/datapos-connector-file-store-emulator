/**
 * @author Jonathan Terrell <terrell.jm@gmail.com>
 * @copyright 2022 Jonathan Terrell
 * @file datapos-connector-data-file-store-emulator/gruntfile.js
 * @license ISC
 */

// TODO: See new formatting in datapos-content. Has been implemented here, but needs to be implemented in all other connectors.

const { getConnectorConfig, loadConnector } = require('./gruntPluginHelpers.js');
const config = require('./src/config.json');
const env = require('./.env.json');
const pkg = require('./package.json');

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
    grunt.registerTask('loadConnector', 'Load Connector', async function () {
        const done = this.async();
        try {
            const fetchModule = await import('node-fetch');

            // TODO: Can we move following code to this function? Rename to 'loadConnector'. Currently only displays message to console.
            loadConnector();

            //         // Sign in to firebase.
            //         const firebaseSignInResponse = await fetchModule.default(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${env.FIREBASE_API_KEY}`, {
            //             body: JSON.stringify({
            //                 email: env.FIREBASE_EMAIL_ADDRESS,
            //                 password: env.FIREBASE_PASSWORD,
            //                 returnSecureToken: true
            //             }),
            //             headers: {
            //                 Referer: `${env.FIREBASE_PROJECT_ID}.web.app`
            //             },
            //             method: 'POST'
            //         });
            //         if (!firebaseSignInResponse.ok) {
            //             console.log(firebaseSignInResponse.status, firebaseSignInResponse.statusText, await firebaseSignInResponse.text());
            //             return;
            //         }
            //         const firebaseSignInResult = await firebaseSignInResponse.json();

            //         // Upsert connector record in application service database (firestore).
            //         const firebaseUpsertResponse = await fetchModule.default(`https://europe-west1-${env.FIREBASE_PROJECT_ID}.cloudfunctions.net/api/plugins`, {
            //             body: JSON.stringify(getConnectorConfig(config, grunt.config.data.pkg.version)),
            //             headers: {
            //                 Authorization: firebaseSignInResult.idToken,
            //                 'Content-Type': 'application/json'
            //             },
            //             method: 'POST'
            //         });
            //         if (!firebaseUpsertResponse.ok) {
            //             console.log(firebaseUpsertResponse.status, firebaseUpsertResponse.statusText, await firebaseUpsertResponse.text());
            //             return;
            //         }

            // Upsert Sanity document.
            const createOrReplace = {
                _id: config.id,
                _type: 'dataStore',
                category: config.categoryId,
                description: grunt.file.read('./src/description.md'),
                icon: { asset: { _ref: 'image-65aa51823e6437a14db0e6d86df0b2eca001b5cb-1200x800-svg' }, _type: 'reference' },
                label: config.label,
                logo: grunt.file.read('./src/logo.svg'),
                status: config.statusId,
                usage: config.usageId
            };
            const sanityUpsertResponse = await fetchModule.default('https://yxr5xjfo.api.sanity.io/v2021-06-07/data/mutate/library-production', {
                method: 'POST',
                headers: { Authorization: `Bearer ${env.SANITY_TOKEN}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ mutations: [{ createOrReplace }] })
            });
            if (!sanityUpsertResponse.ok) {
                console.log(sanityUpsertResponse.status, sanityUpsertResponse.statusText, await sanityUpsertResponse.text());
                return;
            }

            // Notify ok.
            done();
        } catch (error) {
            console.log(error);
            done(false);
        }
    });

    // Register standard tasks.
    grunt.registerTask('forceOn', () => grunt.option('force', true));
    grunt.registerTask('forceOff', () => grunt.option('force', false));
    grunt.registerTask('build', ['run:rollup_cjs', 'run:rollup_es']); // cmd+shift+b.
    grunt.registerTask('engineUpdate', ['forceOn', 'run:outdated', 'run:engineUpdate']); // cmd+shift+e.
    grunt.registerTask('identifyLicenses', ['run:identifyLicensesUsingLicenseChecker', 'run:identifyLicensesUsingNLF']); // cmd+shift+i.
    grunt.registerTask('lint', ['run:lint']); // cmd+shift+l.
    grunt.registerTask('npmPublish', ['run:npmPublish']); // cmd+shift+n.
    grunt.registerTask('release', ['gitadd', 'bump', 'run:rollup_cjs', 'run:rollup_es', 'run:copyToFirebase', 'loadConnector']); // cmd+shift+r.
    grunt.registerTask('synchronise', ['gitadd', 'bump']); // cmd+shift+s.
    grunt.registerTask('test', ['loadConnector']); // TODO: Remove this after testing.
};
