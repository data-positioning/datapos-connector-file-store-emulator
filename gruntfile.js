/**
 * @author Jonathan Terrell <jonathan.terrell@springbrook.es>
 * @copyright Copyright (c) 2022 Springbrook S.L.
 * @file gruntfile.js
 * @license "ISC"
 */

const connector = require('./src/connector.json');
const env = require('./.env.json');
const pkg = require('./package.json');

const firebaseStorageUrl = 'gs://nectis-app-v00-dev-alpha.appspot.com/connectors';

module.exports = (grunt) => {
    // Initialise configuration.
    grunt.initConfig({
        bump: {
            options: {
                commitFiles: ['-a'],
                commitMessage: '<%if(grunt.config("commitMessage")){%><%=grunt.config("commitMessage")%><%}else{%>Release v%VERSION%<%}%>',
                pushTo: 'origin',
                updateConfigs: ['pkg']
            }
        },

        copy: {
            configToDist: {
                files: [{ cwd: 'src', dest: 'dist', expand: true, src: ['connector.json'], rename: (dest) => `${dest}/${connector.id}.json` }]
            }
        },

        pkg,

        run: {
            audit: { args: ['npm', 'audit'], cmd: 'npx' },
            copyToFirebase: { args: ['cp', 'dist/*', firebaseStorageUrl], cmd: 'gsutil' },
            identifyLicensesUsingLicenseChecker: { args: ['license-checker', '--production', '--json', '--out', 'LICENSES.json'], cmd: 'npx' },
            identifyLicensesUsingNLF: { args: ['nlf', '-d'], cmd: 'npx' },
            lint: { args: ['eslint', 'src/index.ts'], cmd: 'npx' },
            outdated: { args: ['npm', 'outdated'], cmd: 'npx' },
            publish: { args: ['publish'], cmd: 'npx' },
            rollup_cjs: { args: ['rollup', '-c', 'rollup.config-cjs.js', '--environment', 'BUILD:production'], cmd: 'npx' },
            rollup_es: { args: ['rollup', '-c', 'rollup.config-es.js', '--environment', 'BUILD:production'], cmd: 'npx' },
            test: { args: ['WARNING: No tests implemented.'], cmd: 'echo' }
        }
    });

    grunt.task.registerTask('updateFirestore', 'Updates Firestore', async function () {
        try {
            const done = this.async();

            // Sign in to firebase.
            const fetchModule = await import('node-fetch');
            const signInResponse = await fetchModule.default(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${env.FIREBASE_API_KEY}`, {
                body: JSON.stringify({
                    email: env.FIREBASE_EMAIL_ADDRESS,
                    password: env.FIREBASE_PASSWORD,
                    returnSecureToken: true
                }),
                headers: { Referer: `${env.FIREBASE_PROJECT_ID}.web.app` },
                method: 'POST'
            });
            const signInResult = await signInResponse.json();

            // Create/update connector record in application service database (firestore).
            const connectorsResponse = await fetchModule.default(`https://europe-west1-${env.FIREBASE_PROJECT_ID}.cloudfunctions.net/api/connectors`, {
                body: JSON.stringify({
                    authenticationMethodId: connector.authenticationMethodId,
                    categoryId: connector.categoryId,
                    classId: connector.classId,
                    id: connector.id,
                    logo: connector.logo,
                    pluginPath: `${connector.id}-es.js`,
                    statusId: connector.statusId,
                    typeLabel: connector.typeLabel,
                    typeLabelCollation: connector.typeLabelCollation,
                    usageId: connector.usageId,
                    version: `v${grunt.config.data.pkg.version}`
                }),
                headers: { Authorization: signInResult.idToken, 'Content-Type': 'application/json' },
                method: 'POST'
            });
            if (!connectorsResponse.ok) console.log(connectorsResponse.status, connectorsResponse.statusText, await connectorsResponse.text());

            done();
        } catch (error) {
            console.log(error);
            done(false);
        }
    });

    // Load external tasks.
    grunt.loadNpmTasks('grunt-bump');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-run');

    // Register local tasks.
    grunt.registerTask('audit', ['run:audit']);
    grunt.registerTask('build', ['run:rollup_cjs', 'run:rollup_es', 'copy:configToDist', 'run:copyToFirebase', 'updateFirestore']);
    grunt.registerTask('identifyLicenses', ['run:identifyLicensesUsingLicenseChecker', 'run:identifyLicensesUsingNLF']);
    grunt.registerTask('lint', ['run:lint']);
    grunt.registerTask('outdated', ['run:outdated']);
    // grunt.registerTask('publish', ['run:publish']);
    grunt.registerTask('release', ['run:rollup_cjs', 'run:rollup_es', 'bump', 'copy:configToDist', 'run:copyToFirebase', 'updateFirestore']);
    grunt.registerTask('synchronise', ['bump']);
    grunt.registerTask('test', ['run:test']);
};
