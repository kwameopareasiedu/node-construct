#!/usr/bin/env node
const { prompt } = require("inquirer");
const commander = require("commander");
const { execSync } = require("child_process");
const { logError } = require("../dist/core/log");
const { init } = require("../dist/features/init");
const { link } = require("../dist/features/link");
const { setup } = require("../dist/features/setup");
const { generate } = require("../dist/features/generate");
const { readModelDefinitions } = require("../dist/core/misc");

commander.version("0.1.0", "-v, --version", "Output the version number");
commander.helpOption("-h, --help", "Display this help menu");

commander
    .command("init")
    .description("Create the model-definitions.js file at the project root")
    .action(() => init(process.cwd()));

commander
    .command("generate <name>")
    .description("Create a model file matching the given name with the appropriate code and database helper files")
    .action(async name => {
        try {
            const root = process.cwd();
            const { dbRoot, migrationsRoot } = await readModelDefinitions(root);
            await generate(root, dbRoot, migrationsRoot, name);
        } catch (err) {
            logError(err);
        }
    });

commander
    .command("link <source> <target>")
    .option("-r, --relation-type <type>", "Relation type. Supported values are HAS_ONE, HAS_MANY, and BELONGS_TO_ONE")
    .description("Modify source codes of source and target models to create relations between them")
    .action(async (source, target, { relationType: _relationType }) => {
        try {
            const root = process.cwd();
            const { dbRoot, migrationsRoot } = await readModelDefinitions(root);
            const relationType = ["HAS_ONE", "HAS_MANY", "BELONGS_TO_ONE"].indexOf(_relationType);
            await link(root, dbRoot, migrationsRoot, source, target, relationType);
        } catch (err) {
            logError(err);
        }
    });

commander
    .command("setup")
    .option("-n, --no-checks", "Skip checks for circular dependencies between models")
    .option("--yarn", "Use Yarn as the default package manager for installing required dependencies")
    .option("--npm", "Use NPM as the default package manager for installing required dependencies")
    .description(
        "Process the model-definitions.js file at the project root and creates the specified models with their relations. " +
            "Also install dependencies needed for models and migrations to work (I.e. knex, objection and uuid)"
    )
    .action(async ({ checks, yarn, npm }) => {
        try {
            const root = process.cwd();
            const { dbRoot, migrationsRoot, relations } = await readModelDefinitions(root);
            await setup(root, dbRoot, migrationsRoot, relations, !checks);

            const packageManager = await (async () => {
                if (yarn) return "Yarn";
                if (npm) return "NPM";
                return prompt([
                    {
                        type: "list",
                        name: "package-manager",
                        message: "Which package manager would you like to use to install required dependencies? ",
                        default: "Yarn",
                        choices: ["Yarn", "NPM"]
                    }
                ]).then(ans => ans["package-manager"]);
            })();

            // Install knex, object and uuid dependencies when done
            if (packageManager === "Yarn") execSync("yarn add knex objection uuid", { stdio: "inherit" });
            else if (packageManager === "NPM") execSync("npm i --save knex objection uuid", { stdio: "inherit" });
        } catch (err) {
            logError(err);
        }
    });

commander.parse(process.argv);
