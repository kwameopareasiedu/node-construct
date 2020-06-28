import * as path from "path";
import { pathExists } from "./path";

export const readModelDefinitions = async (root: string): Promise<{ relations: ""; dbRoot: string; migrationsRoot: string }> => {
    const modelDefinitionsPath = path.resolve(root, "model-definitions.js");
    if (!pathExists(modelDefinitionsPath)) throw new Error("Cannot find 'model-definitions.js' config file. Run 'agile-model init' first");
    return await import(modelDefinitionsPath);
};

export const prettierConfig: any = {
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
};
