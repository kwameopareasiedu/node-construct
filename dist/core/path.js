"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.destroy = exports.pathExists = void 0;
var fs = require("fs-extra");
var log_1 = require("./log");
exports.pathExists = function (path) { return fs.pathExistsSync(path); };
exports.destroy = function (path) {
    if (exports.pathExists(path)) {
        fs.removeSync(path);
        log_1.logInfo("Deleted - " + path);
    }
    else
        log_1.logWarning("Path does not exist - " + path);
};
