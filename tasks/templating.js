var path = require('path');
var glob = require('glob');
var inquirer = require("inquirer");

module.exports = function (grunt) {

  var generateFile = function (targetFilePath, filePath, data) {

    var template = grunt.file.read(filePath);

    // Print a success message
    grunt.log.writeln('File `' + targetFilePath + '` creating..');

    var result = grunt.template.process(template, {data: data});

    // Write the destination file
    grunt.file.write(targetFilePath, result);
  };
  var generateDir = function (targetPath, srcPath, data) {
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

      generateFile(targetFilePath, filePath, data);
    })
  };

  grunt.registerTask('generate-app', 'Generate a C module', function() {
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


        // -
        var urlToFoundation = 'git@github.com:maboiteaspam/Foundation.git';

        // @todo check composer internal to get those link functions working properly,
        // meanwhile, refere to the documentation to get to know the DEV setup.
        //if (fs.existsSync(path.join(process.cwd(), '..', 'C', 'Foundation'))) {
        //  urlToFoundation = path.join( '..', 'C', 'Foundation')
        //}
        //if (fs.existsSync(path.join(process.cwd(), '..','Foundation'))) {
        //  urlToFoundation = path.join( '..', 'Foundation')
        //}
        // -
        var urlToBootstrap = 'git@github.com:maboiteaspam/Bootstrap.git';
        //if (fs.existsSync(path.join(process.cwd(), '..', 'C', 'Bootstrap'))) {
        //  urlToBootstrap = path.join( '..', 'C', 'Bootstrap')
        //}
        //if (fs.existsSync(path.join(process.cwd(), '..','Bootstrap'))) {
        //  urlToBootstrap = path.join( '..', 'Bootstrap')
        //}
        //-
        var urlToWelcome = 'git@github.com:maboiteaspam/Welcome.git';
        //if (fs.existsSync(path.join(process.cwd(), '..', 'C', 'Welcome'))) {
        //  urlToWelcome = path.join( '..', 'C', 'Welcome')
        //}
        //if (fs.existsSync(path.join(process.cwd(), '..', 'Welcome'))) {
        //  urlToWelcome = path.join( '..', 'Welcome')
        //}

        var ignores = [
          "phpunit.phar",
          "composer.phar",
          "run/",
          "vendor/"
        ];
        if (modType!=='app') {
          ignores.push("composer.lock")
        }

        generateDir(process.cwd(), path.join(__dirname, "/../templates/module"), {
          NS: NS,
          ignores: ignores,
          urlToBootstrap: urlToBootstrap,
          urlToFoundation: urlToFoundation,
          urlToWelcome: urlToWelcome,
          modType: modType,
          properFilePath: function (p) {
            if (process.platform.match(/win/))
              return p.replace(/\//g, "\\").replace(/\\/g, "\\\\");
            else
              return p.replace(/\\/g, "/");
          }
        });

        done();
      });
    });


  });

  grunt.registerTask('generate-vcl', 'Generate a Varnish VCL file', function() {
    var done = this.async();

    var vclExists = grunt.file.exists('default.vcl')

    var askIfExists = function (then) {
      if (vclExists) {
        inquirer.prompt([{
          type:'confirm',
          message:"File exists, would like to overwrite ?",
          name:'overwrite'
        }], function( answers ) {
          then (!!answers.overwrite)
        })
      } else {
        then(true)
      }
    };

    askIfExists(function (doGenerate) {
      var data = {};
      var tplFile = path.join(__dirname, '..', 'templates', 'default-4.0.vcl');
      if (doGenerate) generateFile('default.vcl', tplFile, data);
      else done();
    })

  });

};
