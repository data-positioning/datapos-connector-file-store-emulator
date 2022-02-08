/**
 * @author Jonathan Terrell <jonathan.terrell@springbrook.es>
 * @copyright Copyright (c) 2022 Springbrook S.L.
 * @file gruntfile.js
 * @license "ISC"
 */

const env = require('./.env.json');
const pkg = require('./package.json');

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

        pkg,

        run: {
            audit: { args: ['npm', 'audit'], cmd: 'npx' },
            copyToFirebase: { args: ['cp', 'dist/*', 'gs://nectis-app-v00-dev-alpha.appspot.com'], cmd: 'gsutil' },
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

            const connectorsResponse = await fetchModule.default(`https://europe-west1-${env.FIREBASE_PROJECT_ID}.cloudfunctions.net/api/connectors`, {
                body: JSON.stringify({
                    authenticationMethodId: 'none',
                    categoryId: 'sampleData',
                    classId: 'system',
                    id: 'nectis-connector-data-sample-files',
                    logo: '<svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="vial" class="svg-inline--fa fa-vial" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="#757575" d="M504.1 183l-176-176C324.3 2.344 318.1 0 312 0s-12.28 2.344-16.97 7.031c-9.375 9.375-9.375 24.56 0 33.94l15.16 15.16l-277.3 276.5c-38.75 38.75-45.13 102-9.375 143.5C44.08 500 72.76 512 101.5 512h.4473c26.38 0 52.75-9.1 72.88-30.12l281-280.1l15.19 15.19C475.7 221.7 481.8 224 488 224s12.28-2.344 16.97-7.031C514.3 207.6 514.3 192.4 504.1 183zM333.4 256H177.7l166.3-165.9l77.82 77.73L333.4 256z"></path></svg>',
                    pluginPath: 'nectis-connector-data-sample-files-es.js',
                    statusId: 'alpha',
                    typeLabel: 'Files',
                    typeLabelCollation: 'files',
                    usageId: 'source',
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
    grunt.loadNpmTasks('grunt-run');

    // Register local tasks.
    grunt.registerTask('audit', ['run:audit']);
    grunt.registerTask('build', ['run:rollup_cjs', 'run:rollup_es', 'run:copyToFirebase', 'updateFirestore']);
    grunt.registerTask('identifyLicenses', ['run:identifyLicensesUsingLicenseChecker', 'run:identifyLicensesUsingNLF']);
    grunt.registerTask('lint', ['run:lint']);
    grunt.registerTask('outdated', ['run:outdated']);
    grunt.registerTask('publish', ['run:publish']);
    grunt.registerTask('release', ['run:rollup_cjs', 'run:rollup_es', 'bump', 'run:copyToFirebase', 'updateFirestore']);
    grunt.registerTask('synchronise', ['bump']);
    grunt.registerTask('test', ['run:test']);
};
