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
exports.prettierConfig = exports.readModelDefinitions = void 0;
var path = require("path");
var path_1 = require("./path");
exports.readModelDefinitions = function (root) { return __awaiter(void 0, void 0, void 0, function () {
    var modelDefinitionsPath;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                modelDefinitionsPath = path.resolve(root, "model-definitions.js");
                if (!path_1.pathExists(modelDefinitionsPath))
                    throw new Error("Cannot find 'model-definitions.js' config file. Run 'agile-model init' first");
                return [4 /*yield*/, Promise.resolve().then(function () { return require(modelDefinitionsPath); })];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.prettierConfig = {
    parser: "babel",
    printWidth: 150,
    trailingComma: "none",
    useTabs: false,
    tabWidth: 4,
    semi: true,
    singleQuote: false,
    jsxBracketSameLine: true,
    jsxSingleQuote: false,
    arrowParens: "avoid"
};
// export const updateDBServiceIndex = (dbServicePath: string): void => {
//     dbServicePath = resolvePath(dbServicePath);
//     const modelFolders = readFolder(dbServicePath, FolderContent.FOLDER);
//     const modelNames = modelFolders.map(folder => `${camelCase(folder)},`);
//     const modelFolderImportStrings = modelFolders.map(folder => `const ${camelCase(folder)} = require("./${folder}");`);
//     const content = prettier.format(`${modelFolderImportStrings.join("\n")}\\n module.exports = {\\n ${modelNames.join("\n")} };`, {
//         parser: "babel",
//         printWidth: 150,
//         useTabs: true,
//         tabWidth: 4,
//         semi: true,
//         singleQuote: false,
//         bracketSpacing: true,
//         trailingComma: "none"
//     });
//     createFile(dbServicePath + "/index.js");
//     writeFile(dbServicePath + "/index.js", content);
// };
// function searchCodeTree(rootNode, type, evalFn, depth = 0) {
//     if (!rootNode) return [];
//
//     const foundNodes = [];
//
//     if (Array.isArray(rootNode)) {
//         for (const node of rootNode) {
//             foundNodes.push(...searchCodeTree(node, type, evalFn, depth + 1));
//         }
//     } else if (typeof rootNode == "object") {
//         if (rootNode.type != type || !evalFn(rootNode)) {
//             for (const key in rootNode) {
//                 if (typeof rootNode[key] == "object") {
//                     foundNodes.push(...searchCodeTree(rootNode[key], type, evalFn, depth + 1));
//                 }
//             }
//         } else foundNodes.push(rootNode);
//     }
//
//     return foundNodes;
// }
//
// function formattedTime() {
//     const d = new Date();
//     const dateComponent = `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
//     const timeComponent = `${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}_${pad(d.getMilliseconds())}`;
//     return dateComponent + timeComponent;
// }
