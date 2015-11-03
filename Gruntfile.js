
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
  grunt.registerTask('init', 'Initialize the module and make it ready t run', [
    'check-module-install',
    'classes-dump',
    'cache-init',
    'http-init',
    'db-init'
  ]);

  // Init, run, and open the app in your app.
  grunt.registerTask('run', 'Run the module.', [
    'init',
    'fs-cache-dump',
    'open:browser',
    'watch',
    'start'
  ]);

  // Init, run the app,
  // but keep an open handle on the process after the task has ended
  grunt.registerTask('run-async', 'Run the module.', [
    'init',
    'fs-cache-dump',
    'watch',
    'start-async'
  ]);

  // Generate a new module.
  grunt.registerTask('generate', 'Generate and install a new module', [
    'get-composer',
    'generate-app',
    'install'
  ]);
  grunt.registerTask('composer-install', 'Get composer, then run install', [
    'get-composer',
    'install'
  ]);
  grunt.registerTask('composer-update', 'Get composer, then run update', [
    'get-composer',
    'update'
  ]);

  // default task is to Run.
  grunt.registerTask('default', ['run']);
};
