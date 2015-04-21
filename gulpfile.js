'use strict';

var gulp = require('gulp');
var exec = require('child_process').exec;
var del = require('del');
var chalk = require('chalk');
var bowerFiles = require('main-bower-files');
var runSequence = require('run-sequence');
var sq = require('streamqueue');
var path = require('path');
var async = require('async');
var _ = require('lodash');
var fs = require('fs');
var $ = require('gulp-load-plugins')();

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var config = require('./server/config/environment');

var openOpts = {
  url: 'http://localhost:' + config.port,
  already: false
};

var toInject = [
  'client/app.js',
  'client/directives/**/*.js', '!client/directives/**/*.spec.js',
  'client/filters/**/*.js', '!client/filters/**/*.spec.js',
  'client/services/**/*.js', '!client/services/**/*.spec.js',
  'client/views/**/*.js', '!client/views/**/*.spec.js', '!client/views/**/*.e2e.js',
  'client/styles/css/app.css'
];

var toDelete = [];

/**
 * Log. With options.
 *
 * @param {String} msg
 * @param {Object} options
 */
function log (msg, options) {
  options = options || {};
  console.log(
    (options.padding ? '\n' : '')
    + chalk.yellow(' > ' + msg)
    + (options.padding ? '\n' : '')
  );
}

/**
 * Run a specific command
 * 
 * @param  {String} command 
 */
function runCommand (command) {
  return function(callback) {
    exec(command, function (err, stdout, stderr) {
      console.log(stdout);
      console.log(stderr);
      cb(err);
    });
  }
}

/**
 * Compile SASS
 */
gulp.task('sass', function () {
  return gulp.src('client/styles/app.scss')
    .pipe($.plumber())
    .pipe($.sass())
    .pipe(gulp.dest('client/styles/css'));
});

/**
 * Inject css/js files in index.html
 */
gulp.task('inject', ['sass'], function () {
  var sources = gulp.src(toInject, { read: false });

  return gulp.src('client/index.html')
    .pipe($.inject(gulp.src(bowerFiles(), { read: false }), {
      name: 'bower',
      relative: 'true'
    }))
    .pipe($.inject(sources, { relative: true }))
    .pipe(gulp.dest('client'));
});

/**
 * Watch files and reload page.
 * Recompile scss if needed.
 * Reinject files
 */
gulp.task('watch', ['inject'], function () {

  $.livereload.listen();

  gulp.watch('bower.json', function () {
    gulp.src('client/index.html')
      .pipe($.inject(gulp.src(bowerFiles(), { read: false }), {
        name: 'bower',
        relative: 'true'
      }))
      .pipe(gulp.dest('client'));
  });

  gulp.watch(['client/index.html', 'client/app.js'])
    .on('change', $.livereload.changed);

  $.watch(['client/styles/**/*.scss', 'client/views/**/*.scss'], function () {
    gulp.src('client/styles/app.scss')
      .pipe($.plumber())
      .pipe($.sass())
      .pipe(gulp.dest('client/styles/css'))
      .pipe($.livereload());
  });

  $.watch([
    'client/views',
    'client/views/**/*.html',
    'client/views/**/*.js',
    '!client/views/**/*.scss',
    '!client/views/**/*.spec.js',
    '!client/views/**/*.e2e.js',
    'client/directives',
    'client/directives/**/*.html',
    'client/directives/**/*.js',
    '!client/directives/**/*.spec.js',
    'client/services',
    'client/services/**/*.js',
    '!client/services/**/*.spec.js',
    'client/filters',
    'client/filters/**/*.js',
    '!client/filters/**/*.spec.js'
  ], function () {
    gulp.src('client/index.html')
      .pipe($.wait(100))
      .pipe($.inject(gulp.src(toInject), { relative: true }))
      .pipe(gulp.dest('client'));
  });

});

/**
 * Control things
 */
gulp.task('control', function (done) {

  function getConfig (file) {
    return _.merge(
      JSON.parse(fs.readFileSync('./.jshintrc', 'utf-8')),
      JSON.parse(fs.readFileSync(file, 'utf-8'))
    );
  }

  function control (paths, conf) {
    return function (done) {
      gulp.src(paths)
        .pipe($.jshint(conf))
        .pipe($.jshint.reporter('jshint-stylish'))
        .on('finish', function () {
          gulp.src(paths)
            .pipe($.jscs())
            .on('error', function () {})
            .pipe($.jscsStylish())
            .on('end', done);
        });
    };
  }

  async.series([
    control(['client/**/*.js', '!client/bower_components/**'], getConfig('./client/.jshintrc')),
    control(['server/**/*.js'], getConfig('./server/.jshintrc')),
    control(['gulpfile.js'], getConfig('./server/.jshintrc'))
  ], done);

});

