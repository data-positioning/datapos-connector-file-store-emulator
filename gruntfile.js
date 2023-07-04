// Dependencies - Assets
const config = require('./src/config.json');
const env = require('./.env.json');

// Dependencies - Operations
const { uploadConnector } = require('@datapos/datapos-operations/connectorHelpers');
const {
    auditDependencies,
    buildWithVite,
    checkDependencies,
    identifyLicenses,
    logNotImplementedMessage,
    lintCode,
    syncRepoWithGithub,
    updateDataPosDependencies
} = require('@datapos/datapos-operations/commonHelpers');

// Configuration
module.exports = (grunt) => {
    // Set external task configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json')
    });

    // Register local tasks.
    grunt.registerTask('auditDependencies', function () {
        auditDependencies(grunt, this);
    });
    grunt.registerTask('buildWithVite', function () {
        buildWithVite(grunt, this);
    });
    grunt.registerTask('checkDependencies', function () {
        checkDependencies(grunt, this);
    });
    grunt.registerTask('identifyLicenses', function () {
        identifyLicenses(grunt, this);
    });
    grunt.registerTask('lintCode', function () {
        lintCode(grunt, this, ['*.cjs', '*.js', '**/*.ts']);
    });
    grunt.registerTask('logNotImplementedMessage', (taskName) => logNotImplementedMessage(taskName));
    grunt.registerTask('syncRepoWithGithub', function () {
        syncRepoWithGithub(grunt, this, ['package.json']);
    });
    grunt.registerTask('updateDataPosDependencies', function (updateTypeId) {
        updateDataPosDependencies(grunt, this, updateTypeId);
    });
    grunt.registerTask('uploadConnector', async function () {
        await uploadConnector(grunt, this, config, grunt.config.get('pkg.version'), env.DATAPOS_CONNECTOR_UPLOAD_TOKEN, env.DATAPOS_PROJECT_ID);
    });

    // Register common repository management tasks. These tasks are all invoked by VSCode keyboard shortcuts identified in the comments.
    grunt.registerTask('audit', ['auditDependencies']); // alt+ctrl+shift+a.
    grunt.registerTask('build', ['buildWithVite']); // alt+ctrl+shift+b.
    grunt.registerTask('check', ['checkDependencies']); // alt+ctrl+shift+c.
    grunt.registerTask('document', ['identifyLicenses']); // alt+ctrl+shift+d.
    grunt.registerTask('format', ['logNotImplementedMessage:Format']); // alt+ctrl+shift+f.
    grunt.registerTask('lint', ['lintCode']); // alt+ctrl+shift+l.
    grunt.registerTask('migrate', ['logNotImplementedMessage:Migrate']); // alt+ctrl+shift+m.
    grunt.registerTask('publish', ['logNotImplementedMessage:Publish']); // alt+ctrl+shift+p.
    grunt.registerTask('release', ['syncRepoWithGithub', 'buildWithVite', 'uploadConnector']); // alt+ctrl+shift+r.
    grunt.registerTask('synchronise', ['syncRepoWithGithub']); // alt+ctrl+shift+s.
    grunt.registerTask('test', ['logNotImplementedMessage:Test']); // alt+ctrl+shift+t.
    grunt.registerTask('update', ['updateDataPosDependencies:engine-support']); // alt+ctrl+shift+u.
};
