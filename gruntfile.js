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
    lintCode,
    publishToNPM,
    rollup,
    updateDependency,
    updateDevDependency
} = require('@datapos/datapos-operations/commonHelpers');

// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// Initialisation
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

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
    grunt.registerTask('logNotImplementedMessage', (taskName) => logNotImplementedMessage(taskName));
    grunt.registerTask('publishToNPM', function () {
        publishToNPM(grunt, this);
    });
    grunt.registerTask('rollup', function (configTypeId) {
        rollup(grunt, this, configTypeId);
    });
    grunt.registerTask('uploadConnector', async function () {
        await uploadConnector(grunt, this, config, pkg.version, env.DATAPOS_CONNECTOR_UPLOAD_TOKEN, env.DATAPOS_PROJECT_ID);
    });
    grunt.registerTask('updateDependency', function (updateTypeId) {
        updateDependency(grunt, this, updateTypeId);
    });
    grunt.registerTask('updateDevDependency', function (updateTypeId) {
        updateDevDependency(grunt, this, updateTypeId);
    });

    // Register common repository management tasks. These tasks are all invoked by VSCode keyboard shortcuts identified in the comments.
    grunt.registerTask('audit', ['auditDependencies']); // alt+ctrl+shift+a.
    grunt.registerTask('build', ['rollup:es']); // alt+ctrl+shift+b.
    grunt.registerTask('check', ['checkDependencies']); // alt+ctrl+shift+c.
    grunt.registerTask('document', ['identifyLicenses']); // alt+ctrl+shift+d.
    grunt.registerTask('format', ['logNotImplementedMessage:Format']); // alt+ctrl+shift+f.
    grunt.registerTask('lint', ['lintCode']); // alt+ctrl+shift+l.
    grunt.registerTask('migrate', ['logNotImplementedMessage:Migrate']); // alt+ctrl+shift+m.
    grunt.registerTask('publish', ['logNotImplementedMessage:Publish']); // alt+ctrl+shift+p.
    grunt.registerTask('release', ['gitadd', 'bump', 'rollup:es', 'uploadConnector']); // alt+ctrl+shift+r.
    grunt.registerTask('synchronise', ['gitadd', 'bump']); // alt+ctrl+shift+s.
    grunt.registerTask('test', ['logNotImplementedMessage:Test']); // alt+ctrl+shift+t.
    grunt.registerTask('update', ['updateDependency:engine-support', 'updateDevDependency:operations']); // alt+ctrl+shift+u.
};
