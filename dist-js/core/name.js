"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateDatabaseTableNameFrom = exports.generateModelFolderNameFrom = exports.generateModelNameFrom = exports.toHyphenatedCamelCase = void 0;
var lodash_1 = require("lodash");
var pluralize = require("pluralize");
exports.toHyphenatedCamelCase = function (str) {
    return str.split("").reduce(function (word, char) {
        if (char.toLowerCase() == char)
            return word + char.trim();
        if (word && word.slice(-1).toLowerCase() !== word.slice(-1))
            return word + char;
        return word + (word ? "-" : "") + char;
    }, "");
};
exports.generateModelNameFrom = function (name) {
    var n = pluralize.singular(exports.toHyphenatedCamelCase(name)).toLowerCase();
    return n[0].toUpperCase() + lodash_1.camelCase(n).substring(1);
};
exports.generateModelFolderNameFrom = function (name) { return pluralize.singular(exports.toHyphenatedCamelCase(name)).toLowerCase(); };
exports.generateDatabaseTableNameFrom = function (name) {
    var n = pluralize.singular(exports.toHyphenatedCamelCase(name)).toLowerCase();
    return pluralize(n).replace(/-/g, "_");
};
//# sourceMappingURL=name.js.map