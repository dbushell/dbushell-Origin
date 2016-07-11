module.exports = function(grunt)
{
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-postcss');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('dbushell-grunt-mustatic');

  grunt.registerTask('default', ['css', 'mustatic']);
  grunt.registerTask('css', ['sass', 'postcss']);

  grunt.initConfig({

    pkg: '<json:package.json>',

    watch: {

      css: {
        files: 'src/scss/**/*.scss',
        tasks: ['css'],
        options: {
          interrupt: true
        }
      },

      html: {
        files: ['src/html/**/*.html', 'src/html/**/*.json'],
        tasks: ['mustatic'],
        options: {
          interrupt: true
        }
      }
    },

    sass: {
      all: {
        options: {
          style: 'compact'
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

    postcss: {
      options: {
        map: false,
        processors: [
          require('autoprefixer')({ browsers: ['last 3 version', 'ie 9', 'ie 10'] })
        ]
      },
      all: {
        src: 'build/assets/**/*.css'
      }
    },

    mustatic: {
      options: {
        src: 'src/html',
        dest: 'build',
        navStates: true
      },
      all: {
        globals: {
          assets: 'assets/'
        }
      }
    }

  });

};
