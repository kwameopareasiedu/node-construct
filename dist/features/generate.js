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
var moment = require("moment");
var prettier_1 = require("prettier");
var log_1 = require("../core/log");
var path_1 = require("../core/path");
var folder_1 = require("../core/folder");
var misc_1 = require("../core/misc");
var file_1 = require("../core/file");
var name_1 = require("../core/name");
/** Creates a model file matching the given name with the appropriate code and database helper files */
exports.generate = function (name, root) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, dbRoot, migrations, modelName, modelFileName, databaseTableName, modelFolderPath, modelFilePath, modelTemplatePath, modelTemplateContent, migrationTemplatePath, migrationTemplateContent, migrationFilePath;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, misc_1.readModelDefinitions(root)];
            case 1:
                _a = _b.sent(), dbRoot = _a.dbRoot, migrations = _a.migrations;
                folder_1.createFolder(path.resolve(root, migrations));
                folder_1.createFolder(path.resolve(root, dbRoot));
                ensureObjectionConfig(root, dbRoot);
                ensureRootModel(root, dbRoot);
                modelName = name_1.generateModelNameFrom(name);
                modelFileName = name_1.generateModelFileNameFrom(name);
                databaseTableName = name_1.generateDatabaseTableNameFrom(name);
                modelFolderPath = path.resolve(root, dbRoot, modelFileName.replace(".js", ""));
                modelFilePath = path.resolve(root, modelFolderPath, "index.js");
                modelTemplatePath = path.resolve(__dirname, "../../templates/model.js.ejs");
                modelTemplateContent = file_1.renderTemplate(modelTemplatePath, { modelName: modelName, databaseTableName: databaseTableName });
                folder_1.createFolder(modelFolderPath);
                file_1.writeFile(modelFilePath, prettier_1.format(modelTemplateContent, misc_1.prettierConfig));
                migrationTemplatePath = path.resolve(__dirname, "../../templates/migration.js.ejs");
                migrationTemplateContent = file_1.renderTemplate(migrationTemplatePath, { databaseTableName: databaseTableName });
                migrationFilePath = path.resolve(root, migrations, moment().format("YYYYMMDDHHmmssSSS") + "_create_" + databaseTableName + "_table.js");
                file_1.writeFile(migrationFilePath, prettier_1.format(migrationTemplateContent, misc_1.prettierConfig));
                return [2 /*return*/];
        }
    });
}); };
var ensureObjectionConfig = function (root, dbRoot) {
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
var ensureRootModel = function (root, dbRoot) {
    var rootModelPath = path.resolve(root, dbRoot, "root.js");
    var templatePath = path.resolve(__dirname, "../../templates/root-model.js.ejs");
    if (!path_1.pathExists(rootModelPath)) {
        file_1.writeFile(rootModelPath, file_1.readFile(templatePath));
        log_1.logSuccess("Root model created!");
    }
};
