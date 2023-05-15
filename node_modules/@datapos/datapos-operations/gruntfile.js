/**
 * @file datapos-operations/gruntfile.js
 * @description Grunt configuration file for project management tasks.
 * @license ISC Licensed under the ISC license, Version 2.0. See the LICENSE.md file for details.
 * @author Jonathan Terrell <terrell.jm@gmail.com>
 * @copyright 2023 Jonathan Terrell
 */

// Framework/Vendor Dependencies
const { auditDependencies, checkDependencies, identifyLicenses, logNotImplementedMessage, migrateDependencies, lintCode, publishToNPM } = require('./commonHelpers');

// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// Initialisation
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

module.exports = (grunt) => {
    // Set configuration.
    grunt.initConfig({
        bump: { options: { commitFiles: ['-a'], commitMessage: 'v%VERSION%', pushTo: 'origin' } },
        gitadd: { task: { options: { all: true } } }
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

    // Register common repository management tasks. These tasks are all invoked by VSCode keyboard shortcuts identified in the comments.
    grunt.registerTask('audit', ['auditDependencies']); // alt+ctrl+shift+a.
    grunt.registerTask('build', ['logNotImplementedMessage:Build']); // alt+ctrl+shift+b.
    grunt.registerTask('check', ['checkDependencies']); // alt+ctrl+shift+c.
    grunt.registerTask('document', ['identifyLicenses']); // alt+ctrl+shift+d.
    grunt.registerTask('format', ['logNotImplementedMessage:Format']); // alt+ctrl+shift+f.
    grunt.registerTask('lint', ['lintCode']); // alt+ctrl+shift+l.
    grunt.registerTask('migrate', ['migrateDependencies']); // alt+ctrl+shift+m.
    grunt.registerTask('publish', ['publishToNPM']); // alt+ctrl+shift+p.
    grunt.registerTask('release', ['gitadd', 'bump', 'publishToNPM']); // alt+ctrl+shift+r.
    grunt.registerTask('synchronise', ['gitadd', 'bump']); // alt+ctrl+shift+s.
    grunt.registerTask('test', ['logNotImplementedMessage:Test']); // alt+ctrl+shift+t.
    grunt.registerTask('update', ['logNotImplementedMessage:Update']); // alt+ctrl+shift+u.
};
