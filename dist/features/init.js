/* node-construct@v1.0.1 */
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.init=void 0;var path=require("path"),log_1=require("../core/log"),file_1=require("../core/file");exports.init=function(e){var i=path.resolve(e,"model-definitions.js");file_1.writeFile(i,file_1.readFile(path.resolve(__dirname,"../../templates/model-definitions.js.ejs"))),log_1.logSuccess("Model definitions file created!\n")};