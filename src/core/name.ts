import { camelCase } from "lodash";
import pluralize from "pluralize";

/** Returns a hyphenated camel-cased version of a string. E.g. "hello world" => "Hello-World" */
export const toHyphenatedCamelCase = (str: string): string => {
    return str.split("").reduce((word, char) => {
        if (char.toLowerCase() == char) return word + char.trim();
        return word + (word ? "-" : "") + char.trim().toUpperCase();
    }, "");
};

/** Generates a camel-cased model name from the given string */
export const generateModelNameFrom = (name: string): string => {
    const n = pluralize.singular(toHyphenatedCamelCase(name)).toLowerCase();
    return n[0].toUpperCase() + camelCase(n).substring(1);
};

/** Generates a file name for the model */
export const generateModelFileNameFrom = (name: string): string => pluralize.singular(toHyphenatedCamelCase(name)).toLowerCase() + ".js";

/** Generates the database table name for this model */
export const generateDatabaseTableNameFrom = (name: string): string => {
    const n = pluralize.singular(toHyphenatedCamelCase(name)).toLowerCase();
    return pluralize(n).replace(/-/g, "_");
};
