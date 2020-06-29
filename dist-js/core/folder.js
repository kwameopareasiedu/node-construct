"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readFolder = exports.createFolder = exports.FolderContent = void 0;
var fs = require("fs-extra");
var nodePath = require("path");
var path_1 = require("./path");
var log_1 = require("./log");
var FolderContent;
(function (FolderContent) {
    FolderContent[FolderContent["FOLDER"] = 0] = "FOLDER";
    FolderContent[FolderContent["FILE"] = 1] = "FILE";
    FolderContent[FolderContent["ALL"] = 2] = "ALL";
})(FolderContent = exports.FolderContent || (exports.FolderContent = {}));
exports.createFolder = function (path) {
    if (path_1.pathExists(path))
        return;
    fs.mkdirSync(path, { recursive: true });
    log_1.logInfo("Folder created - " + path);
};
exports.readFolder = function (path, mode) {
    if (mode === void 0) { mode = FolderContent.ALL; }
    if (!path_1.pathExists(path)) {
        log_1.logWarning("Path does not exist - " + path);
        return [];
    }
    if (!fs.lstatSync(path).isDirectory()) {
        log_1.logWarning("Search path is not a directory. Empty array returned");
        return [];
    }
    var folderContents = fs.readdirSync(path, { encoding: "utf-8" });
    return folderContents.filter(function (content) {
        var contentStats = fs.lstatSync(nodePath.join(path, content));
        if (mode === FolderContent.FOLDER)
            return contentStats.isDirectory();
        if (mode === FolderContent.FILE)
            return !contentStats.isDirectory();
        return true;
    });
};
//# sourceMappingURL=folder.js.map