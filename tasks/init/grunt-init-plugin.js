'use strict';

exports.description = "Grunt init template plugin";
exports.notes = "";

// Any existing file or directory matching this wildcard will cause a warning.
exports.warnOn = "*";

exports.template = function(grunt, init, done) {

  var _ = grunt.utils._,
      originalFiles,
      files = {},
      keys = [],
      key = ''
  ;

  grunt.helper('prompt', {type: 'grunt'}, [
    grunt.helper('prompt_for', 'description'),
    grunt.helper('prompt_for', 'name'),
    grunt.helper('prompt_for', 'version'),
    grunt.helper('prompt_for', 'repository'),
    grunt.helper('prompt_for', 'homepage'),
    grunt.helper('prompt_for', 'bugs'),
    grunt.helper('prompt_for', 'licenses'),
    grunt.helper('prompt_for', 'author_name'),
    grunt.helper('prompt_for', 'author_email'),
    grunt.helper('prompt_for', 'author_url'),
    grunt.helper('prompt_for', 'grunt_version'),
    grunt.helper('prompt_for', 'node_version', '*')
  ], function(err, props) {

    // Set a few grunt-plugin-specific properties.
    props.main = 'grunt.js';
    props.npm_test = 'grunt test';
    props.bin = 'bin/' + props.name;
    props.keywords = ['gruntplugin'];

    // Files to copy (and process).
    originalFiles = init.filesToCopy(props);

    /**
     * Simple hack to enable renaming of folders
     * Support for name property only!
     * TODO - enable the use for all other properties
     */
    keys = _.keys(originalFiles);

    for(var i=0;i<keys.length;i++){
      key = keys[i].indexOf('/name/')>=0 ? keys[i].replace(/\/name\//g, '/'+props.name+'/') : keys[i];
      files[key] = originalFiles[keys[i]];
    }

    // Add properly-named license files.
    init.addLicenseFiles(files, props.licenses);

    // Actually copy (and process) files.
    init.copyAndProcess(files, props);

    // Generate package.json file.
    init.writePackageJSON('package.json', props);

    // All done!
    done();
  });
};
