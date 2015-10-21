
module.exports = function (grunt) {

  // load the C oriented tasks
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

  // Initialize the app to make it ready to run.
  grunt.registerTask('init', [
    'check-module-install',
    'classes-dump',
    'cache-init',
    'http-init',
    'db-init'
  ]);

  // Init, run, and open the app in your app.
  grunt.registerTask('run', [
    'init',
    'fs-cache-dump',
    'open:browser',
    'watch',
    'start'
  ]);

  // Generate a new module.
  grunt.registerTask('generate', [
    'get-composer',
    'generate-app'
  ]);

  // default task is to Run.
  grunt.registerTask('default', ['run']);
};
