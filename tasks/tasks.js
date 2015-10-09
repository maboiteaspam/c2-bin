var exec = require('child_process').exec;
var chokidar = require('chokidar');
var async = require('async');
var minimist = require('minimist');
var path = require('path');
var fs = require('fs');
var glob = require('glob');
var inquirer = require("inquirer");
var got = require("got");
var once = require("once");

module.exports = function (grunt) {

  var childs = [];
  process.on('SIGINT', function() {
    childs.forEach(function (destroyChild) {
      destroyChild(true);
    })
  });
  process.on('exit', function() {
    childs.forEach(function (destroyChild) {
      destroyChild();
    })
  });
  var spawnPhp = function(cmd, done, voidStdout){
    var killed = false;
    var stdout = '';
    var stderr = '';
    cmd = 'php '+cmd;
    grunt.log.subhead(cmd)
    var child = exec(cmd, { stdio: 'pipe' },
      function (error) {
        if (!killed && error !== null) {
          grunt.log.error('php server exec error: ' + error);
        }
        if(done) done(error, stdout, stderr);
      });
    child.stdout.on('data', function (d){
      if (!voidStdout) {
        grunt.log.success((''+d).replace(/\s+$/, ''))
      }
      stdout += d;
    });
    child.stderr.on('data', function (d){
      grunt.log.error((''+d).replace(/\s+$/, ''))
      stderr += d;
    });
    childs.push(function (wasKilled) {
      killed = wasKilled;
      child.kill();
    })
    return child;
  };
  var spawnC = function(cmd, done, voidStdout){
    cmd = ' cli.php '+ cmd ;
    if (process.platform.match(/win/)) {
      cmd = ' -d opcache.enable_cli=0 '+cmd; // see https://github.com/zendtech/ZendOptimizerPlus/issues/167
    }
    return spawnPhp( cmd, done, voidStdout);
  };
  var spawnComposer = function(cmd, done, voidStdout){
    cmd = ' composer.phar '+ cmd ;
    if (process.platform.match(/win/)) {
      cmd = ' -d opcache.enable_cli=0 '+cmd; // see https://github.com/zendtech/ZendOptimizerPlus/issues/167
    }
    return spawnPhp(cmd, done, voidStdout);
  };
  var spawnWatchr = function (watchPaths) {
    grunt.log.ok('Watching paths');
    grunt.log.writeflags(watchPaths)
    // Full list of options. See below for descriptions.
    chokidar.watch(watchPaths, {
      persistent: true,

      ignoreInitial: true,
      followSymlinks: true,
      cwd: '.',

      //usePolling: false,
      alwaysStat: false,
      depth: 3,
      interval: 250,

      ignorePermissionErrors: false,
      atomic: true
    }).on('all', function(event, filePath){
      spawnC('cache:update '+event+' '+filePath, function (error) {
        grunt.log.ok('cache is now up to date');
      });
    })
  };

  grunt.registerTask('db-init', 'Initialize the database and its schema according to your app.', function() {
    var done = this.async();
    spawnC('db:init', function (error) {
      done(error);
    });
  });
  grunt.registerTask('cache-init', 'Build assets and other pre compiled stuff.', function() {
    var done = this.async();
    spawnC('cache:init', function (error) {
      done(error);
    });
  });
  grunt.registerTask('http-init', 'Initialize a bridge file for your http server.', function() {
    var done = this.async();
    spawnC('http:bridge', function (error) {
      done(error);
    });
  });
  grunt.registerTask('check-schema', 'Refresh the DB schema according to your app', function() {
    var done = this.async();
    spawnC('db:refresh', function (error) {
      done(error);
    });
  });
  grunt.registerTask('fs-cache-dump', 'INTERNAL: Dumps all assets path from your app/', function() {
    var done = this.async();
    var path_to_watch = [];

    spawnC('fs-cache:dump', function (error, stdout, stderr) {
      var data = JSON.parse(stdout);
      data.forEach(function(cache){
        if (cache.config
          && cache.config.paths
          && cache.config.paths.length) {
          grunt.log.success('paths %j', cache.config.paths);
          path_to_watch = path_to_watch.concat(cache.config.paths)
        } else {
          grunt.log.success('items count %s', cache.items.length);
          Object.keys(cache.items).forEach(function(p){
            path_to_watch.push(p)
          })
        }
      });
      grunt.config.set('path_to_watch', path_to_watch);
      done();
    }, true);
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
        type: "vcs",
        url: p
      });
    }

    fs.writeFileSync ( "composer.json",
      JSON.stringify(localComposer, null, 2)
    );

    grunt.file.mkdir('vendor/'+packageName);
    grunt.file.delete('vendor/'+packageName);
    if (process.platform.match(/win/)) {
      exec('MKLINK /J vendor\\'+packageName.replace(/\//, '\\')+' '+p+'');
    } else {
      exec("ln -s "+p+" vendor/"+packageName);
    }

    grunt.log.subhead("All done!");
    grunt.log.ok("Don't forget to run composer update");
    grunt.log.writeln("");
    grunt.log.writeln("  php composer.phar update");
    grunt.log.writeln("");

  });

  grunt.registerTask('watch', 'Start watching your application assets for re-build.', function() {
    var watchPaths = grunt.config.get('path_to_watch');
    if (watchPaths) {
      spawnWatchr( watchPaths )
    }
  });

  grunt.registerTask('start', 'Starts web server for local development purpose', function() {
    var done = this.async();
    spawnPhp('-S localhost:8000 -t www app.php', function () {
      done();
    });
  });


  grunt.registerTask('get-composer', 'Generate autoloader for composer', function() {
    if (fs.existsSync("composer.phar")) {
      return grunt.log.ok("Composer is in your project, let s move on !");
    }
    var done = this.async();
    var installer = "";
    var gotIt = once(function () {
      var php = spawnPhp('', function () {
        done();
      });
      php.stdin.write(installer);
    });
    got.stream('https://getcomposer.org/installer')
      .on('data', function (d) {
        installer += ''+d;
      })
      .on('end', function () {
        gotIt();
      })
      .on('close', function () {
        gotIt();
      });
  });

  grunt.registerTask('classes-dump', 'Generate autoloader for composer', function() {
    var done = this.async();
    spawnComposer('dumpautoload', function () {
      done();
    });
  });

  grunt.registerTask('update', 'Run composer update command', function() {
    var done = this.async();
    spawnComposer('update', function () {
      done();
    });
  });

  grunt.registerTask('install', 'Run composer install command', function() {
    var done = this.async();
    spawnComposer('install', function () {
      done();
    });
  });


  var generateDir = function (targetPath, srcPath, data, onFile) {
    targetPath = path.normalize(targetPath);
    srcPath = path.normalize(srcPath);

    // Merge task-specific and/or target-specific options with these defaults:
    var files = glob.sync(path.join(srcPath, "**/**.*"), {dot:true});

    if (!files.length) {
      grunt.log.warn(
        'Destination `' + targetPath +
        '` not written because `'+srcPath+'` is empty.'
      );
      return;
    }

    // Iterate over all specified file groups.
    files.forEach(function(filePath) {

      filePath = path.normalize(filePath);
      var targetFilePath = filePath.replace(srcPath, targetPath);

      var template = grunt.file.read(filePath);

      if (onFile) {
        template = onFile (filePath, template);
      }

      // Print a success message
      grunt.log.writeln('File `' + targetFilePath + '` creating..');

      var result = grunt.template.process(template, {data: data});

      // Write the destination file
      grunt.file.write(targetFilePath, result);
    })
  };

  grunt.registerTask('generate-app', function() {
    var done = this.async();

    inquirer.prompt([{
      type:'list',
      message:"Which type of module would you like to create :",
      choices: ['design-component', 'component', 'app'],
      name:'modType'
    }], function( answers ) {
      var modType = answers.modType;

      inquirer.prompt([{
        type:'input',
        message:"Please tell me the namespace to use:",
        name:'ns'
      }], function( answers ) {
        var NS = answers.ns;

        grunt.log.success("Got it! Generating new "+modType+" under namespace "+NS);

        var adjustFileContent = function (filePath, fileContent) {
          if (filePath.match(/gitignore/)) {
            if (modType==='component') {
              if (!fileContent.match(/composer\.lock/)) {
                fileContent += "\ncomposer.lock\n";
              }
            } else if (modType==='app') {
              if (fileContent.match(/composer\.lock/)) {
                fileContent = fileContent.replace(/composer\.lock\s*/, "")
              }
            }
            fileContent += "\nvendor/";
          }
          return fileContent;
        };

        generateDir(process.cwd(), path.join(__dirname, "/../templates/module"), {
          NS: NS,
          modType: modType
        }, adjustFileContent);

        done();
      });
    });


  });

};
