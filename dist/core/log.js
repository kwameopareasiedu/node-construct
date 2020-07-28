/* node-construct@v1.0.1 */
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.logError=exports.logWarning=exports.logSuccess=exports.logInfo=void 0;var chalk=require("chalk"),consoleLog=console.log;exports.logInfo=function(o){return consoleLog(chalk.cyan(o))},exports.logSuccess=function(o){return consoleLog(chalk.green(o))},exports.logWarning=function(o){return consoleLog(chalk.yellow.underline(o))},exports.logError=function(o){return consoleLog(chalk.red.bold(o))};