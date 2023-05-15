/**
 * @file datapos-connector-data-file-store-emulator/gruntfile.js
 * @description Grunt configuration file for project management tasks.
 * @license ISC Licensed under the ISC license, Version 2.0. See the LICENSE.md file for details.
 * @author Jonathan Terrell <terrell.jm@gmail.com>
 * @copyright 2023 Jonathan Terrell
 */

// Framework/Vendor Dependencies
const config = require('./src/config.json');
const env = require('./.env.json');
const pkg = require('./package.json');
const { uploadConnector } = require('@datapos/datapos-operations/connectorHelpers');
const {
    auditDependencies,
    checkDependencies,
    identifyLicenses,
    logNotImplementedMessage,
    migrateDependencies,
    lintCode,
    publishToNPM,
    rollup
} = require('@datapos/datapos-operations/commonHelpers');

// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// Initialisation
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// module.exports = (grunt) => {
//     grunt.initConfig({
//         run: {
//             // copyToFirebase: { args: ['cp', 'dist/datapos-*', 'gs://datapos-v00-dev-alpha.appspot.com/components/connectors/data/'], cmd: 'gsutil' },
//             rollup_umd: { args: ['rollup', '-c', 'rollup.config-umd.js', '--environment', 'BUILD:production'], cmd: 'npx' },
//             updateEngineSupport: { args: ['install', '@datapos/datapos-engine-support@latest'], cmd: 'npm' },
//             updateOperations: { args: ['install', '--save-dev', '@datapos/datapos-operations@latest'], cmd: 'npm' }
//         }
//     });

//     // Register upload connector task.
//     grunt.registerTask('uploadConnector', 'Upload Connector', async function () {
//         const done = this.async();
//         try {
//             // TODO: env.FIREBASE_PROJECT_ID is really an environment/version identifier.
//             const status = await uploadConnector(grunt, config, (await import('node-fetch')).default, env.DATAPOS_CONNECTOR_UPLOAD_TOKEN, env.DATAPOS_PROJECT_ID);
//             done(true);
//         } catch (error) {
//             console.log(error);
//             done(false);
//         }
//     });

//     // Register standard repository management tasks.
//     grunt.registerTask('release', ['gitadd', 'bump', 'run:rollup_es', 'uploadConnector']); // cmd+shift+r.
//     grunt.registerTask('updateApplicationDependencies', ['forceOn', 'run:outdated', 'run:updateEngineSupport', 'run:updateOperations']); // cmd+shift+u.

//     grunt.registerTask('test', ['uploadConnector']); // cmd+shift+t.
// };

module.exports = (grunt) => {
    // Set configuration.
    grunt.initConfig({
        bump: { options: { commitFiles: ['-a'], commitMessage: 'v%VERSION%', pushTo: 'origin', updateConfigs: ['pkg'] } },
        gitadd: { task: { options: { all: true } } },
        pkg
    });

    // Load external tasks.
    grunt.loadNpmTasks('grunt-bump');
    grunt.loadNpmTasks('grunt-git');

    // Register local tasks.
    grunt.registerTask('auditDependencies', function () {
        auditDependencies(grunt, this);
    });
    grunt.registerTask('checkDependencies', function () {
        checkDependencies(grunt, this);
    });
    grunt.registerTask('identifyLicenses', function () {
        identifyLicenses(grunt, this);
    });
    grunt.registerTask('lintCode', function () {
        lintCode(grunt, this, ['*.js']);
    });
    grunt.registerTask('migrateDependencies', function () {
        migrateDependencies(grunt, this);
    });
    grunt.registerTask('logNotImplementedMessage', (taskName) => logNotImplementedMessage(taskName));
    grunt.registerTask('publishToNPM', function () {
        publishToNPM(grunt, this);
    });
    grunt.registerTask('rollup', function (configTypeId) {
        rollup(grunt, this, configTypeId);
    });
    grunt.registerTask('uploadConnector', async function () {
        // const done = this.async();
        // try {
        //     // TODO: env.FIREBASE_PROJECT_ID is really an environment/version identifier.
        //     const status = await uploadConnector(grunt, config, (await import('node-fetch')).default, env.DATAPOS_CONNECTOR_UPLOAD_TOKEN, env.DATAPOS_PROJECT_ID);
        //     done(true);
        // } catch (error) {
        //     console.log(error);
        //     done(false);
        // }
        uploadConnector(grunt, config, (await import('node-fetch')).default, env.DATAPOS_CONNECTOR_UPLOAD_TOKEN, env.DATAPOS_PROJECT_ID);
    });

    // Register common repository management tasks. These tasks are all invoked by VSCode keyboard shortcuts identified in the comments.
    grunt.registerTask('audit', ['auditDependencies']); // alt+ctrl+shift+a.
    grunt.registerTask('build', ['rollup:es']); // alt+ctrl+shift+b.
    grunt.registerTask('check', ['checkDependencies']); // alt+ctrl+shift+c.
    grunt.registerTask('document', ['identifyLicenses']); // alt+ctrl+shift+d.
    grunt.registerTask('format', ['logNotImplementedMessage:Format']); // alt+ctrl+shift+f.
    grunt.registerTask('lint', ['lintCode']); // alt+ctrl+shift+l.
    grunt.registerTask('migrate', ['migrateDependencies']); // alt+ctrl+shift+m.
    grunt.registerTask('publish', ['logNotImplementedMessage:Publish']); // alt+ctrl+shift+p.
    grunt.registerTask('release', ['gitadd', 'bump', 'rollup:es', 'uploadConnector']); // alt+ctrl+shift+r.
    grunt.registerTask('synchronise', ['gitadd', 'bump']); // alt+ctrl+shift+s.
    grunt.registerTask('test', ['logNotImplementedMessage:Test']); // alt+ctrl+shift+t.
    grunt.registerTask('update', ['logNotImplementedMessage:Update']); // alt+ctrl+shift+u.
};
