/* node-construct@v0.3.2 */
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.destroy=exports.pathExists=void 0;var fs=require("fs-extra"),log_1=require("./log");exports.pathExists=function(e){return fs.pathExistsSync(e)},exports.destroy=function(e){exports.pathExists(e)?(fs.removeSync(e),log_1.logInfo("Deleted - "+e)):log_1.logWarning("Path does not exist - "+e)};