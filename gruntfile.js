/**
 * @author Jonathan Terrell <jonathan.terrell@springbrook.es>
 * @copyright Copyright (c) 2019-2021 Springbrook S.L.
 * @license "Apache-2.0 with Commons Clause"
 */

// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

module.exports = (grunt) => {
    // Initialise configuration.
    grunt.initConfig({
        // Bump configuration.
        bump: {
            options: {
                commitFiles: ['-a'],
                commitMessage: '<%if(grunt.config("commitMessage")){%><%=grunt.config("commitMessage")%><%}else{%>Release v%VERSION%<%}%>',
                pushTo: 'origin'
            }
        },
        // Run configuration.
        run: {
            audit: { args: ['npm', 'audit'], cmd: 'npx' },
            licenseChecker: { args: ['license-checker', '--production', '--json', '--out', 'LICENSES.json'], cmd: 'npx' },
            licenseNLF: { args: ['nlf', '-d'], cmd: 'npx' },
            lint: { args: ['eslint', 'index.js'], cmd: 'npx' },
            outdated: { args: ['npm', 'outdated'], cmd: 'npx' },
            publish: { args: ['publish'], cmd: 'npx' },
            rollupCJS: { args: ['rollup', '-c', 'rollup.config-cjs.js'], cmd: 'npx' },
            rollupES: { args: ['rollup', '-c', 'rollup.config-es.js'], cmd: 'npx' },
            test: { args: ['cypress', 'open'], cmd: 'npx' },
            update: { args: ['npm', 'update', '--save/--save-dev'], cmd: 'npx' }
        }
    });
    // Load external tasks.
    grunt.loadNpmTasks('grunt-bump');
    grunt.loadNpmTasks('grunt-run');
    // Register local tasks.
    grunt.registerTask('audit', ['run:audit']);
    grunt.registerTask('build', ['run:rollupCJS', 'run:rollupES']);
    grunt.registerTask('licenseCheck', ['run:licenseChecker', 'run:licenseNLF']);
    grunt.registerTask('lint', ['run:lint']);
    grunt.registerTask('outdated', ['run:outdated']);
    grunt.registerTask('release', ['run:rollupCJS', 'run:rollupES', 'bump', 'run:publish']);
    grunt.registerTask('test', ['run:test']);
    grunt.registerTask('sync', ['bump']);
    grunt.registerTask('update', ['run:update']);
};
