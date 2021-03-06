const path = require("path");
const { assert } = require("chai");
const { init } = require("../dist/features/init");
const { generate } = require("../dist/features/generate");
const { destroy, pathExists } = require("../dist/core/path");
const { readModelDefinitions } = require("../dist/core/misc");
const { createFolder, readFolder, FolderContent } = require("../dist/core/folder");

describe("Unit tests for generate.ts", () => {
    const testRoot = path.resolve(process.cwd(), "testing-area/project");
    let dbRoot, migrationsRoot;

    before(async () => {
        destroy(testRoot);
        createFolder(testRoot);
        init(testRoot);

        const definitions = await readModelDefinitions(testRoot);
        migrationsRoot = definitions.migrationsRoot;
        dbRoot = definitions.dbRoot;
    });

    it("should generate a model from a name", () => {
        assert.doesNotThrow(async () => {
            await generate(testRoot, dbRoot, migrationsRoot, "User");
            await generate(testRoot, dbRoot, migrationsRoot, "MovementVector");
        });
    });

    it("should verify generated files", () => {
        assert.equal(pathExists(path.resolve(testRoot, "src/server/migrations")), true);
        assert.equal(pathExists(path.resolve(testRoot, "src/server/services/db/user")), true);
        assert.equal(pathExists(path.resolve(testRoot, "src/server/services/db/movement-vector")), true);
        assert.equal(pathExists(path.resolve(testRoot, "src/server/services/db/index.js")), true);

        const migrationFolderContent = readFolder(path.resolve(testRoot, "src/server/migrations"), FolderContent.FILE);
        assert.equal(migrationFolderContent.length, 2);
        assert.equal(migrationFolderContent[0].includes("create_users_table"), true);
        assert.equal(migrationFolderContent[1].includes("create_movement_vectors_table"), true);

        const userModelFolderContent = readFolder(path.resolve(testRoot, "src/server/services/db/user"), FolderContent.FILE);
        assert.equal(userModelFolderContent.length, 2);
        assert.equal(userModelFolderContent.join("|"), "crud.js|index.js");

        const movementVectorModelFolderContent = readFolder(path.resolve(testRoot, "src/server/services/db/movement-vector"), FolderContent.FILE);
        assert.equal(movementVectorModelFolderContent.length, 2);
        assert.equal(movementVectorModelFolderContent.join("|"), "crud.js|index.js");
    });
});
