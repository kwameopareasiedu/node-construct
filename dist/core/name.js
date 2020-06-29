/* node-construct@v0.1.0 */
/* Last compiled on 29-06-2020 08:06:18 */
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.generateDatabaseTableNameFrom=exports.generateModelFolderNameFrom=exports.generateModelNameFrom=exports.toHyphenatedCamelCase=void 0;var lodash_1=require("lodash"),pluralize=require("pluralize");exports.toHyphenatedCamelCase=function(e){return e.split("").reduce(function(e,r){return r.toLowerCase()==r?e+r.trim():e&&e.slice(-1).toLowerCase()!==e.slice(-1)?e+r:e+(e?"-":"")+r},"")},exports.generateModelNameFrom=function(e){var r=pluralize.singular(exports.toHyphenatedCamelCase(e)).toLowerCase();return r[0].toUpperCase()+lodash_1.camelCase(r).substring(1)},exports.generateModelFolderNameFrom=function(e){return pluralize.singular(exports.toHyphenatedCamelCase(e)).toLowerCase()},exports.generateDatabaseTableNameFrom=function(e){var r=pluralize.singular(exports.toHyphenatedCamelCase(e)).toLowerCase();return pluralize(r).replace(/-/g,"_")};