"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logError = exports.logWarning = exports.logSuccess = exports.logInfo = void 0;
var chalk = require("chalk");
var consoleLog = console.log;
exports.logInfo = function (message) { return consoleLog(chalk.cyan(message)); };
exports.logSuccess = function (message) { return consoleLog(chalk.green(message)); };
exports.logWarning = function (message) { return consoleLog(chalk.yellow.underline(message)); };
exports.logError = function (message) { return consoleLog(chalk.red.bold(message)); };
