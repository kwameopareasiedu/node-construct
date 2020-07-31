import { camelCase } from "lodash";
import * as pluralize from "pluralize";

/** Returns a hyphenated camel-cased version of a string. E.g. "hello world" => "Hello-World" */
export const toHyphenatedCamelCase = (str: string): string => {
    return str.split("").reduce((word, char) => {
        if (char.toLowerCase() == char) return word + char.trim();
        // If char is a capital letter and the preceding char is also a capital letter, just concatenate the word and this char
        if (word && word.slice(-1).toLowerCase() !== word.slice(-1)) return word + char;
        return word + (word ? "-" : "") + char;
    }, "");
};

/** Generates a camel-cased model name from the given string */
export const generateModelNameFrom = (name: string): string => {
    const n = pluralize.singular(toHyphenatedCamelCase(name)).toLowerCase();
    return n[0].toUpperCase() + camelCase(n).substring(1);
};

/** Generates a folder name for the model */
export const generateModelFolderNameFrom = (name: string): string => pluralize.singular(toHyphenatedCamelCase(name)).toLowerCase();

/** Generates the database table name for this model */
export const generateDatabaseTableNameFrom = (name: string): string => {
    const n = pluralize.singular(toHyphenatedCamelCase(name)).toLowerCase();
    return pluralize(n).replace(/-/g, "_");
};
