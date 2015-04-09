'use strict'

var chalk = require('chalk');

exports.logSuccess = function (msg) {
  console.log(chalk.green(msg));
}

exports.logMessage = function (msg) {
  console.log(chalk.blue(msg));
}

exports.logWarning = function (msg) {
  console.log(chalk.yellow(msg));
}

exports.logError = function (msg) {
  console.log(chalk.red(msg));
}

exports.logJSON = function(json) {
  console.log(chalk.cyan("%j"), json);
}
