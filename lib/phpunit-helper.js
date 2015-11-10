
var fs = require('fs');
var grunt = require('grunt');
var processHelper = require("../lib/process-helper");
var phpHelper = require("../lib/php-helper");


var phpunitHelper = {};

phpunitHelper.verbose = true;
phpunitHelper.pharUrl = 'https://phar.phpunit.de/phpunit.phar';
phpunitHelper.binPath = 'phpunit';
phpunitHelper.parseVersion = function(str){
// PHPUnit 5.0.8 by Sebastian Bergmann and contributors.
  return str.match(/\s([0-9]+[.][0-9]+[.][0-9]+)/)[0]
};
phpunitHelper.spawn = function(cmd, done, voidStdout){
  if (phpunitHelper.binPath.match(/phar/)) {
    return phpHelper.spawn(' '+phpunitHelper.binPath+' '+cmd, done, voidStdout);
  }
  return processHelper.spawn(phpunitHelper.binPath+' '+ cmd, done, voidStdout);
};

module.exports = phpunitHelper;
