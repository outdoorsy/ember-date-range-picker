/* jshint node: true */
'use strict';
var Funnel = require('broccoli-funnel');
var mergeTrees = require('broccoli-merge-trees');
var path = require('path');
var map = require('broccoli-stew').map;

module.exports = {
  name: 'ember-cli-daterangepicker',

  included: function(app) {
    this._super.included.apply(this, arguments);

    this.app.import('vendor/bootstrap-daterangepicker/daterangepicker.js');
    this.app.import('vendor/bootstrap-daterangepicker/daterangepicker.css');
  },

  treeForVendor: function(defaultTree) {
    var daterangepickerPath = path.dirname(require.resolve('bootstrap-daterangepicker'));

    var browserVendorLib = new Funnel(daterangepickerPath, {
      destDir: 'bootstrap-daterangepicker',
      include: [new RegExp(/\.js$|\.css/)],
      exclude: [
        'moment',
        'moment.min',
        'package',
        'website'
      ].map(function(key) {
        return new RegExp(key + '\.js$');
      })
    });

    browserVendorLib = map(browserVendorLib, (content, relativePath) => {
      if (relativePath.indexOf('css') !== -1) {
        return content;
      }
      return `if (typeof FastBoot === 'undefined') { ${content} }`
    });
  
    return new mergeTrees([defaultTree, browserVendorLib]);
  }
};
