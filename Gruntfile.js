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
    grunt.loadNpmTasks('grunt-contrib-compass');

    // build order
    grunt.registerTask('default',
    [
        'jshint',

        // start new build
        'htmlizr:prod',

        // compile Sass to ./build/assets/css/
        'compass:prod',

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
                tasks: ['compass:prod'],
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

        compass: {
            prod: {
                options: {
                    sassDir: 'src/scss',
                    imagesDir: 'src/img',
                    fontsDir: 'src/fonts',
                    cssDir: 'build/assets/css',
                    noLineComments: true,
                    outputStyle: 'compact' //'compressed',
                }
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
                ]
            }
        },

        svg2png: {
            prod: {
                files: [
                    { src: ['build/assets/img/**/*.svg'] }
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
