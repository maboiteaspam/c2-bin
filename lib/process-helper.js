var spawn = require('child_process').spawn;
var grunt = require('grunt');
var once = require('once');
var parser = require('cline-parser');
var processHelper = {};

var childs = [];
process.on('SIGINT', function() {
  processHelper.cleanUp(true);
  process.exit();
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
processHelper.removeChild = function(child){
  var index = childs.indexOf(child);
  if (index!==false) childs[index] = null;
};
processHelper.spawn = function(cmdStr, done, voidStdout){
  var killed = false;
  var stdout = '';
  var stderr = '';

  grunt.log.subhead(cmdStr)

  var cmd = parser(cmdStr);
  var child;
    child = spawn(cmd.prg, cmd.args, { stdio: 'pipe' });
  if (voidStdout!==false) {
    child.stdout.pipe(process.stdout);
    child.stderr.pipe(process.stderr);
  }
  child.stdout.on('data', function (d){
    stdout += ''+d;
  });
  child.stderr.on('data', function (d){
    stderr += ''+d;
  });
  var onProcessEnds = once(function processEnded(errOrCode) {
    processHelper.removeChild(child);
    if (!killed && errOrCode !== 0) {
      grunt.log.error('process exec code: ' + errOrCode);
    }
    if(done) done(errOrCode, stdout, stderr);
  });
  child.on('error', onProcessEnds);
  child.on('close', onProcessEnds);
  childs.push(function (wasKilled) {
    killed = wasKilled;
    child.kill();
  })
  return child;
};

module.exports = processHelper;
