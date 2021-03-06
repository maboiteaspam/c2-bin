var fs = require('fs');
var path = require('path');
var phpunitHelper = require("../lib/phpunit-helper");
var phpHelper = require("../lib/php-helper");
var dlHelper = require("../lib/dl-helper");

module.exports = function (grunt) {

  phpHelper.verbose = !!grunt.option('verbose');
  phpunitHelper.verbose = !!grunt.option('verbose');

  if (!grunt.option('phpunit') && fs.existsSync("phpunit.phar")) {
    phpunitHelper.binPath = 'phpunit.phar '
  }
  phpHelper.phpPath = grunt.option('php') || 'php';
  phpHelper.init()

  grunt.registerTask('get-phpunit', 'Get phpunit.phar', function() {
    var done = this.async();

    phpunitHelper.spawn('--version', function (error) {
      if (error || grunt.option('force')) {
        grunt.log.warn("https://phpunit.de/manual/current/en/installation.html");
        grunt.log.warn("");
        grunt.log.warn("Downloading phpunit now");
        grunt.log.warn("");
        grunt.log.warn(phpunitHelper.pharUrl);
        grunt.file.delete('phpunit.phar')
        dlHelper.progress( dlHelper.download(
            phpunitHelper.pharUrl, {encoding:null}
        )).pipe(fs.createWriteStream('phpunit.phar'))
          .on('end', done);
      } else {
        grunt.log.ok("phpunit is available on your system, let s move on !");
        done()
      }
    });
  });

  grunt.registerTask('register-phpunit', 'Register phpunit requirement in the composer.json', function() {
    var done = this.async();

    phpunitHelper.spawn('--version', function (error, stdout, stderr) {
      if (error) done(error);

      var version = phpunitHelper.parseVersion(stdout).split('.')
      version.pop()
      version = version.join('.')+'.*'

      var localComposer = {}
      var cwd = process.cwd()
      var localComposerPath = path.join(cwd, 'composer.json')
      if (fs.existsSync(localComposerPath)) {
        localComposer = require(localComposerPath)
      }

      if (!localComposer["require-dev"]) {
        localComposer["require-dev"] = {}
      }

      if (!localComposer["require-dev"]["phpunit/phpunit"]) {
        localComposer["require-dev"]["phpunit/phpunit"] = version // should it not be ^5.0.x ?
        // https://phpunit.de/manual/current/en/installation.html
        // https://nodesource.com/blog/semver-tilde-and-caret
        // http://blog.madewithlove.be/post/tilde-and-caret-constraints/
        grunt.log.warn("added phpunit/phpunit '"+version+"' to require-dev");
      } else {
        grunt.log.warn("already registered as "+localComposer["require-dev"]["phpunit/phpunit"]);
      }

      grunt.file.write('composer.json', JSON.stringify(localComposer, null, 2))

      grunt.log.ok("all done");

    }, true);
  });
};
