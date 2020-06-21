import * as ejs from "ejs";
import * as fs from "fs-extra";
import { logInfo } from "./log";

export const createFile = (path: string): void => {
    fs.ensureFileSync(path);
    logInfo(`File created - ${path}`);
};

export const readFile = (path: string): string => fs.readFileSync(path, { encoding: "utf-8" });

export const writeFile = (path: string, data: string): void => {
    fs.writeFileSync(path, data || "");
    logInfo(`File written - ${path}`);
};

export const renderFile = (path: string, params = {}): string => ejs.render(readFile(path), params);
