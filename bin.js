#!/usr/bin/env node

'use strict';

process.title = 'grunt';

// Especially badass external libs.
var findup = require('findup-sync');
var resolve = require('resolve').sync;

// Internal libs.
var options = require('grunt-cli/lib/cli').options;
var completion = require('grunt-cli/lib/completion');
var info = require('grunt-cli/lib/info');
var path = require('path');


var basedir = process.cwd();
var libdir = __dirname;
var gruntpath;

// Do stuff based on CLI options.
if ('completion' in options) {
  completion.print(options.completion);
} else if (options.version) {
  info.version();
} else if (options.base && !options.gruntfile) {
  basedir = path.resolve(options.base);
} else if (options.gruntfile) {
  basedir = path.resolve(path.dirname(options.gruntfile));
}

try {
  gruntpath = resolve('grunt', {basedir: libdir});
} catch (ex) {
  gruntpath = findup('lib/grunt.js');
  // No grunt install found!
  if (!gruntpath) {
    if (options.version) { process.exit(); }
    if (options.help) { info.help(); }
    info.fatal('Unable to find local grunt.', 99);
  }
}

// Everything looks good. Require local grunt and run it.
var grunt = require(gruntpath);
grunt.cli({base: basedir, gruntfile: libdir+'/Gruntfile.js'});
