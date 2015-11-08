
var fs = require('fs');
var got = require("got");
var grunt = require('grunt');
var once = require('once');
var processHelper = require("../lib/process-helper");
var phpHelper = require("../lib/php-helper");


var phpunitHelper = {};

phpunitHelper.verbose = true;
phpunitHelper.pharUrl = 'https://phar.phpunit.de/phpunit.phar';
phpunitHelper.binPath = 'phpunit';
phpunitHelper.download = function (then) {
  var gotIt = once(function (err) {
    if (err) grunt.log.err(err)
    if (then) then(err)
  });
  return got.stream(phpunitHelper.pharUrl)
    .on('end', gotIt)
    .on('close', gotIt);
};
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
