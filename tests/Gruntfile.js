/* 

The npm install of grunt is removed for bloating reasons.
If you would like to test using this file, run the following:

    npm i grunt --save
    npm i grunt-postcss --save
    
This will let you run `grunt postcss` to get Grunt test output 
for this file.

*/

module.exports = function(grunt) {

  grunt.initConfig({

    postcss: {

      options: {
        processors: [
            require('postcss-colour-functions')()
        ]
      },
      dist: {
        src: 'src/style.css',
        dest: 'dest/style.css'
      }

    }
 
  });

  grunt.loadNpmTasks('grunt-postcss');

};