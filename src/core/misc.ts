import prettier from "prettier";
import { camelCase } from "lodash";
import { pathExists, resolvePath } from "./path";
import { FolderContent, readFolder } from "./folder";
import { createFile, writeFile } from "./file";

export const readModelDefinitions = async (): Promise<any> => {
    const modelDefinitionsPath = resolvePath("model-definitions.js");
    if (!pathExists(modelDefinitionsPath)) throw new Error("Cannot find 'model-definitions.js' config file. Run 'agile-model init' first");
    return await import(modelDefinitionsPath);
};

export const updateDBServiceIndex = (dbServicePath: string): void => {
    dbServicePath = resolvePath(dbServicePath);
    const modelFolders = readFolder(dbServicePath, FolderContent.FOLDER);
    const modelNames = modelFolders.map(folder => `${camelCase(folder)},`);
    const modelFolderImportStrings = modelFolders.map(folder => `const ${camelCase(folder)} = require("./${folder}");`);
    const content = prettier.format(`${modelFolderImportStrings.join("\n")}\\n module.exports = {\\n ${modelNames.join("\n")} };`, {
        parser: "babel",
        printWidth: 150,
        useTabs: true,
        tabWidth: 4,
        semi: true,
        singleQuote: false,
        bracketSpacing: true,
        trailingComma: "none"
    });
    createFile(dbServicePath + "/index.js");
    writeFile(dbServicePath + "/index.js", content);
};

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
