import * as fs from "fs-extra";
import * as nodePath from "path";
import { pathExists } from "./path";
import { logInfo, logWarning } from "./log";

export enum FolderContent {
    FOLDER,
    FILE,
    ALL
}

export const createFolder = (path: string): void => {
    if (pathExists(path)) return;
    fs.mkdirSync(path, { recursive: true });
    logInfo(`Folder created - ${path}`);
};

export const readFolder = (path: string, mode = FolderContent.ALL): Array<string> => {
    if (!pathExists(path)) {
        logWarning(`Path does not exist - ${path}`);
        return [];
    }

    if (!fs.lstatSync(path).isDirectory()) {
        logWarning("Search path is not a directory. Empty array returned");
        return [];
    }

    const folderContents = fs.readdirSync(path, { encoding: "utf-8" });

    return folderContents.filter(content => {
        const contentStats = fs.lstatSync(nodePath.join(path, content));
        if (mode === FolderContent.FOLDER) return contentStats.isDirectory();
        if (mode === FolderContent.FILE) return contentStats.isDirectory();
        return true;
    });
};
