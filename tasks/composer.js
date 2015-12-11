var fs = require('fs');
var path = require('path');
var async = require('async');
var inquirer = require("inquirer");
var minimist = require('minimist');
var temp = require('temp');
var phpHelper = require("../lib/php-helper");
var composerHelper = require("../lib/composer-helper");
var dlHelper = require("../lib/dl-helper");
var exec = require('child_process').exec;

module.exports = function (grunt) {

  phpHelper.verbose = !!grunt.option('verbose');
  composerHelper.verbose = !!grunt.option('verbose');

  if (!grunt.option('composer') && fs.existsSync("composer.phar")) {
    composerHelper.binPath = 'composer.phar'
  }
  phpHelper.phpPath = grunt.option('php') || 'php';
  phpHelper.init()

  /**
   * download composer
   */
  grunt.registerTask('get-composer', 'Get composer.phar', function() {
    var done = this.async();

    composerHelper.spawn('--version', function (error, stdout, stderr) {
      grunt.log.write(stdout);
      if (error || grunt.option('force')) {
        grunt.log.warn("Downloading composer installer ...");
        grunt.log.warn("");
        grunt.log.warn("https://getcomposer.org/");
        grunt.log.warn("");
        grunt.file.delete('composer.phar');
        var tempName = temp.path({suffix: '.php'});
        dlHelper.progress(
          dlHelper.download(composerHelper.pharUrl, {encoding:null}, function gotInstaller(){
            phpHelper.spawn(tempName, function gotComposer(){
              grunt.file.delete(tempName)
              done();
            })
          })
        ).pipe(fs.createWriteStream(tempName));

      } else {
        grunt.log.ok("Composer is in your project, let s move on !");
        done()
      }
    }, true);
  });

  /**
   * check if composer install was run
   */
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

  /**
   * use composer to generate a class loader
   */
  grunt.registerTask('classes-dump', 'Generate autoloader for composer', function() {
    var done = this.async();
    composerHelper.spawn('dumpautoload', function () {
      done();
    });
  });

  /**
   * run composer udpate
   */
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

  /**
   * run composer install
   */
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

  /**
   * link a local module to this vendor directory
   */
  grunt.registerTask('link', 'Link another local package to that project. Useful for development under windows.', function() {
    var argv = minimist(process.argv.slice(2));

    var p = argv.p || argv.path;

    if (!fs.existsSync(p)) {
      return grunt.log.error("path must exists: "+ p );
    }

    if (!fs.existsSync(p+"/composer.json")) {
      return grunt.log.error("This folder does not have the required composer.json file: "+ p );
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
      if (v.link && path.resolve(v.url)==path.resolve(p)) {
        found = true;
      }
    })
    if (!found) {
      localComposer.repositories.push({
        link: true,
        type: "path",
        url: p
      });
    }

    fs.writeFileSync ( "composer.json",
      JSON.stringify(localComposer, null, 2)
    );

    var done = this.async();

    var allDone = function (){
      grunt.log.subhead("All done!");
      grunt.log.ok("Don't forget to run composer update");
      grunt.log.writeln("");
      grunt.log.writeln("  php composer.phar update");
      grunt.log.writeln("");
      done();
    };
    var createLink = function (packageName, localPath, then) {
      if (packageName.match(/\//))
        grunt.file.mkdir('vendor/'+packageName.split('/')[0]);

      var t = 'vendor/'+packageName;
      if (grunt.file.exists(t)) {
        var stats = fs.lstatSync(t);
        if (stats.isSymbolicLink()) {
          fs.unlinkSync(t)
        } else {
          grunt.file.delete(t)
        }
      }

      if (process.platform.match(/win/)) {
        fs.symlinkSync(localPath, 'vendor/'+packageName.replace(/\//, '\\'), 'junction');
      } else {
        var k = "vendor/"+(packageName.match(/\//)?packageName.split('/')[0]:packageName)+"/";
        fs.symlinkSync(path.relative(k, localPath), 'vendor/'+packageName);
      }

      if (then) then();
    };
    var confirmBecauseFileExists = function (packageName, then){
      var questions = [
        {
          type: "confirm",
          name: "toBeDeleted",
          message: packageName+' already exists, please confirm to delete it',
          default: false
        }
      ];
      inquirer.prompt( questions, function( answers ) {
        then(!!answers.toBeDeleted);
      });
    };

    if (grunt.file.exists('vendor/'+packageName)) {
      confirmBecauseFileExists(packageName, function( okNok ) {
        if (okNok) createLink(packageName, p), allDone;
      });
    } else {
      createLink(packageName, p, allDone);
    }
  });

  /**
   * re-link modules, useful to run after compose update
   */
  grunt.registerTask('re-link', 'Lookup dependencies from the composer json, select those marked as link, and link', function() {
    //var argv = minimist(process.argv.slice(2));

    var localComposer;
    try{
      localComposer = JSON.parse(fs.readFileSync("composer.json"))
    }catch(ex){
      grunt.log.error("Composer file is malformed, please check composer.json");
      grunt.log.error(ex.message)
      return false;
    }

    if (!localComposer.repositories) localComposer.repositories = [];


    var done = this.async();

    var allDone = function (){
      grunt.log.subhead("All done!");
      grunt.log.ok("Don't forget to run composer update");
      grunt.log.writeln("");
      grunt.log.writeln("  php composer.phar update");
      grunt.log.writeln("");
      done();
    };
    var createLink = function (packageName, localPath, then) {
      if (packageName.match(/\//))
        grunt.file.mkdir('vendor/'+packageName.split('/')[0]);

      var t = 'vendor/'+packageName;
      if (grunt.file.exists(t)) {
        var stats = fs.lstatSync(t);
        if (stats.isSymbolicLink()) {
          fs.unlinkSync(t)
        } else {
          grunt.file.delete(t)
        }
      }

      if (process.platform.match(/win/)) {
        fs.symlinkSync(localPath, 'vendor/'+packageName.replace(/\//, '\\'), 'junction');
      } else {
        var k = "vendor/"+(packageName.match(/\//)?packageName.split('/')[0]:packageName)+"/";
        fs.symlinkSync(path.relative(k, localPath), 'vendor/'+packageName);
      }

      if (then) then();
    };
    var confirmBecauseFileExists = function (packageName, then){
      var questions = [
        {
          type: "confirm",
          name: "toBeDeleted",
          message: packageName+' already exists, please confirm to delete it',
          default: false
        }
      ];
      inquirer.prompt( questions, function( answers ) {
        then(!!answers.toBeDeleted);
      });
    };

    var links = [];
    localComposer.repositories.forEach(function (v) {
      if (v.link && grunt.file.exists(v.link)) {
        links.push(function (next) {
          var packageComposer = JSON.parse(fs.readFileSync(v.link+"/composer.json"));
          var packageName = packageComposer.name;
          if (grunt.file.exists('vendor/'+packageName)) {
            confirmBecauseFileExists(packageName, function( okNok ) {
              if (okNok) {
                createLink(packageName, v.link);
              }
              next()
            });
          } else {
            createLink(packageName, v.link);
            next()
          }
        });
      }
    });
    async.series(links, allDone)

  });

  /**
   * install a github repository
   */
  grunt.registerTask('add-gh-require', 'Add a github repository to the composer.json', function() {
    var argv = minimist(process.argv.slice(2));
    var done = this.async();


    var moduleRepo = argv.m || argv.module;
    var moduleComposer = '';
    var moduleName = '';
    var moduleRequire = 'dev-master';

    if (!moduleRepo || moduleRepo===true) {
      grunt.log.warn('Please use ')
      grunt.log.warn('c2-bin require-gh -m user/project')
      grunt.log.warn('c2-bin require-gh --module user/project')
      grunt.fail.warn('command misspelled')
    }

    var localComposer;
    try{
      localComposer = JSON.parse(fs.readFileSync("composer.json"))
    }catch(ex){
      grunt.log.error("Composer file is malformed, please check composer.json");
      grunt.log.error(ex.message)
      return done(ex);
    }

    if (!localComposer.repositories) localComposer.repositories = [];
    if (!localComposer.require) localComposer.require = {};

    var gotIt = function () {
      moduleComposer = JSON.parse(moduleComposer);
      moduleName = moduleComposer.name;

      if (localComposer.require[moduleName]) {
        grunt.log.error(
          "overwriting dependency "+moduleName+":"+
          localComposer.require[moduleName]+" to "+moduleRequire);
      }
      localComposer.require[moduleName] = moduleRequire;

      var found = false;
      localComposer.repositories.forEach(function (v) {
        if (v.url.indexOf(moduleRepo)!==-1) {
          found = true;
        }
      })
      if (!found) {
        localComposer.repositories.push({
          type: "git",
          url: 'git@github.com:'+moduleRepo+'.git'
        });
      }

      fs.writeFileSync ( "composer.json",
        JSON.stringify(localComposer, null, 2)
      );

      return done();
    };

    var url = 'https://raw.githubusercontent.com/'+moduleRepo+'/master/composer.json';
    require('got').stream(url)
      .on('data', function (d) {
        if (!moduleComposer){
          grunt.log.ok('Found '+url+'...')
        }
        moduleComposer += ''+d;
      })
      .on('end', gotIt)
      .on('close', gotIt);
  });

};
