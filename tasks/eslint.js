var path = require('path');
var async = require('async');
var processHelper = require("../lib/process-helper");

module.exports = function (grunt) {

  grunt.registerTask('lint', 'Lint assets under src/assets', function() {
    async.series([
      function (done) {
        processHelper.spawn('eslint app/src/MyBlog/assets/**js', function(){done()});
      },
      function (done) {
        processHelper.spawn('csslint app/src/MyBlog/assets/', function(){done()});
      }
    ], this.async());
  });
};
