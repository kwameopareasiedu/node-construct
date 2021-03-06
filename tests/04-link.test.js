const path = require("path");
const { assert } = require("chai");
const { init } = require("../dist/features/init");
const { generate } = require("../dist/features/generate");
const { destroy, pathExists } = require("../dist/core/path");
const { readModelDefinitions } = require("../dist/core/misc");
const { link, RelationType } = require("../dist/features/link");
const { createFolder, readFolder, FolderContent } = require("../dist/core/folder");

describe("Unit tests for link.ts", () => {
    const testRoot = path.resolve(process.cwd(), "testing-area/project");
    let dbRoot, migrationsRoot;

    before(async () => {
        destroy(testRoot);
        createFolder(testRoot);
        init(testRoot);

        const definitions = await readModelDefinitions(testRoot);
        migrationsRoot = definitions.migrationsRoot;
        dbRoot = definitions.dbRoot;

        await generate(testRoot, dbRoot, migrationsRoot, "User");
        await generate(testRoot, dbRoot, migrationsRoot, "Profile");
        await generate(testRoot, dbRoot, migrationsRoot, "Post");
        await generate(testRoot, dbRoot, migrationsRoot, "Comment");
    });

    it("should throw an error when linking the User and Vector models because Vector is not a valid model", () => {
        link(testRoot, dbRoot, migrationsRoot, "User", "Vector", RelationType.HAS_ONE).catch(err => assert.fail(err.message));
    });

    it("should link the User and Profile models with a HAS_ONE relation", () => {
        assert.doesNotThrow(async () => await link(testRoot, dbRoot, migrationsRoot, "User", "Profile", RelationType.HAS_ONE));
    });

    it("should link the User and Post models with a HAS_MANY relation", () => {
        assert.doesNotThrow(async () => await link(testRoot, dbRoot, migrationsRoot, "User", "Post", RelationType.HAS_MANY));
    });

    it("should link the Post and Comment models with a HAS_MANY relation", () => {
        assert.doesNotThrow(async () => await link(testRoot, dbRoot, migrationsRoot, "Post", "Comment", RelationType.HAS_MANY));
    });

    it("should link the Comment and User models with a BELONGS_TO_ONE relation", () => {
        assert.doesNotThrow(async () => await link(testRoot, dbRoot, migrationsRoot, "Comment", "User", RelationType.BELONGS_TO_ONE));
    });

    it("should verify generated migration files", () => {
        assert.equal(pathExists(path.resolve(testRoot, "src/server/migrations")), true);

        const migrationFolderContent = readFolder(path.resolve(testRoot, "src/server/migrations"), FolderContent.FILE);
        assert.equal(migrationFolderContent.length, 8);
        assert.equal(migrationFolderContent[4].includes("add_user_id_to_profiles_table"), true);
        assert.equal(migrationFolderContent[5].includes("add_user_id_to_posts_table"), true);
        assert.equal(migrationFolderContent[6].includes("add_post_id_to_comments_table"), true);
        assert.equal(migrationFolderContent[7].includes("add_user_id_to_comments_table"), true);
    });
});
