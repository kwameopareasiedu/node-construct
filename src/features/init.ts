import * as path from "path";
import { logSuccess } from "../core/log";
import { readFile, writeFile } from "../core/file";

/** Creates the model-definitions.js file at the project root */
export const init = (root: string): void => {
    const targetPath = path.resolve(root, "model-definitions.js");
    writeFile(targetPath, readFile(path.resolve(__dirname, "../templates/model-definitions.js.ejs")));
    logSuccess("Model definitions file created!");
};
