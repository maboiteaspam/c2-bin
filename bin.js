#!/usr/bin/env node

'use strict';

// binary loader for c2-bin.
// inspired by original grunt binary loader,

process.title = 'c2-bin - grunt';

// Especially badass external libs.
var findup = require('findup-sync');
var resolve = require('resolve').sync;

// Internal libs.
var options = require('grunt-cli/lib/cli').options;
var completion = require('grunt-cli/lib/completion');
var info = require('grunt-cli/lib/info');
var fs = require('fs');
var path = require('path');


var basedir = process.cwd();
var libdir = __dirname;
// path of the Gruntfile.js, can be the default one provided with this module, or your own on the cwd.
var gruntpath;
var gruntfile = fs.existsSync(path.join(basedir, 'Gruntfile.js'))
  ? path.join(basedir, 'Gruntfile.js')
  : path.join(libdir, 'Gruntfile.js');

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
require(gruntpath).cli({base: basedir, gruntfile: gruntfile});
