import * as path from "path";
import * as moment from "moment";
import { format } from "prettier";
import { logSuccess } from "../core/log";
import { pathExists } from "../core/path";
import { createFolder } from "../core/folder";
import { writeFile, renderTemplate, readFile } from "../core/file";
import { prettierConfig, readModelDefinitions } from "../core/misc";
import { generateDatabaseTableNameFrom, generateModelFileNameFrom, generateModelNameFrom } from "../core/name";

/** Creates a model file matching the given name with the appropriate code and database helper files */
export const generate = async (name: string, root: string): Promise<void> => {
    // Make sure the migrations folder and objection config and root model files exist
    const { dbRoot, migrations } = await readModelDefinitions(root);
    createFolder(path.resolve(root, migrations));
    createFolder(path.resolve(root, dbRoot));
    ensureObjectionConfig(root, dbRoot);
    ensureRootModel(root, dbRoot);

    const modelName = generateModelNameFrom(name);
    const modelFileName = generateModelFileNameFrom(name);
    const databaseTableName = generateDatabaseTableNameFrom(name);

    // Create the model folder and index file
    const modelTemplatePath = path.resolve(__dirname, "../../templates/model.js.ejs");
    const modelTemplateContent = renderTemplate(modelTemplatePath, { modelName, databaseTableName });
    const modelFolderPath = path.resolve(root, dbRoot, modelFileName.replace(".js", ""));
    const modelFilePath = path.resolve(modelFolderPath, "index.js");
    createFolder(modelFolderPath);
    writeFile(modelFilePath, format(modelTemplateContent, prettierConfig));
    logSuccess("Model index file created!");

    // Create the migration file for the model
    const migrationTemplatePath = path.resolve(__dirname, "../../templates/migration.js.ejs");
    const migrationTemplateContent = renderTemplate(migrationTemplatePath, { databaseTableName });
    const migrationFilePath = path.resolve(root, migrations, `${moment().format("YYYYMMDDHHmmssSSS")}_create_${databaseTableName}_table.js`);
    writeFile(migrationFilePath, format(migrationTemplateContent, prettierConfig));
    logSuccess("Migration file created!");

    // Create database helper files
    const crudTemplatePath = path.resolve(__dirname, "../../templates/model-crud.js.ejs");
    const crudTemplateContent = renderTemplate(crudTemplatePath, { modelName });
    const crudFilePath = path.resolve(modelFolderPath, "crud.js");
    writeFile(crudFilePath, format(crudTemplateContent, prettierConfig));
    logSuccess("Database helper files created!");
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
