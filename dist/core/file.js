"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderTemplate = exports.writeFile = exports.readFile = exports.createFile = void 0;
var ejs = require("ejs");
var fs = require("fs-extra");
var log_1 = require("./log");
exports.createFile = function (path) {
    fs.ensureFileSync(path);
    log_1.logInfo("File created - " + path);
};
exports.readFile = function (path) { return fs.readFileSync(path, { encoding: "utf-8" }); };
exports.writeFile = function (path, data) {
    fs.writeFileSync(path, data || "");
    log_1.logInfo("File written - " + path);
};
exports.renderTemplate = function (path, params) {
    if (params === void 0) { params = {}; }
    return ejs.render(exports.readFile(path), params);
};
