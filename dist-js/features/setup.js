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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setup = void 0;
var generate_1 = require("./generate");
var link_1 = require("./link");
var validRelations = ["HAS_ONE", "HAS_MANY", "BELONGS_TO_ONE"];
exports.setup = function (root, dbRoot, migrationsRoot, relations, noChecks) {
    if (noChecks === void 0) { noChecks = false; }
    return __awaiter(void 0, void 0, void 0, function () {
        var relationGraph, modelNamesHaveCircularDependency, modelNames, _i, modelNames_1, modelName, _loop_1, _a, relationGraph_1, _b, source, target, _relationType;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    relationGraph = [];
                    modelNamesHaveCircularDependency = function (source, target) {
                        return relationGraph.filter(function (_a) {
                            var s = _a[0], t = _a[1];
                            return s === target && t === source;
                        }).length > 0;
                    };
                    modelNames = relations.reduce(function (names, relation) {
                        var components = relation.split(/[ |[|\]|,]/g);
                        var source = (components[0] || "").trim();
                        if (!source)
                            throw new Error("No source model found in \"" + relation + "\" relation");
                        var relationType = (components[1] || "").trim();
                        if (!relationType)
                            throw new Error("No relation type found in \"" + relation + "\" relation");
                        if (!validRelations.includes(relationType))
                            throw new Error("Invalid relation type. Valid values are: " + validRelations.join(", "));
                        var targets = components
                            .slice(2)
                            .map(function (c) { return c.trim(); })
                            .filter(function (c) { return !!c; });
                        if (!targets || targets.length == 0)
                            throw new Error("No target model(s) found in \"" + relation + "\" relation");
                        if (!names.includes(source))
                            names.push(source);
                        for (var _i = 0, targets_1 = targets; _i < targets_1.length; _i++) {
                            var target = targets_1[_i];
                            if (!noChecks) {
                                if (modelNamesHaveCircularDependency(source, target)) {
                                    var msg1 = "Circular dependency detected between \"" + source + "\" and \"" + target + "\". (I.e. \"" + source + "\" depends on \"" + target + "\" and vice-versa)";
                                    var msg2 = "If this is desired, run this command with --no-checks or -n";
                                    throw new Error(msg1 + msg2);
                                }
                                else
                                    relationGraph.push([source, target, relationType]);
                            }
                            if (!names.includes(target))
                                names.push(target);
                        }
                        return __spreadArrays(names);
                    }, []);
                    _i = 0, modelNames_1 = modelNames;
                    _c.label = 1;
                case 1:
                    if (!(_i < modelNames_1.length)) return [3, 4];
                    modelName = modelNames_1[_i];
                    return [4, generate_1.generate(root, dbRoot, migrationsRoot, modelName)];
                case 2:
                    _c.sent();
                    _c.label = 3;
                case 3:
                    _i++;
                    return [3, 1];
                case 4:
                    _loop_1 = function (source, target, _relationType) {
                        var relationType;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    relationType = (function () {
                                        if (_relationType === "HAS_ONE")
                                            return link_1.RelationType.HAS_ONE;
                                        if (_relationType === "HAS_MANY")
                                            return link_1.RelationType.HAS_MANY;
                                        if (_relationType === "BELONGS_TO_ONE")
                                            return link_1.RelationType.BELONGS_TO_ONE;
                                    })();
                                    return [4, link_1.link(root, dbRoot, migrationsRoot, source, target, relationType)];
                                case 1:
                                    _a.sent();
                                    return [2];
                            }
                        });
                    };
                    _a = 0, relationGraph_1 = relationGraph;
                    _c.label = 5;
                case 5:
                    if (!(_a < relationGraph_1.length)) return [3, 8];
                    _b = relationGraph_1[_a], source = _b[0], target = _b[1], _relationType = _b[2];
                    return [5, _loop_1(source, target, _relationType)];
                case 6:
                    _c.sent();
                    _c.label = 7;
                case 7:
                    _a++;
                    return [3, 5];
                case 8: return [2];
            }
        });
    });
};
//# sourceMappingURL=setup.js.map