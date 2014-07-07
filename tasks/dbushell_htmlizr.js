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
            base    = hogan.compile(grunt.file.read(basePath)); // , { sectionTags: [{o:'_i', c:'i'}] }

        var globals = merge({
                'assets': 'assets/'
            },
            this.data.globals);

        if (grunt.file.exists(baseData)) {
            globals = merge(globals, JSON.parse(grunt.file.read(baseData)));
        }

        var data     = { },
            partials = compile(options.src + '/partials'),
            pages    = compile(options.src + '/pages', partials);

        var pre_render  = [ ],
            post_render = [ ];

        pre_render.push(function(page, name, locals)
        {
            // toggle active navigation items
            if (locals.nav) {
                each(locals.nav.nav__list.nav__item, function(item) {
                    item.class = item.url === data[name].url ? "nav__item--active" : "";
                });
            }
        });

        post_render.push(function(render, name, locals)
        {
            // prefix for relative URLs
            var rel = '',
                depth = (name.match(/\//g)||[]).length;

            while(depth--) { rel += '../'; }

            if (!rel.length) return render;

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

            return render;
        });

        each(pages, function(page, name)
        {
            partials.content = page;

            var locals = data[name];

            // pre-render callbacks
            pre_render.forEach(function(func) {
                func.call(null, page, name, locals);
            });

            // render HTML
            var render = base.render(locals, partials);

            // post-render callbacks
            post_render.forEach(function(func) {
                render = func.call(null, render, name, locals);
            });

            // write file to disk
            grunt.file.write(options.dist + '/' + name + '.html', render);
        });

        function compile(path, partials)
        {
            var templates = { };

            grunt.file.recurse(path, function (absPath, rootDir, subDir, filename)
            {
                if (!filename.match(matcher)) return;

                var relPath  = absPath.substr(rootDir.length + 1),
                    dataPath = absPath.replace(matcher, '.json'),
                    name     = relPath.replace(matcher, ''),
                    locals   = merge({}, globals);

                locals.url = relPath;

                if (grunt.file.exists(dataPath)) {
                    locals = merge(locals, JSON.parse(grunt.file.read(dataPath)));
                }
                data[name] = locals;
                templates[name] = hogan.compile(grunt.file.read(absPath));
            });

            return templates;
        }

    });
};
