/**
 * @author Jonathan Terrell <terrell.jm@gmail.com>
 * @copyright 2022 Jonathan Terrell
 * @file datapos-connector-data-file-store-emulator/gruntfile.js
 * @license ISC
 */

// TODO: See new formatting in datapos-content.

// TODO: TS warning for next line (see ... under require) suggests file can be converted to ES module, but uncertain how to do this?
const { getConnectorConfig, updateFirebase } = require('@datapos/datapos-engine/src/gruntPluginHelpers');
const config = require('./src/config.json');
const env = require('./.env.json');
const pkg = require('./package.json');

module.exports = (grunt) => {
    // Initialise configuration.
    grunt.initConfig({
        bump: { options: { commitFiles: ['-a'], commitMessage: 'Release v%VERSION%', pushTo: 'origin', updateConfigs: ['pkg'] } },
        pkg,
        run: {
            copyToFirebase: { args: ['cp', 'dist/datapos-*', 'gs://datapos-v00-dev-alpha.appspot.com/plugins/connectors/data/'], cmd: 'gsutil' },
            identifyLicensesUsingLicenseChecker: { args: ['license-checker', '--production', '--json', '--out', 'LICENSES.json'], cmd: 'npx' },
            identifyLicensesUsingNLF: { args: ['nlf', '-d'], cmd: 'npx' },
            lint: { args: ['eslint', 'src/index.ts'], cmd: 'npx' },
            npmPublish: { args: ['publish'], cmd: 'npx' },
            rollup_cjs: { args: ['rollup', '-c', 'rollup.config-cjs.js', '--environment', 'BUILD:production'], cmd: 'npx' },
            rollup_iife: { args: ['rollup', '-c', 'rollup.config-iife.js', '--environment', 'BUILD:production'], cmd: 'npx' },
            rollup_es: { args: ['rollup', '-c', 'rollup.config-es.js', '--environment', 'BUILD:production'], cmd: 'npx' },
            rollup_umd: { args: ['rollup', '-c', 'rollup.config-umd.js', '--environment', 'BUILD:production'], cmd: 'npx' },
            test: { args: ['WARNING: No tests implemented.'], cmd: 'echo' },
            engineUpdate: { args: ['install', '@datapos/datapos-engine@latest'], cmd: 'npm' }
        }
    });

    // ...
    // TODO: 'grunt.task.registerTask' can be changed to 'grunt.registerTask'.
    grunt.task.registerTask('updateFirestore', 'Updates Firestore', async function () {
        const done = this.async();
        try {
            // TODO:
            updateFirebase();
            // TODO:

            const fetchModule = await import('node-fetch');

            // // Sign in to firebase.
            // const signInResponse = await fetchModule.default(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${env.FIREBASE_API_KEY}`, {
            //     body: JSON.stringify({
            //         email: env.FIREBASE_EMAIL_ADDRESS,
            //         password: env.FIREBASE_PASSWORD,
            //         returnSecureToken: true
            //     }),
            //     headers: {
            //         Referer: `${env.FIREBASE_PROJECT_ID}.web.app`
            //     },
            //     method: 'POST'
            // });
            // const signInResult = await signInResponse.json();

            // // Upsert connector record in application service database (firestore).
            // const upsertResponse = await fetchModule.default(`https://europe-west1-${env.FIREBASE_PROJECT_ID}.cloudfunctions.net/api/plugins`, {
            //     body: JSON.stringify(getConnectorConfig(config, grunt.config.data.pkg.version)),
            //     headers: {
            //         Authorization: signInResult.idToken,
            //         'Content-Type': 'application/json'
            //     },
            //     method: 'POST'
            // });
            // if (!upsertResponse.ok) console.log(upsertResponse.status, upsertResponse.statusText, await upsertResponse.text());

            const description = grunt.file.read('./src/description.md');
            const logo = grunt.file.read('./src/logo.svg');

            const createOrReplace = {
                _id: config.id,
                _type: 'dataStore',
                category: config.categoryId,
                description,
                icon: { asset: { _ref: 'image-65aa51823e6437a14db0e6d86df0b2eca001b5cb-1200x800-svg' }, _type: 'reference' },
                label: config.label,
                logo,
                status: config.statusId,
                usage: config.usageId
            };

            var requestOptions = {
                method: 'POST',
                headers: { Authorization: `Bearer ${env.SANITY_TOKEN}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ mutations: [{ createOrReplace }] })
            };

            const sanityResponse = await fetchModule.default('https://yxr5xjfo.api.sanity.io/v2021-06-07/data/mutate/library-production', requestOptions);
            if (!sanityResponse.ok) console.log(sanityResponse.status, sanityResponse.statusText, await sanityResponse.text());
            done();
        } catch (error) {
            console.log(error);
            // TODO: This is not declared 'done'. No error is reported. Does report error in 'datapos-content'.
            // TODO: Have changed 'datapos-content' to move 'done' outside try/catch block.
            done(false);
        }
    });

    // Load external tasks.
    grunt.loadNpmTasks('grunt-bump');
    grunt.loadNpmTasks('grunt-run');

    // Register local tasks.
    // grunt.registerTask('build', ['run:rollup_cjs', 'run:rollup_es']); // cmd+shift+b.
    grunt.registerTask('build', ['updateFirestore']); // cmd+shift+b.
    grunt.registerTask('identifyLicenses', ['run:identifyLicensesUsingLicenseChecker', 'run:identifyLicensesUsingNLF']); // cmd+shift+i.
    grunt.registerTask('lint', ['run:lint']); // cmd+shift+l.
    grunt.registerTask('npmPublish', ['run:npmPublish']); // cmd+shift+n.
    grunt.registerTask('release', ['bump', 'run:rollup_cjs', 'run:rollup_es', 'run:copyToFirebase', 'updateFirestore']); // cmd+shift+r.
    grunt.registerTask('synchronise', ['bump']); // cmd+shift+s.
    grunt.registerTask('test', ['run:test']); // cmd+shift+t.
    grunt.registerTask('engineUpdate', ['run:engineUpdate']); // cmd+shift+e.
};
