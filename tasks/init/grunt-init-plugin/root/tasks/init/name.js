'use strict';

exports.description = "Grunt init template plugin";
exports.notes = "";

// Any existing file or directory matching this wildcard will cause a warning.
exports.warnOn = "*";

exports.template = function(grunt, init, done) {

  var _ = grunt.utils._;

  // Files to copy (and process).
  var files = init.filesToCopy({});

  // Remove any git files
  _.each(files, function(flag, file) {
    if (file.indexOf(".git") === 0) {
      delete files[file];
    }
  });

  // Actually copy (and process). files.
  init.copyAndProcess(files, {}, {});

  // All done!
  done();

};
