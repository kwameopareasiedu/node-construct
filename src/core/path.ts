import * as fs from "fs-extra";
import { logInfo, logWarning } from "./log";

export const pathExists = (path: string): boolean => fs.pathExistsSync(path);

export const destroy = (path: string): void => {
    if (pathExists(path)) {
        fs.removeSync(path);
        logInfo(`Deleted - ${path}`);
    } else logWarning(`Path does not exist - ${path}`);
};
