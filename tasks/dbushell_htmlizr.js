/*!
 *
 *  Copyright (c) David Bushell | @dbushell | http://dbushell.com/
 *
 *  based on: https://github.com/haio/grunt-mustache-html/blob/master/tasks/mustache_html.js
 *  Hogan: https://github.com/twitter/hogan.js
 *  Jekyll: http://jekyllrb.com/docs/templates/
 *  Handlebars: http://handlebarsjs.com/
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

        globals.ASSETS = 'assets/';

        if (grunt.file.exists(baseData)) {
            globals = merge(globals, JSON.parse(grunt.file.read(baseData)));
        }

        var templateData = {},

            partDir  = options.src + '/partials',
            pageDir  = options.src + '/pages',

            partials = compile(partDir),
            pages    = compile(pageDir, partials);


        // console.log(partials['header'].render(globals, partials));

        each(pages, function(page, name)
        {
            partials.content = page;
            var render = base.render(templateData[name], partials);

            // prefix for relative URLs
            var rel = '', depth = (name.match(/\//g)||[]).length;
            while(depth--) {
                rel += '../';
            }

            if (rel.length) {

                var head, tail, match, offset, found = [],
                    regex = /(href|src)="(.*?)"/ig;

                while((match = regex.exec(render)) !== null) {
                    // ignore external URLs that start with a schema
                    if (! /^([a-z]+):/.test(match[2])) {
                        found.push(match);
                    }
                }

                // replace relative URLs in reverse to avoid offset changes
                found.reverse().forEach(function(match, i)
                {
                    // separate render before and after URL
                    offset = match.index + match[1].length + 2;
                    head = render.substring(0, offset);
                    tail = render.substring(offset + match[2].length);

                    // stitch render back together
                    render = head + rel + match[2] + tail;
                });
            }


            grunt.file.write(options.dist + '/' + name + '.html', render);
        });

        function compile(path, partials)
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

                var templateSrc = grunt.file.read(absPath),
                    template    = hogan.compile(templateSrc);

                if (grunt.file.exists(dataPath)) {
                    data = JSON.parse(grunt.file.read(dataPath));
                    locals = merge(locals, data);
                }

                templateData[name] = locals;
                templates[name] = template; // template.render(locals, partials);
            });

            return templates;
        }

    });
};
