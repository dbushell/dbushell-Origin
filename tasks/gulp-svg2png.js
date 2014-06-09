/*!
 * grunt-svg2png
 * https://github.com/dbushell/grunt-svg2png
 *
 * Copyright (c) 2013 David Bushell
 * Licensed under The MIT License (MIT)
 */

var path      = require('path'),
    through2  = require('through2'),
    gulp_util = require('gulp-util'),
    phantomjs = require('phantomjs');

module.exports = function(options)
{
    'use strict';

    var start = new Date(),
        completed = 0,
        files = [],
        total = 0;

    var stream = through2.obj(

        function(file, encoding, callback)
        {
            files.push({
                src: file.path,
                dest: file.path.replace(/\.svg$/i, '.png')
            });
            return callback();
        },

        function()
        {
            var self = this;

            total = files.length;

            var cmd = 'phantomjs' || phantomjs.path;

            var phantom = require('child_process').spawn(cmd,
                [
                    path.resolve(__dirname, 'lib/svg2png.js'),
                    JSON.stringify(files)
                ]);

            phantom.on('error', function(e)
            {
                self.emit('end');
            });

            phantom.stdout.on('data', function(data)
            {
                try {
                    var result = JSON.parse(data.toString());
                    if (result.status) {
                        gulp_util.log('gulp-svg2png:', gulp_util.colors.green('✔ ') + path.basename(result.file.src));
                        completed++;
                    }
                } catch (e) { }
            });

            phantom.on('close', function(code)
            {
                self.emit('end');
            });

        }
    );

    return stream;
};
