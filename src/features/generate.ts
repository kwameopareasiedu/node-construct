import * as path from "path";
import { logSuccess } from "../core/log";
import { pathExists } from "../core/path";
import { createFolder } from "../core/folder";
import { readModelDefinitions } from "../core/misc";
import { writeFile, renderTemplate } from "../core/file";
import { generateDatabaseTableNameFrom, generateModelFileNameFrom, generateModelNameFrom } from "../core/name";

/** Creates a model file matching the given name with the appropriate code and database helper files */
export const generate = async (name: string, root: string): Promise<void> => {
    const { dbRoot } = await readModelDefinitions(root);
    createObjectionConfigFile(root, dbRoot);

    const modelName = generateModelNameFrom(name);
    const fileName = generateModelFileNameFrom(name);
    const tableName = generateDatabaseTableNameFrom(name);
    const folderPath = path.resolve(dbRoot, fileName);
    const filePath = path.resolve(folderPath, "index.js");
};

const createObjectionConfigFile = (root: string, dbRoot: string): void => {
    createFolder(path.resolve(root, dbRoot));

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
