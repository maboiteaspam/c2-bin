
var fs = require('fs');
var got = require("got");
var grunt = require("grunt");
var once = require('once');
var processHelper = require("../lib/process-helper");
var php = require("../lib/php-helper");

var composerHelper = {};

composerHelper.verbose = true;
composerHelper.pharPath = 'https://getcomposer.org/installer';
composerHelper.binPath = 'composer';
composerHelper.download = function (then) {
  var oneStrPhpInstaller = "";
  var gotIt = once(function (err) {
    if (err) return grunt.log.err(err), then && then(err);
    grunt.log.warn("...Got it ! Installing composer now...");
    php.spawn('', function () {
      if(then) then();
    }).stdin.write(oneStrPhpInstaller);
  });
  got.stream('https://getcomposer.org/installer')
    .on('data', function (d) {
      if (!oneStrPhpInstaller){
        grunt.log.ok('Found installer...')
      }
      oneStrPhpInstaller += ''+d;
    })
    .on('end', gotIt)
    .on('close', gotIt);
};
composerHelper.spawn = function(cmd, done, voidStdout){
  if (composerHelper.verbose) cmd += " -v";
  if (composerHelper.binPath.match(/phar/)) {
    return php.spawn(composerHelper.binPath+' '+cmd, done, voidStdout);
  }
  return processHelper.spawn('composer '+cmd, done, voidStdout);
};

module.exports = composerHelper;
