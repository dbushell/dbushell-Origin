module.exports = function(grunt)
{
    // local tasks
    grunt.loadTasks('tasks');

    // npm module tasks
    grunt.loadNpmTasks('grunt-svgmin');
    grunt.loadNpmTasks('grunt-svg2png');
    grunt.loadNpmTasks('grunt-imageoptim');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-autoprefixer');

    grunt.registerTask('css', ['sass:prod', 'autoprefixer']);

    // build order
    grunt.registerTask('default',
    [
        'jshint',

        // start new build
        'htmlizr:prod',

        // compile Sass to ./build/assets/css/
        'sass:prod',
        'autoprefixer',

        // copy images, fonts, and JavaScript to ./build/assets/
        'copy:prod',

        // minimize JavaScript to ./build/assets/js/
        'uglify:prod',

        // optimise SVG in ./build/assets/img/
        'svgmin:prod',

        // rasterize SVG in ./build/assets/img/
        'svg2png:prod',

        // optimise images in ./build/assets/img/
        'imageoptim:prod'

    ]);

    grunt.registerTask('server', [/*'default',*/ 'webserver']);

    grunt.initConfig({

        pkg: '<json:package.json>',

        watch: {

            css: {
                files: 'src/scss/**/*.scss',
                tasks: ['sass:prod', 'autoprefixer'],
                options: {
                  interrupt: true
                }
            },

            js: {
                files: 'src/js/**/*.js',
                tasks: ['uglify:prod'],
                options: {
                  interrupt: true
                }
            },

            html: {
                files: 'templates/**/*.html',
                tasks: ['htmlizr:prod'],
                options: {
                  interrupt: true
                }
            }
        },

        jshint: {
            all: ['Gruntfile.js', 'tasks/**/*.js']
        },

        htmlizr: {
            prod: {
                buildDir: 'build',
                assetsDir: 'assets',
                templateDir: 'templates',
                src: ['templates/**/*.html']
            }
        },

        sass: {
            prod: {
                options: {
                    style: 'compact' // nested, compact, compressed, expanded
                },
                files: [{
                    expand: true,
                    cwd: 'src/scss',
                    src: ['*.scss'],
                    dest: 'build/assets/css',
                    ext: '.css'
                }]
            }
        },

        autoprefixer: {
            // options: {
            //     browsers: ['last 2 version', 'iOS5', 'ie 8', 'ie 9']
            // },
            multiple_files: {
                expand: true,
                flatten: true,
                src: 'build/assets/css/*.css',
                dest: 'build/assets/css/'
            }
        },

        uglify: {
            options: {
                preserveComments: 'some'
            },
            prod: {
                files: [
                    {
                        expand: true,
                        cwd: 'src/',
                        src: ['js/**/*.js', "!js/**/*.min.js"],
                        dest: 'build/assets/',
                        ext: '.min.js'
                    }
                ]
            }
        },

        svgmin: {
            prod: {
                files: [
                    { expand: true, cwd: 'src/', src: ['img/**/*.svg'], dest: 'build/assets/' }
                ],
                options: {
                    plugins: [{
                        removeViewBox: false
                    }]
                }
            }
        },

        svg2png: {
            prod: {
                files: [
                    { cwd: 'build/assets/img/', src: ['**/*.svg'], dest: 'build/assets/img/' }
                ]
            }
        },

        copy: {
            prod: {
                files: [
                    { expand: true, cwd: 'src/', src: ['fonts/**/*'], dest: 'build/assets/' },
                    { expand: true, cwd: 'src/', src: ['img/**/*'], dest: 'build/assets/' },
                    { expand: true, cwd: 'src/', src: ['js/**/*'], dest: 'build/assets/' }
                ]
            }
        },

        imageoptim: {
            prod: {
                src: ['build/assets/img'],
                options: {
                    quitAfter: true
                }
            }
        }

    });

};
