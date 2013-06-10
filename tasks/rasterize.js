var fs = require("fs");

var styles = {

  'bold'          : ['\x1B[1m',  '\x1B[22m'],
  'italic'        : ['\x1B[3m',  '\x1B[23m'],
  'underline'     : ['\x1B[4m',  '\x1B[24m'],
  'inverse'       : ['\x1B[7m',  '\x1B[27m'],
  'strikethrough' : ['\x1B[9m',  '\x1B[29m'],

  'white'     : ['\x1B[37m', '\x1B[39m'],
  'grey'      : ['\x1B[90m', '\x1B[39m'],
  'black'     : ['\x1B[30m', '\x1B[39m'],

  'blue'      : ['\x1B[34m', '\x1B[39m'],
  'cyan'      : ['\x1B[36m', '\x1B[39m'],
  'green'     : ['\x1B[32m', '\x1B[39m'],
  'magenta'   : ['\x1B[35m', '\x1B[39m'],
  'red'       : ['\x1B[31m', '\x1B[39m'],
  'yellow'    : ['\x1B[33m', '\x1B[39m']

};

var style = function(str, format)
{
    return styles[format][0] + str + styles[format][1];
};

module.exports = function(grunt)
{
    grunt.registerMultiTask('rasterize', 'Convert SVG to PNG.', function()
    {
        var next,
            update,
            start    = new Date(),
            progress = 0,
            complete = 0,
            maxspawn = 10,
            files    = grunt.file.expand(this.data.files),
            done     = this.async();

        grunt.log.subhead('SVG to PNG (' + files.length + ' files)...');

        var onComplete = function()
        {
            if (++complete >= files.length) {
                update();
                grunt.log.write("\n");
                grunt.log.ok("Rasterization complete.");
                done();
            } else {
                update();
                if (progress < files.length) next();
            }
        };

        update = function()
        {
            process.stdout.clearLine();
            process.stdout.cursorTo(0);

            var str = style('0%', 'yellow') + ' [ ',
                arr = [],
                len = files.length,
                percent = ((100/len)*(complete)).toFixed(2);

            while(len--) arr.push(len < complete ? '=' : ' ');
            str += arr.reverse().join('');
            str += ' ] ' + style(percent + "%", 'green') + ' (' + ((new Date() - start)/1000).toFixed(1) + 's) ';
            process.stdout.write(str);
        };

        next = function()
        {
            var inputFile = files[progress++],
                outputFile = (inputFile || "").replace(/\.svg$/i, ".png");

            if (!inputFile) {
                return;
            }

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
                    onComplete();
                }
            );
        };

        update();
        var i = maxspawn;
        while(--i) next();

    });

};
