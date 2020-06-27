import * as path from "path";
import { format } from "prettier";
import { logSuccess } from "../core/log";
import { pathExists } from "../core/path";
import { createFolder } from "../core/folder";
import { readModelDefinitions } from "../core/misc";
import { writeFile, renderTemplate, readFile } from "../core/file";
import { generateDatabaseTableNameFrom, generateModelFileNameFrom, generateModelNameFrom } from "../core/name";

/** Creates a model file matching the given name with the appropriate code and database helper files */
export const generate = async (name: string, root: string): Promise<void> => {
    // Make sure the objection config and root model files exist
    const { dbRoot } = await readModelDefinitions(root);
    createFolder(path.resolve(root, dbRoot));
    ensureObjectionConfig(root, dbRoot);
    ensureRootModel(root, dbRoot);

    const modelName = generateModelNameFrom(name);
    const fileName = generateModelFileNameFrom(name);
    const tableName = generateDatabaseTableNameFrom(name);
    const folderPath = path.resolve(root, dbRoot, fileName.replace(".js", ""));
    const filePath = path.resolve(root, folderPath, "index.js");

    // Create the model folder and index file
    const modelTemplatePath = path.resolve(__dirname, "../../templates/model.js.ejs");
    const modelTemplateContent = renderTemplate(modelTemplatePath, { modelName, databaseTableName: tableName });
    createFolder(folderPath);
    writeFile(
        filePath,
        format(modelTemplateContent, {
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
        })
    );
};

const ensureObjectionConfig = (root: string, dbRoot: string): void => {
    const knexfilePath = path.resolve(root, "knexfile.js");
    const objectionPath = path.resolve(root, dbRoot, "config.js");
    const relativePathToKnexfile = path.relative(path.resolve(root, dbRoot), knexfilePath);
    const templatePath = path.resolve(__dirname, "../../templates/objection-config.js.ejs");

    if (!pathExists(objectionPath)) {
        const templateContent = renderTemplate(templatePath, { knexfilePath: relativePathToKnexfile });
        writeFile(objectionPath, templateContent);
        logSuccess("Objection config file created!");
    }
};

const ensureRootModel = (root: string, dbRoot: string): void => {
    const rootModelPath = path.resolve(root, dbRoot, "root.js");
    const templatePath = path.resolve(__dirname, "../../templates/root-model.js.ejs");

    if (!pathExists(rootModelPath)) {
        writeFile(rootModelPath, readFile(templatePath));
        logSuccess("Root model created!");
    }
};
