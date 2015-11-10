
var fs = require('fs');
var grunt = require("grunt");
var processHelper = require("../lib/process-helper");
var php = require("../lib/php-helper");

var composerHelper = {};

composerHelper.verbose = true;
composerHelper.pharUrl = 'https://getcomposer.org/installer';
composerHelper.binPath = 'composer';
composerHelper.spawn = function(cmd, done, voidStdout){
  if (composerHelper.verbose) cmd += " -v";
  if (composerHelper.binPath.match(/phar/)) {
    return php.spawn(composerHelper.binPath+' '+cmd, done, voidStdout);
  }
  return processHelper.spawn('composer '+cmd, done, voidStdout);
};

module.exports = composerHelper;
