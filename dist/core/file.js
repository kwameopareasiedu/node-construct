/* node-construct@v0.1.0 */
/* Last compiled on 29-06-2020 08:06:18 */
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.renderTemplate=exports.writeFile=exports.readFile=exports.createFile=void 0;var ejs=require("ejs"),fs=require("fs-extra"),log_1=require("./log");exports.createFile=function(e){fs.ensureFileSync(e),log_1.logInfo("File created - "+e)},exports.readFile=function(e){return fs.readFileSync(e,{encoding:"utf-8"})},exports.writeFile=function(e,r){fs.writeFileSync(e,r||""),log_1.logInfo("File written - "+e)},exports.renderTemplate=function(e,r){return void 0===r&&(r={}),ejs.render(exports.readFile(e),r)};