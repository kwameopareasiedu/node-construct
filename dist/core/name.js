"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateDatabaseTableNameFrom = exports.generateModelFolderNameFrom = exports.generateModelNameFrom = exports.toHyphenatedCamelCase = void 0;
var lodash_1 = require("lodash");
var pluralize = require("pluralize");
/** Returns a hyphenated camel-cased version of a string. E.g. "hello world" => "Hello-World" */
exports.toHyphenatedCamelCase = function (str) {
    return str.split("").reduce(function (word, char) {
        if (char.toLowerCase() == char)
            return word + char.trim();
        // If char is a capital letter and the preceding char is also a capital letter, just concatenate the word and this char
        if (word && word.slice(-1).toLowerCase() !== word.slice(-1))
            return word + char;
        return word + (word ? "-" : "") + char;
    }, "");
};
/** Generates a camel-cased model name from the given string */
exports.generateModelNameFrom = function (name) {
    var n = pluralize.singular(exports.toHyphenatedCamelCase(name)).toLowerCase();
    return n[0].toUpperCase() + lodash_1.camelCase(n).substring(1);
};
/** Generates a folder name for the model */
exports.generateModelFolderNameFrom = function (name) { return pluralize.singular(exports.toHyphenatedCamelCase(name)).toLowerCase(); };
/** Generates the database table name for this model */
exports.generateDatabaseTableNameFrom = function (name) {
    var n = pluralize.singular(exports.toHyphenatedCamelCase(name)).toLowerCase();
    return pluralize(n).replace(/-/g, "_");
};
