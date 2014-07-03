/*!
 *
 *  Copyright (c) David Bushell | @dbushell | http://dbushell.com/
 *
 *  based on: https://github.com/haio/grunt-mustache-html/blob/master/tasks/mustache_html.js
 *
 */

var fs = require('fs'),
    path = require('path'),
    hogan = require('hogan.js');

module.exports = function(grunt)
{
    'use strict';

    function each(obj, func)
    {
        var i, length, keys = Object.keys(obj);
        for (i = 0, length = keys.length; i < length; i++) {
            func.call(null, obj[keys[i]], keys[i]);
        }
    }

    function merge(obj, extended)
    {
        each(extended, function(v, k) {
            obj[k] = v;
        });
        return obj;
    }

    grunt.registerMultiTask('dbushell_htmlizr', 'Compile HTML with Hogan / Mustache templates.', function()
    {

        var options = this.options({
            src  : 'src',
            dist : 'dist'
        });

        var matcher = new RegExp('\\' + '.html' + '$');

        var basePath = options.src + '/base.html',
            baseData = basePath.replace(matcher, '.json'),
            baseSrc = grunt.file.read(basePath),
            base    = hogan.compile(baseSrc); // , { sectionTags: [{o:'_i', c:'i'}] }

        var globals = this.data.globals || {};

        globals.ROOT = '';
        globals.ASSETS = 'assets/';

        if (grunt.file.exists(baseData)) {
            globals = merge(globals, JSON.parse(grunt.file.read(baseData)));
        }

        var templateData = {},

            partDir  = options.src + '/partials',
            pageDir  = options.src + '/pages',

            partials = render(partDir),
            pages    = render(pageDir, partials);


        // console.log(partials['header'].render(globals, partials));

        each(pages, function(page, name)
        {
            partials.content = page;
            page = base.render(templateData[name], partials);
            grunt.file.write(options.dist + '/' + name + '.html', page);
        });

        function render(path, partials)
        {
            var templates = {};

            grunt.file.recurse(path, function (absPath, rootDir, subDir, filename)
            {
                if (!filename.match(matcher)) return;

                var relPath  = absPath.substr(rootDir.length + 1),
                    name     = relPath.replace(matcher, ''),
                    dataPath = absPath.replace(matcher, '.json'),
                    locals   = merge({}, globals),
                    data     = {};

                // if (!partials) name = '_' + name;

                var templateSrc = grunt.file.read(absPath),
                    template    = hogan.compile(templateSrc);

                if (grunt.file.exists(dataPath)) {
                    data = JSON.parse(grunt.file.read(dataPath));
                    locals = merge(locals, data);
                }

                var depth = (name.match(/\//g)||[]).length;
                while(depth--) {
                    locals.ROOT += '../';
                }
                locals.ASSETS = locals.ROOT + locals.ASSETS;

                templateData[name] = locals;

                templates[name] = template; // template.render(locals, partials);
            });

            return templates;
        }

    });
};
