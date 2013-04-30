/*!
 *
 *  Copyright (c) David Bushell | @dbushell | http://dbushell.com/
 *
 */

var fs = require("fs"),
    path = require("path");

module.exports = function(grunt)
{
    'use strict';

    /**
     * remove dir and all its sub-directoies and files recursively
     * https://gist.github.com/liangzan/807712
     */
    var removeDir = function(dir)
    {
        var files;
        try {
            files = fs.readdirSync(dir);
        } catch(e) {
            return;
        }
        files.forEach(function(file)
        {
            var p = dir + '/' + file;
            if (fs.statSync(p).isFile()) {
                fs.unlinkSync(p);
            } else {
                removeDir(p);
            }
        });
        fs.rmdirSync(dir);
    };

    /**
     * make dir and its structure recursively
     * https://github.com/substack/node-mkdirp
     */
    var makeDir = function(p, r)
    {
        var dirs = p.split('/'),
            dir  = dirs.shift(),
            root = (r || '') + dir + '/';
        try {
            fs.mkdirSync(root);
        } catch (err) {
            if(!fs.statSync(root).isDirectory()) {
                throw new Error(err);
            }
        }
        return !dirs.length || makeDir(dirs.join('/'), root);
    };

    /**
     * remove matching files recursively
     */
    var clearDir = function(dp, rtype)
    {
        var fp, i, files = null;
        try {
            files = fs.readdirSync(dp);
        } catch(err) { return; }
        if (files.length) {
            for (i = 0; i < files.length; i++)
            {
                fp = dp + '/' + files[i];
                if (fs.statSync(fp).isFile() && rtype.test(fp)) {
                    fs.unlinkSync(fp);
                } else {
                    clearDir(fp, rtype);
                }
            }
        }
    };

    /**
     * strip leading and trailing slashes
     */
    var normalizePath = function(p)
    {
        return (typeof p === 'string' ? p : '').trim().replace(/^\/|\/$/g, '');
    };

    /**
     * register Grunt task
     */

     // htmlizr: {
     //     dev: {
     //         buildDir: 'build',
     //         assetsDir: 'assets',
     //         templateDir: 'templates',
     //         src: ['templates/**/*.html']
     //     }
     // }

    grunt.registerMultiTask('htmlizr', 'HTML build.', function()
    {
        var done = this.async(),

            files = grunt.file.expand(this.data.src),

            // multiple passes will replace includes within includes
            passes = parseInt(this.data.passes, 10) || 3,

            // build directory
            buildDir = normalizePath(this.data.buildDir) || 'build',

            // assets directory
            assetsDir = normalizePath(this.data.assetsDir),

            // template root directory
            templateDir = normalizePath(this.data.templateDir) || '',

            // file caches
            includes  = [],
            templates = [],

            // build in progress
            building  = false;

        /**
         * callback to end the task
         */
        var complete = function(err)
        {
            if (err) {
                done(err);
            } else {
                done();
            }
        };

        /**
         * cache include or template file ready for build
         */
        var cacheFile = function(part)
        {
            (part.name.charAt(0) === '_' ? includes : templates).push(part);
            fs.readFile(normalizePath(templateDir + '/' + part.path), { encoding: 'utf8' }, function(err, data)
            {
                if (err) {
                    grunt.log.error('Failed to read *' + part.path + '*');
                    complete(err);
                    return;
                }
                part.data = data.toString();
                build();
            });
        };

        /**
         * retrieve a cached file from reference (name or path)
         */
        var getCachedFile = function(ref, cache)
        {
            var ret = null;
            cache.forEach(function(item) {
                if (ref === item.name || ref === item.path) {
                    ret = item;
                }
            });
            return ret;
        };

        /**
         * check if all files have been cached
         */
        var cacheReady = function(cache)
        {
            var count = 0;
            cache.forEach(function(item) {
                if (item.data) {
                    count++;
                }
            });
            return count === cache.length;
        };

        /**
         * find all matches for a single template tag
         */
        var getTags = function(tmp, rtag)
        {
            var match,
                found = [];

            while((match = rtag.exec(tmp.data)) !== null)
            {
                found.push({
                    'tag': match[1],
                    'ref': normalizePath(match[2].trim()),
                    'offset': match.index
                });
            }
            return found;
        };

        /**
         * parse matches backwards to maintain offset
         */
        var parseTags = function(tmp, regex, callback)
        {
            var i, match, tags = getTags(tmp, regex);
            for (i = tags.length - 1; i >= 0; i--) {
                match = tags[i];
                match.head = tmp.data.substring(0, match.offset);
                match.tail = tmp.data.substring(match.offset + match.tag.length);
                callback(match);
            }
            return tags.length;
        };

        /**
         * replace includes, e.g. <!-- @include _header.html -->
         */
        var parseIncludes = function(tmp)
        {
            return parseTags(tmp, new RegExp('(<!--[ \t]*?@include[ \t]*?(.*?)-->)', 'g'), function(match)
            {
                var incref = getCachedFile(match.ref, includes);
                if (incref) {
                    tmp.data = match.head + incref.data + match.tail;
                } else {
                    tmp.data = match.head + match.tail;
                    grunt.log.error('Unknown include *' + match.ref + '* in *' + tmp.path + '*');
                }
            });
        };

        /**
         * replace relative paths and assets
         */
        var parsePaths = function(tmp)
        {
            // e.g. <!-- @path index.html -->
            parseTags(tmp, new RegExp('(<!--[ \t]*?@path[ \t]*?(.*?)-->)', 'g'), function(match)
            {
                var tmpref = getCachedFile(match.ref, templates);
                if (tmpref) {
                    tmp.data = match.head + (path.relative(tmp.path, tmpref.path).replace(/^\.\.\//, '') || tmpref.name) + match.tail;
                } else {
                    tmp.data = match.head + '#' + match.tail;
                    grunt.log.error('Unknown path *' + match.ref + '* in *' + tmp.path + '*');
                }
            });
            // e.g. <!-- @asset css/style.css -->
            parseTags(tmp, new RegExp('(<!--[ \t]*?@asset[ \t]*?(.*?)-->)', 'g'), function(match)
            {
                tmp.data = match.head + path.relative(tmp.path, assetsDir + '/' + match.ref).replace(/^\.\.\//, '') + match.tail;
                // if (!fs.existsSync(baseDir + match.ref)) {
                //     grunt.log.error('Unkown asset *' + match.ref + '* in *' + tmp.path + '*');
                // }
            });
        };

        var build = function()
        {
            if (building || !cacheReady(includes) || !cacheReady(templates)) {
                return;
            }
            building = true;

            // remove existing build
            // if (fs.existsSync(buildDir)) {
            //     removeDir(buildDir);
            // }
            if (!fs.existsSync(buildDir)) {
                fs.mkdirSync(buildDir);
            } else {
                clearDir(buildDir, new RegExp('/\\.html$/', 'i'));
            }

            var rendered = 0;

            templates.forEach(function(tmp)
            {
                // ensure directory structure
                var buildpath = buildDir + '/' + tmp.path;
                makeDir(path.dirname(path.resolve(buildpath)));

                fs.open(buildpath, 'w', function(err, fd)
                {
                    if (err) {
                        grunt.log.error('Error writing *' + buildpath + '*');
                        complete(err);
                        return;
                    }

                    var i, buffer;

                    for (i = 0; i < passes; i++) {
                        if (!parseIncludes(tmp)) {
                            break;
                        }
                    }
                    parsePaths(tmp);

                    buffer = new Buffer(tmp.data);
                    fs.writeSync(fd, buffer, 0, buffer.length);

                    if (++rendered >= templates.length) {
                        complete();
                    }
                });
            });
        };

        // cache all files
        files.forEach(function(file)
        {
            cacheFile({
                'name': path.basename(file),
                'path': file.replace(new RegExp('^' + templateDir + '/'), ''),
                'data': null
            });
        });

        build();

    });
};
