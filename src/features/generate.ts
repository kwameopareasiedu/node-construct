import * as path from "path";
import { print } from "recast";
import * as moment from "moment";
import { format } from "prettier";
import { camelCase } from "lodash";
import { logSuccess } from "../core/log";
import { pathExists } from "../core/path";
import { prettierConfig } from "../core/misc";
import { readFile, renderTemplate, writeFile } from "../core/file";
import { createFolder, FolderContent, readFolder } from "../core/folder";
import { generateDatabaseTableNameFrom, generateModelFolderNameFrom, generateModelNameFrom } from "../core/name";

/** Creates a model file matching the given name with the appropriate code and database helper files */
export const generate = async (root: string, dbRoot: string, migrationsRoot: string, name: string): Promise<void> => {
    // Make sure the migrations folder and objection config and root model files exist
    createFolder(path.resolve(root, migrationsRoot));
    createFolder(path.resolve(root, dbRoot));
    ensureObjectionConfig(root, dbRoot);
    ensureRootModel(root, dbRoot);

    const modelName = generateModelNameFrom(name);
    const modelFolderName = generateModelFolderNameFrom(name);
    const databaseTableName = generateDatabaseTableNameFrom(name);

    // Create the model folder and index file
    const modelTemplatePath = path.resolve(__dirname, "../../templates/model.js.ejs");
    const modelTemplateContent = renderTemplate(modelTemplatePath, { modelName, databaseTableName });
    const modelFolderPath = path.resolve(root, dbRoot, modelFolderName);
    const modelFilePath = path.resolve(modelFolderPath, "index.js");
    createFolder(modelFolderPath);
    writeFile(modelFilePath, format(modelTemplateContent, prettierConfig));

    // Create the migration file for the model
    const migrationTemplatePath = path.resolve(__dirname, "../../templates/model-migration.js.ejs");
    const migrationTemplateContent = renderTemplate(migrationTemplatePath, { databaseTableName });
    const migrationFilePath = path.resolve(root, migrationsRoot, `${moment().format("YYYYMMDDHHmmssSSS")}_create_${databaseTableName}_table.js`);
    writeFile(migrationFilePath, format(migrationTemplateContent, prettierConfig));

    // Create database helper files
    const crudTemplatePath = path.resolve(__dirname, "../../templates/model-crud.js.ejs");
    const crudTemplateContent = renderTemplate(crudTemplatePath, { modelName });
    const crudFilePath = path.resolve(modelFolderPath, "crud.js");
    writeFile(crudFilePath, format(crudTemplateContent, prettierConfig));

    // Update the db root to include model
    updateDBRootIndex(root, dbRoot);
    logSuccess(`Successfully generated ${modelName} model and related files!\n`);
};

const ensureObjectionConfig = (root: string, dbRoot: string): void => {
    const knexfilePath = path.resolve(root, "knexfile.js");
    const objectionPath = path.resolve(root, dbRoot, "config.js");
    const relativePathToKnexfile = path.relative(path.resolve(root, dbRoot), knexfilePath);
    const templatePath = path.resolve(__dirname, "../../templates/objection-config.js.ejs");

    if (!pathExists(objectionPath)) {
        const templateContent = renderTemplate(templatePath, { knexfilePath: relativePathToKnexfile });
        writeFile(objectionPath, templateContent);
        logSuccess("Objection config file created!\n");
    }
};

const ensureRootModel = (root: string, dbRoot: string): void => {
    const rootModelPath = path.resolve(root, dbRoot, "root.js");
    const templatePath = path.resolve(__dirname, "../../templates/root-model.js.ejs");

    if (!pathExists(rootModelPath)) {
        writeFile(rootModelPath, readFile(templatePath));
        logSuccess("Root model created!\n");
    }
};

const updateDBRootIndex = (root: string, dbRoot: string): void => {
    const dbRootFolders = readFolder(path.resolve(root, dbRoot), FolderContent.FOLDER);

    const syntaxTreeObjectExpressionProperties = dbRootFolders.map(folder => ({
        type: "Property",
        method: false,
        shorthand: false,
        computed: false,
        key: { type: "Identifier", name: camelCase(folder) },
        value: {
            type: "CallExpression",
            callee: { type: "Identifier", name: "require" },
            arguments: [{ type: "Literal", value: folder, raw: `"${folder}"` }]
        },
        kind: "init"
    }));

    const finalSyntaxTree = {
        type: "Program",
        body: [
            {
                type: "ExpressionStatement",
                expression: {
                    type: "AssignmentExpression",
                    operator: "=",
                    left: {
                        type: "MemberExpression",
                        object: { type: "Identifier", name: "module" },
                        property: { type: "Identifier", name: "exports" },
                        computed: false
                    },
                    right: {
                        type: "ObjectExpression",
                        properties: syntaxTreeObjectExpressionProperties
                    }
                }
            }
        ],
        sourceType: "module"
    };

    const dbRootIndexPath = path.resolve(root, dbRoot, "index.js");
    writeFile(dbRootIndexPath, format(print(finalSyntaxTree).code, prettierConfig));
};
