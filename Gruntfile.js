module.exports = function(grunt)
{
    // local tasks
    grunt.loadTasks('tasks');

    // npm module tasks
    grunt.loadNpmTasks('svgo-grunt');
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
        'svgo:prod',

        // rasterize SVG in ./build/assets/img/
        'rasterize:prod',

        // optimise images in ./build/assets/img/
        'imageoptim:prod'

    ]);

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
                        src: ['js/**/*.js'],
                        dest: 'build/assets/',
                        ext: '.min.js'
                    }
                ]
            }
        },

        svgo: {
            prod: {
                files: 'build/assets/img/**/*.svg'
            }
        },

        rasterize: {
            prod: {
                files: 'build/assets/img/**/*.svg'
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
                files: [
                    { expand: true, cwd: 'build/', src: ['assets/img/**/*'], filter: 'isDirectory' }
                ],
                options: {
                    quitAfter: true
                }
            }
        }

    });

};
