
var php = require("./php-helper");

var cHelper = {};
cHelper.verbose = true;
cHelper.spawn = function(cmd, done, voidStdout){
  if (cHelper.verbose) cmd += " -v";
  return php.spawn( ' cli.php '+ cmd, done, voidStdout);
};

module.exports = cHelper;
