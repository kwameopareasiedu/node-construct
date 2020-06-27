"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate = void 0;
var path = require("path");
var log_1 = require("../core/log");
var path_1 = require("../core/path");
var folder_1 = require("../core/folder");
var misc_1 = require("../core/misc");
var file_1 = require("../core/file");
var name_1 = require("../core/name");
/** Creates a model file matching the given name with the appropriate code and database helper files */
exports.generate = function (name, root) { return __awaiter(void 0, void 0, void 0, function () {
    var dbRoot, modelName, fileName, tableName, folderPath, filePath;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, misc_1.readModelDefinitions(root)];
            case 1:
                dbRoot = (_a.sent()).dbRoot;
                createObjectionConfigFile(root, dbRoot);
                modelName = name_1.generateModelNameFrom(name);
                fileName = name_1.generateModelFileNameFrom(name);
                tableName = name_1.generateDatabaseTableNameFrom(name);
                folderPath = path.resolve(dbRoot, fileName);
                filePath = path.resolve(folderPath, "index.js");
                return [2 /*return*/];
        }
    });
}); };
var createObjectionConfigFile = function (root, dbRoot) {
    folder_1.createFolder(path.resolve(root, dbRoot));
    var knexfilePath = path.resolve(root, "knexfile.js");
    var objectionPath = path.resolve(root, dbRoot, "config.js");
    var relativePathToKnexfile = path.relative(path.resolve(root, dbRoot), knexfilePath);
    var templatePath = path.resolve(__dirname, "../../templates/objection-config.js.ejs");
    if (!path_1.pathExists(objectionPath)) {
        var templateContent = file_1.renderTemplate(templatePath, { knexfilePath: relativePathToKnexfile });
        file_1.writeFile(objectionPath, templateContent);
        log_1.logSuccess("Objection config file created!");
    }
};