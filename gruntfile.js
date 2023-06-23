// Dependencies - Framework/Vendor
const config = require('./src/config.json');
const env = require('./.env.json');
const { uploadConnector } = require('@datapos/datapos-operations/connectorHelpers');
const {
    auditDependencies,
    checkDependencies,
    identifyLicenses,
    logNotImplementedMessage,
    lintCode,
    updateDataPosDependencies
} = require('@datapos/datapos-operations/commonHelpers');

// Configuration
module.exports = (grunt) => {
    // Set external task configuration.
    grunt.initConfig({
        bump: { options: { commitFiles: ['-a'], commitMessage: 'v%VERSION%', pushTo: 'origin', updateConfigs: ['pkg'] } },
        gitadd: { task: { options: { all: true } } },
        pkg: grunt.file.readJSON('package.json'),
        shell: { build: { command: 'vite build' } }
    });

    // Load external tasks.
    grunt.loadNpmTasks('grunt-bump');
    grunt.loadNpmTasks('grunt-git');
    grunt.loadNpmTasks('grunt-shell');

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
        lintCode(grunt, this, ['*.cjs', '*.js', '**/*.ts']);
    });
    grunt.registerTask('logNotImplementedMessage', (taskName) => logNotImplementedMessage(taskName));
    grunt.registerTask('uploadConnector', async function () {
        await uploadConnector(grunt, this, config, grunt.config.get('pkg.version'), env.DATAPOS_CONNECTOR_UPLOAD_TOKEN, env.DATAPOS_PROJECT_ID);
    });
    grunt.registerTask('updateDataPosDependencies', function (updateTypeId) {
        updateDataPosDependencies(grunt, this, updateTypeId);
    });

    // Register common repository management tasks. These tasks are all invoked by VSCode keyboard shortcuts identified in the comments.
    grunt.registerTask('audit', ['auditDependencies']); // alt+ctrl+shift+a.
    grunt.registerTask('build', ['shell:build']); // alt+ctrl+shift+b.
    grunt.registerTask('check', ['checkDependencies']); // alt+ctrl+shift+c.
    grunt.registerTask('document', ['identifyLicenses']); // alt+ctrl+shift+d.
    grunt.registerTask('format', ['logNotImplementedMessage:Format']); // alt+ctrl+shift+f.
    grunt.registerTask('lint', ['lintCode']); // alt+ctrl+shift+l.
    grunt.registerTask('migrate', ['logNotImplementedMessage:Migrate']); // alt+ctrl+shift+m.
    grunt.registerTask('publish', ['logNotImplementedMessage:Publish']); // alt+ctrl+shift+p.
    grunt.registerTask('release', ['gitadd', 'bump', 'shell:build', 'uploadConnector']); // alt+ctrl+shift+r.
    grunt.registerTask('synchronise', ['gitadd', 'bump']); // alt+ctrl+shift+s.
    grunt.registerTask('test', ['logNotImplementedMessage:Test']); // alt+ctrl+shift+t.
    grunt.registerTask('update', ['updateDataPosDependencies:engine-support']); // alt+ctrl+shift+u.
};
