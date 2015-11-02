var fs = require('fs');
var path = require('path');
var inquirer = require("inquirer");
var minimist = require('minimist');
var phpHelper = require("../lib/php-helper");
var composerHelper = require("../lib/composer-helper");
var exec = require('child_process').exec;

module.exports = function (grunt) {

  phpHelper.verbose = !!grunt.option('verbose');
  composerHelper.verbose = !!grunt.option('verbose');

  if (!grunt.option('composer') && fs.existsSync("composer.phar")) {
    composerHelper.binPath = 'composer.phar '
  }
  phpHelper.phpPath = grunt.option('php') || 'php';
  phpHelper.init()

  grunt.registerTask('get-composer', 'Get composer.phar', function() {
    var done = this.async();

    composerHelper.spawn('--version', function (error, stdout, stderr) {
      grunt.log.write(stdout);
      if (error) {
        grunt.log.warn("Downloading composer installer ...");
        grunt.log.warn("");
        grunt.log.warn("https://getcomposer.org/");
        grunt.log.warn("");
        composerHelper.download(done);
      } else {
        grunt.log.ok("Composer is in your project, let s move on !");
        done()
      }
    }, true);
  });

  grunt.registerTask('check-module-install', 'Check if module is locally installed, and do install when needed.', function() {
    if (fs.existsSync("vendor/autoload.php") && !grunt.option('force')) {
      return grunt.log.ok("Module is installed, let s move on !");
    }
    var done = this.async();

    composerHelper.spawn('install', function (error, stdout, stderr) {
      if (error) {
        grunt.log.warn("Module was not installed correctly ...");
        grunt.log.warn("");
        done();
      } else {
        grunt.log.ok("Moudle is now setup, let s move on !");
        done()
      }
    }, true);
  });

  grunt.registerTask('classes-dump', 'Generate autoloader for composer', function() {
    var done = this.async();
    composerHelper.spawn('dumpautoload', function () {
      done();
    });
  });

  grunt.registerTask('update', 'Run composer update command', function() {
    var done = this.async();
    inquirer.prompt([{
      type:'list',
      message:"Would you like to run composer UPDATE command now ?",
      choices: ['yes, please get it done', 'no, i will do it later'],
      name:'proceed'
    }], function( answers ) {
      var proceed = answers.proceed;
      if (proceed==="yes, please get it done") {
        composerHelper.spawn('update', function () {
          done();
        });
      } else {
        done();
      }
    });
  });

  grunt.registerTask('install', 'Run composer install command', function() {
    var done = this.async();
    inquirer.prompt([{
      type:'list',
      message:"Would you like to run composer INSTALL command now ?",
      choices: ['yes, please get it done', 'no, i will do it later'],
      name:'proceed'
    }], function( answers ) {
      var proceed = answers.proceed;
      if (proceed==="yes, please get it done") {
        composerHelper.spawn('install', function () {
          done();
        });
      } else {
        done();
      }
    });
  });

  grunt.registerTask('link', 'Link another local package to that project. Useful for development under windows.', function() {
    var argv = minimist(process.argv.slice(2));

    var p = argv.p || argv.path;

    if (!fs.existsSync(p)) {
      return grunt.log.error("path must exists: "+ p );
    }

    if (!fs.existsSync(p+"/composer.json")) {
      return grunt.log.error("This folder does not have the reuired composer.json file: "+ p );
    }

    var packageComposer = JSON.parse(fs.readFileSync(p+"/composer.json"));
    var packageName = packageComposer.name;

    var localComposer;
    try{
      localComposer = JSON.parse(fs.readFileSync("composer.json"))
    }catch(ex){
      grunt.log.error("Composer file is malformed, please check composer.json");
      grunt.log.error(ex.message)
      return false;
    }

    if (!localComposer.repositories) localComposer.repositories = [];
    if (!localComposer.require) localComposer.require = {};

    if (localComposer.require[packageName]) {
      grunt.log.error("overwriting dependency "+packageName+":"+localComposer.require[packageName]+" to dev-master");
    }
    localComposer.require[packageName] = "dev-master";

    var found = false;
    localComposer.repositories.forEach(function (v) {
      if (v.url.match(packageName)) {
        found = true;
      }
    })
    if (!found) {
      localComposer.repositories.push({
        type: "path",
        url: p
      });
    }

    fs.writeFileSync ( "composer.json",
      JSON.stringify(localComposer, null, 2)
    );

    grunt.log.warn("Setting up folder " + 'vendor/'+packageName);
    grunt.file.mkdir('vendor/'+packageName);

    grunt.file.delete('vendor/'+packageName);
    if (process.platform.match(/win/)) {
      exec('MKLINK /J vendor\\'+packageName.replace(/\//, '\\')+' '+p+'');
    } else {
      exec("ln -s "+path.relative(p, "vendor/"+packageName+"/../")+" vendor/"+packageName);
    }

    grunt.log.subhead("All done!");
    grunt.log.ok("Don't forget to run composer update");
    grunt.log.writeln("");
    grunt.log.writeln("  php composer.phar update");
    grunt.log.writeln("");

  });

};
