/**
 * @author Jonathan Terrell <jonathan.terrell@springbrook.es>
 * @copyright Copyright (c) 2022 Springbrook S.L.
 * @file gruntfile.js
 * @license "ISC"
 */

const env = require('./.env.json');
const FireStoreParser = require('firestore-parser');

module.exports = (grunt) => {
    // Initialise configuration.
    grunt.initConfig({
        bump: {
            options: {
                commitFiles: ['-a'],
                commitMessage: '<%if(grunt.config("commitMessage")){%><%=grunt.config("commitMessage")%><%}else{%>Release v%VERSION%<%}%>',
                pushTo: 'origin'
            }
        },

        run: {
            audit: { args: ['npm', 'audit'], cmd: 'npx' },
            copyToFirebase: { args: ['cp', 'dist/*', 'gs://nectis-app-v00-dev-alpha.appspot.com'], cmd: 'gsutil' },
            licenseChecker: { args: ['license-checker', '--production', '--json', '--out', 'LICENSES.json'], cmd: 'npx' },
            lint: { args: ['eslint', 'src/index.ts'], cmd: 'npx' },
            nlf: { args: ['nlf', '-d'], cmd: 'npx' },
            outdated: { args: ['npm', 'outdated'], cmd: 'npx' },
            publish: { args: ['publish'], cmd: 'npx' },
            rollup_cjs: { args: ['rollup', '-c', 'rollup.config-cjs.js', '--environment', 'BUILD:production'], cmd: 'npx' },
            rollup_es: { args: ['rollup', '-c', 'rollup.config-es.js', '--environment', 'BUILD:production'], cmd: 'npx' },
            test: { args: ['WARNING: No tests implemented.'], cmd: 'echo' },
            update: { exec: 'npx ncu -u && npm install' }
        }
    });

    grunt.task.registerTask('updateFirestore', 'Updates Firestore', async function () {
        const done = this.async();

        const fetchModule = await import('node-fetch');
        const signInResponse = await fetchModule.default(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${env.FIREBASE_API_KEY}`, {
            body: JSON.stringify({
                email: env.FIREBASE_EMAIL_ADDRESS,
                password: env.FIREBASE_PASSWORD,
                returnSecureToken: true
            }),
            headers: { Referer: 'nectis-app-v00-dev-alpha.web.app' },
            method: 'POST'
        });
        const signInResult = await signInResponse.json();

        const listResponse = await fetchModule.default(`https://firestore.googleapis.com/v1/projects/${env.FIREBASE_PROJECT_ID}/databases/(default)/documents/connectors`, {
            headers: { Authorization: `Bearer ${signInResult.idToken}` },
            method: 'GET'
        });
        const listResult = await FireStoreParser(await listResponse.json());
        for (const document of listResult.documents) {
            console.log(document);
        }

        done();
    });

    // Load external tasks.
    grunt.loadNpmTasks('grunt-bump');
    grunt.loadNpmTasks('grunt-run');

    // Register local tasks.
    grunt.registerTask('audit', ['updateFirestore']); // CMD SHIFT A
    grunt.registerTask('build', ['run:rollup_cjs', 'run:rollup_es', 'run:copyToFirebase']); // CMD SHIFT B
    grunt.registerTask('checkLicense', ['run:licenseChecker', 'run:nlf']); // CMD SHIFT C
    grunt.registerTask('lint', ['run:lint']); // CMD SHIFT L
    grunt.registerTask('outdated', ['run:outdated']); // CMD SHIFT O
    grunt.registerTask('release', ['run:rollup_cjs', 'run:rollup_es', 'bump', 'run:publish']); // CMD SHIFT R
    grunt.registerTask('sync', ['bump']); // CMD SHIFT S
    grunt.registerTask('test', ['run:test']); // CMD SHIFT T
    grunt.registerTask('update', ['run:update']); // CMD SHIFT U
};
