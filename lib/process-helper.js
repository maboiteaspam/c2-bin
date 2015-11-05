var spawn = require('child_process').spawn;
var grunt = require('grunt');
var parser = require('cline-parser');
var processHelper = {};

var childs = [];
process.on('SIGINT', function() {
  processHelper.cleanUp(true);
});
process.on('exit', function() {
  processHelper.cleanUp()
});
processHelper.cleanUp = function(asKilledSignal){
  childs.forEach(function (destroyChild) {
    if (destroyChild)
      destroyChild(asKilledSignal);
  })
};
processHelper.spawn = function(cmdStr, done, voidStdout){
  var killed = false;
  var stdout = '';
  var stderr = '';

  grunt.log.subhead(cmdStr)

  var cmd = parser(cmdStr);
  var child = spawn(cmd.prg, cmd.args, { stdio: 'pipe' });
  child.stdout.pipe(process.stdout);
  child.stderr.pipe(process.stderr);
  child.stdout.on('data', function (d){
    stdout += ''+d;
  });
  child.stderr.on('data', function (d){
    stderr += ''+d;
  });
  child.on('close', function (code) {
    var index = childs.indexOf(child);
    if (index!==false) childs[index] = null;
    if (!killed && code !== 0) {
      grunt.log.error('process exec code: ' + code);
    }
    if(done) done(code, stdout, stderr);
  });
  childs.push(function (wasKilled) {
    killed = wasKilled;
    child.kill();
  })
  return child;
};

module.exports = processHelper;
