module.exports = function (grunt) {

  grunt.loadTasks(__dirname + '/tasks/');
  grunt.loadTasks(__dirname + '/node_modules/grunt-open/tasks/');

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON(__dirname + '/package.json'),
    dumps_file_path: [],

    open : {
      browser : {
        path: 'http://127.0.0.1:8000/'
      },
      options: {
        delay: 3000
      }
    }
  });

  // Default task(s).
  grunt.registerTask('init', [
    'classes-dump',
    'cache-init',
    'http-init',
    'db-init'
  ]);
  grunt.registerTask('run', [
    'init',
    'fs-cache-dump',
    'open:browser',
    'watch',
    'start'
  ]);
  grunt.registerTask('generate', [
    'get-composer',
    'generate-app'
  ]);
  grunt.registerTask('default', ['run']);
};
