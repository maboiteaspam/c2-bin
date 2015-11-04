var path = require('path');
var watcherHelper = require("../lib/watcher-helper");
var cHelper = require("../lib/c-helper");
var phpHelper = require("../lib/php-helper");

module.exports = function (grunt) {

  phpHelper.verbose = !!grunt.option('verbose');
  cHelper.verbose = !!grunt.option('verbose');

  phpHelper.phpPath = grunt.option('php') || 'php';
  phpHelper.init()

  grunt.registerTask('db-init', 'Initialize the database and the schema for the registered modules', function() {
    cHelper.spawn('db:init', this.async());
  });
  grunt.registerTask('cache-init', 'Build assets and other pre compiled stuff.', function() {
    cHelper.spawn('cache:init', this.async());
  });
  grunt.registerTask('http-init', 'Initialize a bridge file for the http server.', function() {
    cHelper.spawn('http:bridge', this.async());
  });
  grunt.registerTask('check-schema', 'Refresh the DB schema for the registered modules', function() {
    cHelper.spawn('db:refresh', this.async());
  });
  grunt.registerTask('fs-cache-dump', 'Dumps path of resources for the registered modules to feed the watcher process', function() {
    var done = this.async();
    var path_to_watch = [];

    cHelper.spawn('fs-cache:dump', function (error, stdout, stderr) {
      var data = JSON.parse(stdout);
      data.forEach(function(cache){
        if (cache.config
          && cache.config.paths
          && cache.config.paths.length) {
          grunt.log.success('paths %j', cache.config.paths);
          path_to_watch = path_to_watch.concat(cache.config.paths)
        } else {
          grunt.log.success('items count %s', cache.items.length);
          Object.keys(cache.items).forEach(function(p){
            path_to_watch.push(p)
          })
        }
      });
      grunt.config.set('path_to_watch', path_to_watch);
      done();
    }, true);
  });



  grunt.registerTask('watch', 'Start watching the application assets for re-build.', function() {
    var watchPaths = grunt.config.get('path_to_watch');
    if (watchPaths) {
      watcherHelper.spawn( watchPaths ).on('all', function(event, filePath){
        cHelper.spawn('cache:update '+event+' '+filePath, function (error) {
          if (error) grunt.log.error(error);
          else grunt.log.ok('Al done');
        });
      })
    }
  });

  grunt.registerTask('start', 'Starts web server for local development purpose', function() {
    var done = this.async();
    phpHelper.spawn('-S localhost:8000 -t www app.php', function () {
      done();
    });
  });

  grunt.registerTask('start-async', 'Starts web server for local, and returns asap', function() {
    var done = this.async();// yes, it won t return at all
    phpHelper.spawn('-S localhost:8000 -t www app.php', function () {});
    setTimeout(done, 1000);
  });

  grunt.registerTask('kill-async', 'Kills the remaining process of start-async to let grunt exit properly', function() {
    phpHelper.cleanUp()
  });
};