/**
 * Protractor
 */
gulp.task('e2e:update', $.protractor.webdriver_update);

gulp.task('e2e', ['serve'], function () {
  gulp.src('client/views/**/*.e2e.js')
    .pipe($.protractor.protractor({
      configFile: 'protractor.conf.js'
    }))
    .on('error', function (e) {
      $.util.log(e.message);
      process.exit(-1);
    })
    .on('end', function () {
      process.exit(0);
    });
});

/**
 * Launch server
 */
gulp.task('serve', function () {
  return $.nodemon({
      script: 'server/server.js',
      ext: 'js',
      ignore: ['client', 'dist', 'node_modules', 'gulpfile.js']
    });
});

gulp.task('preview', ['build'], function () {
  process.env.NODE_ENV = 'production';
  require('./dist/server/server');
  return gulp.src('client/index.html')
    .pipe($.open('', openOpts));
});

/**
 * Build
 */
gulp.task('clean:dist', function (cb) {
  del(['dist/**', '!dist', '!dist/.git{,/**}'], cb);
});

gulp.task('clean:finish', function (cb) {
  del([
    '.tmp/**',
    'dist/client/app.{css,js}'
  ].concat(toDelete), cb);
});

gulp.task('copy:dist', function () {
  var main = gulp.src(['server/**/*', 'package.json'], { base: './' });
  var assets = gulp.src('client/assets/**/*', { base: './' });

  return sq({ objectMode: true }, main, assets)
    .pipe(gulp.dest('dist/'));
});

gulp.task('usemin', ['inject'], function () {
  return gulp.src('client/index.html')
    .pipe($.plumber())
    .pipe($.usemin({ css: [$.cssRebaseUrls({ root: 'client' }), 'concat'] }))
    .pipe(gulp.dest('dist/client/'));
});

gulp.task('cssmin', function () {
  return gulp.src('dist/client/app.css')
    .pipe($.minifyCss({processImport: false}))
    .pipe(gulp.dest('dist/client/'));
});

gulp.task('scripts', function () {
  var views = gulp.src('client/views/**/*.html')
    .pipe($.angularTemplatecache({
      root: 'views',
      module: 'Midify'
    }));

  var tpls = gulp.src('client/directives/**/*.html')
    .pipe($.angularTemplatecache({
      root: 'directives',
      module: 'Midify'
    }));

  var app = gulp.src('dist/client/app.js');

  return sq({ objectMode: true }, app, views, tpls)
    .pipe($.concat('app.js'))
    .pipe($.ngAnnotate())
    .pipe($.uglify())
    .pipe(gulp.dest('dist/client/'));
});

gulp.task('replace', function () {
  return gulp.src('dist/client/index.html')
    .pipe($.replace(/\s*<script.*livereload.*><\/script>\n/, ''))
    .pipe(gulp.dest('dist/client'));
});

gulp.task('rev', function () {
  return gulp.src('dist/client/**')
    .pipe($.revAll({
      ignore: ['favicon.ico', '.html'],
      quiet: true,
      transformFilename: function (file, hash) {
        toDelete.push(path.resolve(file.path));
        var ext = path.extname(file.path);
        return path.basename(file.path, ext) + '.' + hash.substr(0, 8) + ext;
      }
    }))
    .pipe(gulp.dest('dist/client/'));
});

/**
 *  Build task
 */
gulp.task('build', function (cb) {
  runSequence(
    ['clean:dist', 'sass'],
    ['usemin', 'copy:dist'],
    ['replace', 'scripts', 'cssmin'],
    'clean:finish',
    cb);
});

/**
 * Git Versioning and Git Bump New Updates to Repo
 */

gulp.task('version', function () {
  return gulp.src(['./package.json', './bower.json'])
    .pipe($.bump({
      type: process.argv[3] ? process.argv[3].substr(2) : 'patch'
    }))
    .pipe(gulp.dest('./'));
});

gulp.task('bump', ['version'], function () {
  fs.readFile('./package.json', function (err, data) {
    if (err) { return ; }
    return gulp.src(['./package.json', './bower.json'])
      .pipe($.git.add())
      .pipe($.git.commit('chore(core): bump to ' + JSON.parse(data).version));
  });
});

gulp.task('default', ['serve']);
