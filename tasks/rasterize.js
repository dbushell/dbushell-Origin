var fs = require("fs");

module.exports = function(grunt)
{
    grunt.registerMultiTask('rasterize', 'Convert SVG to PNG.', function()
    {

        grunt.log.subhead('Rasterizing SVG...');

        var files = grunt.file.expand(this.data.files);

        //grunt.util.async.forEach(files, function(file, nextFile)
        files.forEach(function(file)
        {
            if (typeof file !== 'string') {
                return;
            }

            var inputFile = file,
                outputFile = inputFile.replace(/\.svg$/i, ".png");

            grunt.log.writeln( inputFile + " > " + outputFile);

            grunt.util.spawn(
            {
                cmd: 'phantomjs',
                args: [
                        'tasks/lib/svg2png.js',
                        inputFile,
                        outputFile
                    ]
                },
                function(error, result, code)
                {
                    grunt.log.writeIn('test');
                    grunt.log.error(error + ": " + result + ": " + code);
                }
            );

        });

        grunt.log.ok("svg2png complete.");

    });

};
