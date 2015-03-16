'use strict';

var path = require('path');
var _ = require('lodash');

var all = {

  env: process.env.NODE_ENV || 'development',
  root: path.normalize(__dirname + '/../../..'),
  port: process.env.PORT || 9000,

  mongo: {
    options: {
      db: {
        safe: true
      }
    }
  },

  secrets: {
    session: 'zavatta' || process.env.SESSION_SECRET
  }
};

module.exports = _.merge(all, require('./' + all.env + '.js'));
