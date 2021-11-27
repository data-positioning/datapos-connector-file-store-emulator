/**
 * @author Jonathan Terrell <jonathan.terrell@springbrook.es>
 * @copyright Copyright (c) 2019-2021 Springbrook S.L.
 * @license "ISC"
 */

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

    // Load external tasks.
    grunt.loadNpmTasks('grunt-bump');
    grunt.loadNpmTasks('grunt-run');

    // Register local tasks.
    grunt.registerTask('audit', ['run:audit']); // CMD SHIFT A
    grunt.registerTask('build', ['run:rollup_cjs', 'run:rollup_es']); // CMD SHIFT B
    grunt.registerTask('checkLicense', ['run:licenseChecker', 'run:nlf']); // CMD SHIFT C
    grunt.registerTask('lint', ['run:lint']); // CMD SHIFT L
    grunt.registerTask('outdated', ['run:outdated']); // CMD SHIFT O
    grunt.registerTask('release', ['run:rollupCJS', 'run:rollupES', 'bump', 'run:publish']); // CMD SHIFT R
    grunt.registerTask('sync', ['bump']); // CMD SHIFT S
    grunt.registerTask('test', ['run:test']); // CMD SHIFT T
    grunt.registerTask('update', ['run:update']); // CMD SHIFT U
};
