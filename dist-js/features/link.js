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
exports.link = exports.RelationType = void 0;
var path = require("path");
var moment = require("moment");
var prettier_1 = require("prettier");
var pluralize_1 = require("pluralize");
var recast_1 = require("recast");
var log_1 = require("../core/log");
var path_1 = require("../core/path");
var misc_1 = require("../core/misc");
var file_1 = require("../core/file");
var name_1 = require("../core/name");
var RelationType;
(function (RelationType) {
    RelationType[RelationType["HAS_ONE"] = 0] = "HAS_ONE";
    RelationType[RelationType["HAS_MANY"] = 1] = "HAS_MANY";
    RelationType[RelationType["BELONGS_TO_ONE"] = 2] = "BELONGS_TO_ONE";
})(RelationType = exports.RelationType || (exports.RelationType = {}));
exports.link = function (root, dbRoot, migrationsRoot, source, target, relation) { return __awaiter(void 0, void 0, void 0, function () {
    var sourceModelFolderName, targetModelFolderName, relationAST, sourceModelName, sourceModelPath, sourceModelAST, sourceModelClassDeclarationSubTree, sourceModelRelationMappingsMethodDeclarationSubTree, sourceModelRelationMappingsReturnStatementSubTree, reverseRelationAST, targetModelName, targetModelPath, targetModelAST, targetModelClassDeclarationSubTree, targetModelRelationMappingsMethodDeclarationSubTree, targetModelRelationMappingsReturnStatementSubTree, sourceDatabaseTableName, targetDatabaseTableName, sourceLinksToTarget, migrationTemplatePath, migrationTemplateContent, migrationFilePath;
    return __generator(this, function (_a) {
        sourceModelFolderName = name_1.generateModelFolderNameFrom(source);
        targetModelFolderName = name_1.generateModelFolderNameFrom(target);
        if (!path_1.pathExists(path.resolve(root, dbRoot, sourceModelFolderName)))
            throw new Error(source + " is not a valid model in the project");
        if (!path_1.pathExists(path.resolve(root, dbRoot, targetModelFolderName)))
            throw new Error(target + " is not a valid model in the project");
        relationAST = (function () {
            if (relation === RelationType.HAS_ONE)
                return generateASTForHasOneRelation(source, target);
            else if (relation === RelationType.HAS_MANY)
                return generateASTForHasManyRelation(source, target);
            else if (relation === RelationType.BELONGS_TO_ONE)
                return generateASTForBelongsToOneRelation(source, target);
            else
                throw new Error("Invalid relation type");
        })();
        sourceModelName = name_1.generateModelNameFrom(source);
        sourceModelPath = path.resolve(root, dbRoot, sourceModelFolderName, "index.js");
        sourceModelAST = recast_1.parse(file_1.readFile(sourceModelPath));
        sourceModelClassDeclarationSubTree = sourceModelAST.program.body.filter(function (subTree) { return subTree.type === "ClassDeclaration" && subTree.id.name === sourceModelName; })[0];
        sourceModelRelationMappingsMethodDeclarationSubTree = sourceModelClassDeclarationSubTree.body.body.filter(function (subTree) { return subTree.type === "MethodDefinition" && subTree.key.name === "relationMappings"; })[0];
        sourceModelRelationMappingsReturnStatementSubTree = sourceModelRelationMappingsMethodDeclarationSubTree.value.body.body.filter(function (subTree) { return subTree.type === "ReturnStatement"; })[0];
        sourceModelRelationMappingsReturnStatementSubTree.argument.properties.push(relationAST);
        file_1.writeFile(sourceModelPath, prettier_1.format(recast_1.print(sourceModelAST).code, misc_1.prettierConfig));
        reverseRelationAST = (function () {
            if (relation === RelationType.HAS_ONE)
                return generateASTForBelongsToOneRelation(target, source);
            else if (relation === RelationType.HAS_MANY)
                return generateASTForBelongsToOneRelation(target, source);
            else if (relation === RelationType.BELONGS_TO_ONE)
                return generateASTForHasManyRelation(target, source);
            else
                throw new Error("Invalid relation type");
        })();
        targetModelName = name_1.generateModelNameFrom(target);
        targetModelPath = path.resolve(root, dbRoot, targetModelFolderName, "index.js");
        targetModelAST = recast_1.parse(file_1.readFile(targetModelPath));
        targetModelClassDeclarationSubTree = targetModelAST.program.body.filter(function (subTree) { return subTree.type === "ClassDeclaration" && subTree.id.name === targetModelName; })[0];
        targetModelRelationMappingsMethodDeclarationSubTree = targetModelClassDeclarationSubTree.body.body.filter(function (subTree) { return subTree.type === "MethodDefinition" && subTree.key.name === "relationMappings"; })[0];
        targetModelRelationMappingsReturnStatementSubTree = targetModelRelationMappingsMethodDeclarationSubTree.value.body.body.filter(function (subTree) { return subTree.type === "ReturnStatement"; })[0];
        targetModelRelationMappingsReturnStatementSubTree.argument.properties.push(reverseRelationAST);
        file_1.writeFile(targetModelPath, prettier_1.format(recast_1.print(targetModelAST).code, misc_1.prettierConfig));
        sourceDatabaseTableName = name_1.generateDatabaseTableNameFrom(source);
        targetDatabaseTableName = name_1.generateDatabaseTableNameFrom(target);
        sourceLinksToTarget = [RelationType.HAS_ONE, RelationType.HAS_MANY].includes(relation);
        migrationTemplatePath = path.resolve(__dirname, "../../templates/relation-migration.js.ejs");
        migrationTemplateContent = file_1.renderTemplate(migrationTemplatePath, {
            sourceModelName: sourceLinksToTarget ? sourceModelName : targetModelName,
            targetModelName: sourceLinksToTarget ? targetModelName : sourceModelName,
            sourceDatabaseTableName: sourceLinksToTarget ? sourceDatabaseTableName : targetDatabaseTableName,
            targetDatabaseTableName: sourceLinksToTarget ? targetDatabaseTableName : sourceDatabaseTableName,
            targetDatabaseTableColumn: pluralize_1.singular(name_1.generateDatabaseTableNameFrom(sourceLinksToTarget ? source : target)) + "_id"
        });
        migrationFilePath = (function () {
            var timestamp = moment().format("YYYYMMDDHHmmssSSS");
            var table = sourceLinksToTarget ? targetDatabaseTableName : sourceDatabaseTableName;
            var column = pluralize_1.singular(name_1.generateDatabaseTableNameFrom(sourceLinksToTarget ? source : target)) + "_id";
            return path.resolve(root, migrationsRoot, timestamp + "_add_" + column + "_to_" + table + "_table.js");
        })();
        file_1.writeFile(migrationFilePath, prettier_1.format(migrationTemplateContent, misc_1.prettierConfig));
        log_1.logSuccess("Successfully linked " + sourceModelName + " model to " + targetModelName + " model!\n");
        return [2];
    });
}); };
var generateASTForHasOneRelation = function (source, target) {
    var relationSourceColumn = name_1.generateDatabaseTableNameFrom(source) + ".id";
    var relationTargetColumn = name_1.generateDatabaseTableNameFrom(target) + "." + pluralize_1.singular(name_1.generateDatabaseTableNameFrom(source)) + "_id";
    return {
        type: "Property",
        method: false,
        shorthand: false,
        computed: false,
        key: { type: "Identifier", name: pluralize_1.singular(name_1.generateDatabaseTableNameFrom(target)) },
        value: {
            type: "ObjectExpression",
            properties: [
                {
                    type: "Property",
                    method: false,
                    shorthand: false,
                    computed: false,
                    key: { type: "Identifier", name: "relation" },
                    value: {
                        type: "MemberExpression",
                        object: { type: "Identifier", name: "RootModel" },
                        property: { type: "Identifier", name: "HasOneRelation" },
                        computed: false
                    },
                    kind: "init"
                },
                {
                    type: "Property",
                    method: false,
                    shorthand: false,
                    computed: false,
                    key: { type: "Identifier", name: "from" },
                    value: { type: "Literal", value: relationSourceColumn, raw: "\"" + relationSourceColumn + "\"" },
                    kind: "init"
                },
                {
                    type: "Property",
                    method: false,
                    shorthand: false,
                    computed: false,
                    key: { type: "Identifier", name: "to" },
                    value: { type: "Literal", value: relationTargetColumn, raw: "\"" + relationTargetColumn + "\"" },
                    kind: "init"
                }
            ]
        },
        kind: "init"
    };
};
var generateASTForHasManyRelation = function (source, target) {
    var relationSourceColumn = name_1.generateDatabaseTableNameFrom(source) + ".id";
    var relationTargetColumn = name_1.generateDatabaseTableNameFrom(target) + "." + pluralize_1.singular(name_1.generateDatabaseTableNameFrom(source)) + "_id";
    return {
        type: "Property",
        method: false,
        shorthand: false,
        computed: false,
        key: { type: "Identifier", name: name_1.generateDatabaseTableNameFrom(target) },
        value: {
            type: "ObjectExpression",
            properties: [
                {
                    type: "Property",
                    method: false,
                    shorthand: false,
                    computed: false,
                    key: { type: "Identifier", name: "relation" },
                    value: {
                        type: "MemberExpression",
                        object: { type: "Identifier", name: "RootModel" },
                        property: { type: "Identifier", name: "HasManyRelation" },
                        computed: false
                    },
                    kind: "init"
                },
                {
                    type: "Property",
                    method: false,
                    shorthand: false,
                    computed: false,
                    key: { type: "Identifier", name: "from" },
                    value: { type: "Literal", value: relationSourceColumn, raw: "\"" + relationSourceColumn + "\"" },
                    kind: "init"
                },
                {
                    type: "Property",
                    method: false,
                    shorthand: false,
                    computed: false,
                    key: { type: "Identifier", name: "to" },
                    value: { type: "Literal", value: relationTargetColumn, raw: "\"" + relationTargetColumn + "\"" },
                    kind: "init"
                }
            ]
        },
        kind: "init"
    };
};
var generateASTForBelongsToOneRelation = function (source, target) {
    var relationSourceColumn = name_1.generateDatabaseTableNameFrom(source) + "." + pluralize_1.singular(name_1.generateDatabaseTableNameFrom(target)) + "_id";
    var relationTargetColumn = name_1.generateDatabaseTableNameFrom(target) + ".id";
    return {
        type: "Property",
        method: false,
        shorthand: false,
        computed: false,
        key: { type: "Identifier", name: pluralize_1.singular(name_1.generateDatabaseTableNameFrom(target)) },
        value: {
            type: "ObjectExpression",
            properties: [
                {
                    type: "Property",
                    method: false,
                    shorthand: false,
                    computed: false,
                    key: { type: "Identifier", name: "relation" },
                    value: {
                        type: "MemberExpression",
                        object: { type: "Identifier", name: "RootModel" },
                        property: { type: "Identifier", name: "BelongsToOneRelation" },
                        computed: false
                    },
                    kind: "init"
                },
                {
                    type: "Property",
                    method: false,
                    shorthand: false,
                    computed: false,
                    key: { type: "Identifier", name: "from" },
                    value: { type: "Literal", value: relationSourceColumn, raw: "\"" + relationSourceColumn + "\"" },
                    kind: "init"
                },
                {
                    type: "Property",
                    method: false,
                    shorthand: false,
                    computed: false,
                    key: { type: "Identifier", name: "to" },
                    value: { type: "Literal", value: relationTargetColumn, raw: "\"" + relationTargetColumn + "\"" },
                    kind: "init"
                }
            ]
        },
        kind: "init"
    };
};
//# sourceMappingURL=link.js.map