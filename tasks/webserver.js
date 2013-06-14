/*!
 *
 *  Copyright (c) David Bushell | @dbushell | http://dbushell.com/
 *
 */

var connect = require('connect');

module.exports = function(grunt)
{

    grunt.registerTask('webserver', 'Start a local server', function()
    {
        var done = this.async();

        var server = connect()
            .use(connect.compress())
            .use(connect.logger('dev'))
            .use(connect.static('./build'))
            .use(connect.favicon('./build/assets/img/favicon.ico'));

        server.listen(8080, 'localhost');

        server.on('listening', function()
        {
            var address = server.address();
            grunt.log.writeln('Servering build at http://localhost:' + address.port);
        });

        server.on('error', function(err)
        {
            grunt.fatal(err);
        });

    });

};
