var exec = require('child_process').exec;
var grunt = require('grunt');
var processHelper = {};

var childs = [];
process.on('SIGINT', function() {
  childs.forEach(function (destroyChild) {
    destroyChild(true);
  })
});
process.on('exit', function() {
  childs.forEach(function (destroyChild) {
    destroyChild();
  })
});
processHelper.spawn = function(cmd, done, voidStdout){
  var killed = false;
  var stdout = '';
  var stderr = '';

  grunt.log.subhead(cmd)

  var child = exec(cmd, { stdio: 'pipe' },
    function (error) {
      if (!killed && error !== null) {
        grunt.log.error('process exec error: ' + error);
      }
      if(done) done(error, stdout, stderr);
    });
  child.stdout.on('data', function (d){
    if (!voidStdout) {
      grunt.log.success((''+d).replace(/\s+$/, ''))
    }
    stdout += ''+d;
  });
  child.stderr.on('data', function (d){
    grunt.log.error((''+d).replace(/\s+$/, ''))
    stderr += ''+d;
  });
  childs.push(function (wasKilled) {
    killed = wasKilled;
    child.kill();
  })
  return child;
};

module.exports = processHelper;
