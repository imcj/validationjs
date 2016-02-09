var path = require("path")

module.exports = function(grunt) {
  grunt.initConfig({
    express: {
      livereload: {
          options: {
            port: 3000,
            showStack: true,
            serverreload: true,
            livereload: true,
            server: path.resolve("./bin/www"),
            debug: true,
            bases: path.resolve("./public")
          }
      }
    }
  })
  grunt.loadNpmTasks('grunt-express');
  // grunt.registerTask('express', ['livereload-start', 'express'])
  grunt.registerTask('default', []);
}
