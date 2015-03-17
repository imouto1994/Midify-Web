'use strict';

var express = require('express');

// Middlewares
var compression = require('compression');
var morgan = require('morgan');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var favicon = require('serve-favicon');
var methodOverride = require('method-override');

// Authentication
var session = require('express-session');
var passport = require('passport');

// Database
var mongoStore = require('connect-mongo')(session);
var mongoose = require('mongoose');

// Configuration
var config = require('./environment');

module.exports = function (app) {

  var env = config.env;

  app.set('view engine', 'html');
  app.use(favicon(path.join(config.root, 'client', 'assets', 'favicon.ico')));
  app.use(morgan('dev'));
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(cookieParser());
  app.use(compression());
  app.use(passport.initialize());
  app.use(express.static(path.join(config.root, 'client')));
  app.set('appPath', 'client');

  app.use(session({
    secret: config.secrets.session,
    resave: true,
    saveUninitialized: true,
    store: new mongoStore({ mongooseConnection: mongoose.connection })
  }));

  if (env === 'development' || env === 'test') {
    app.use(require('errorhandler')());
  }
};
