'use strict'

var chalk = require('chalk');

exports.logSuccess = function (msg) {
  console.log(chalk.green(msg));
}

exports.logJSONSuccess = function(json) {
  console.log(chalk.green("%j"), json);
}

exports.logInfo = function (msg) {
  console.log(chalk.blue(msg));
}

exports.logJSONInfo = function(json) {
  console.log(chalk.blue("%j"), json);
}

exports.logWarning = function (msg) {
  console.log(chalk.yellow(msg));
}

exports.logJSONWarning = function(json) {
  console.log(chalk.yellow("%j"), json);
}

exports.logError = function (msg) {
  console.log(chalk.red(msg));
}

exports.logJSONError = function(json) {
  console.log(chalk.red("%j"), json);
}
