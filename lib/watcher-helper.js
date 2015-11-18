var grunt = require('grunt');
var chokidar = require('chokidar');
var watcherHelper = {};

watcherHelper.spawn = function (watchPaths) {
  grunt.log.ok('Watching paths');
  grunt.log.writeflags(watchPaths)
  // Full list of options. See below for descriptions.
  return chokidar.watch(watchPaths, {
    persistent: true,

    ignoreInitial: true,
    followSymlinks: true,
    cwd: '.',

    //usePolling: false,
    alwaysStat: false,
    depth: 3,
    interval: 250,

    ignorePermissionErrors: false,
    atomic: true
  })
};

module.exports = watcherHelper;
