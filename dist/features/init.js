"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = void 0;
var path = require("path");
var log_1 = require("../core/log");
var file_1 = require("../core/file");
/** Creates the model-definitions.js file at the project root */
exports.init = function (root) {
    var targetPath = path.resolve(root, "model-definitions.js");
    file_1.writeFile(targetPath, file_1.readFile(path.resolve(__dirname, "../../templates/model-definitions.js.ejs")));
    log_1.logSuccess("Model definitions file created!");
};
