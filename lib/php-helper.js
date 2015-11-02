var processHelper = require("../lib/process-helper");

var phpHelper = {};
phpHelper.phpPath = 'php';
phpHelper.phpOpts = '';
phpHelper.verbose = true;
phpHelper.init = function () {
  if (process.platform.match(/win/)) {
    phpHelper.phpOpts += ' -d opcache.enable_cli=0 '; // see https://github.com/zendtech/ZendOptimizerPlus/issues/167
  }
};

phpHelper.spawn = function(cmd, done, voidStdout){
  return processHelper.spawn( phpHelper.phpPath +' '+phpHelper.phpOpts+' '+ cmd, done, voidStdout);
};
module.exports = phpHelper;
