/*
 * Builds the
 * Copyright (c) 2013 Michael Brady Paulson
 * Licensed under the MIT license.
 */

'use strict';

var browserify = require('browserify');

module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');

    // Project configuration.
    grunt.initConfig({
        // Configuration to be run (and then tested).
        build_me: {
            options: {
                main: './js/main.js',
                out: './static/dist/main.js'
            }
        }
    });

    // Actually load this plugin's task(s).
    grunt.loadTasks('tasks');

    // Building the template file for the build_me task.
    grunt.registerMultiTask('build_me', 'Its the temporary building system.', function(target) {
        grunt.log.write('Testing: ' + JSON.stringify(this.options));
    });

    // By default, lint and run all tests.
    grunt.registerTask('default', ['manifest_json', 'watch']);
};


function browserifyBuild(options) {
    var requires = options.requires;
    var b = browserify();

    for ()
}