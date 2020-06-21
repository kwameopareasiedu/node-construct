import nodePath from "path";
import fse from "fs-extra";
import { logInfo, logWarning } from "./log";

export const pathExists = (path: string): boolean => fse.pathExistsSync(path);

export const destroy = (path: string): void => {
    if (pathExists(path)) {
        fse.removeSync(path);
        logInfo(`Deleted - ${path}`);
    } else logWarning(`Path does not exist - ${path}`);
};

export const resolvePath = (path: string): string => {
    return nodePath.resolve(process.cwd(), path);
};
