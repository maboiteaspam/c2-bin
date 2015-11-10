
var fs = require('fs');
var got = require("got");
var grunt = require('grunt');
var ProgressBar = require('progress');
var Spinner = require('cli-spinner').Spinner;


module.exports = (function () {

  var dlHelper = {};

  dlHelper.download = function (url, opt, then) {
    return got.stream(url, opt)
      .on('end', function (err) {
        if (err) grunt.log.error(err)
        if (then) then(err)
      });
  };

  dlHelper.progress = function (stream) {
    var bar;
    var length;
    var spinner = new Spinner('waiting for a response.. %s');
    spinner.setSpinnerString('|/-\\');
    spinner.start();
    return stream
      .on('response', function (response){
        spinner.stop(true);
        length = parseInt(response.headers['content-length']);
        var hl = filesizeformat(length)
        bar = new ProgressBar('Downloading '+hl+' :bar', { total: length, width: 40 });
      })
      .on('data', function (d){
        if(bar) bar.tick(d.length);
      });
  };



//grunt.registerTask('phpunit', 'Run phpunit.phar', function() {
//  phpunitHelper.spawn('', function (error, stdout, stderr) {
//  }, true);
//});
  function number_format( number, decimals, dec_point, thousands_sep ) {
    // http://kevin.vanzonneveld.net
    // +   original by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +	 bugfix by: Michael White (http://crestidg.com)
    // +	 bugfix by: Benjamin Lupton
    // +	 bugfix by: Allan Jensen (http://www.winternet.no)
    // +	revised by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
    // *	 example 1: number_format(1234.5678, 2, '.', '');
    // *	 returns 1: 1234.57

    var n = number, c = isNaN(decimals = Math.abs(decimals)) ? 2 : decimals;
    var d = dec_point == undefined ? "," : dec_point;
    var t = thousands_sep == undefined ? "." : thousands_sep, s = n < 0 ? "-" : "";
    var i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", j = (j = i.length) > 3 ? j % 3 : 0;

    return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
  }

  /*!
   filesizeformat
   Formats the value like a 'human-readable' file size (i.e. '13 KB', '4.1 MB', '102 bytes', etc).
   For example:
   {{ value|filesizeformat }}
   If value is 123456789, the output would be 117.7 MB.
   /**/
  function filesizeformat (filesize) {
    if (filesize >= 1073741824) {
      filesize = number_format(filesize / 1073741824, 2, '.', '') + ' GB';
    } else {
      if (filesize >= 1048576) {
        filesize = number_format(filesize / 1048576, 2, '.', '') + ' MB';
      } else {
        if (filesize >= 1024) {
          filesize = number_format(filesize / 1024, 0) + ' KB';
        } else {
          filesize = number_format(filesize, 0) + ' bytes';
        };
      };
    };
    return filesize;
  };

  return dlHelper;
})();
