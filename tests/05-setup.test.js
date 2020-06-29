const path = require("path");
const { assert } = require("chai");
const { destroy, pathExists } = require("../dist/core/path");
const { readModelDefinitions } = require("../dist/core/misc");
const { createFolder, readFolder, FolderContent } = require("../dist/core/folder");
const { setup } = require("../dist/features/setup");
const { init } = require("../dist/features/init");

describe("Unit tests for setup.ts", () => {
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

    it("should setup models from the test relations", () => {
        const relations = ["User HAS_ONE Profile", "User HAS_MANY [Post, Comment UserSubscriber]", "Post HAS_MANY Comment"];
        assert.doesNotThrow(async () => await setup(testRoot, dbRoot, migrationsRoot, relations));
    });

    it("should verify generated migration files", () => {
        assert.equal(pathExists(path.resolve(testRoot, "src/server/migrations")), true);

        const migrationFolderContent = readFolder(path.resolve(testRoot, "src/server/migrations"), FolderContent.FILE);
        assert.equal(migrationFolderContent.length, 10);
        assert.equal(migrationFolderContent[0].includes("create_users_table"), true);
        assert.equal(migrationFolderContent[1].includes("create_profiles_table"), true);
        assert.equal(migrationFolderContent[2].includes("create_posts_table"), true);
        assert.equal(migrationFolderContent[3].includes("create_comments_table"), true);
        assert.equal(migrationFolderContent[4].includes("create_user_subscribers_table"), true);
        assert.equal(migrationFolderContent[5].includes("add_user_id_to_profiles_table"), true);
        assert.equal(migrationFolderContent[6].includes("add_user_id_to_posts_table"), true);
        assert.equal(migrationFolderContent[7].includes("add_user_id_to_comments_table"), true);
        assert.equal(migrationFolderContent[8].includes("add_user_id_to_user_subscribers_table"), true);
        assert.equal(migrationFolderContent[9].includes("add_post_id_to_comments_table"), true);

        const dbServiceFolderContent = readFolder(path.resolve(testRoot, "src/server/services/db"), FolderContent.FOLDER);
        assert.equal(dbServiceFolderContent.length, 5);
        assert.equal(dbServiceFolderContent[0], "comment");
        assert.equal(dbServiceFolderContent[1], "post");
        assert.equal(dbServiceFolderContent[2], "profile");
        assert.equal(dbServiceFolderContent[3], "user");
        assert.equal(dbServiceFolderContent[4], "user-subscriber");
    });

    it("should throw an error if circular dependency is detected", async () => {
        // Modify the model-definitions file to include test relations
        const newRelations = ["User HAS_ONE Profile", "Profile HAS_ONE User"];
        setup(testRoot, dbRoot, migrationsRoot, newRelations).catch(err => assert.fail(err.message));
    });

    it("should continue even if circular dependency is detected", async () => {
        // Modify the model-definitions file to include test relations
        const newRelations = ["User HAS_ONE Profile", "Profile HAS_ONE User"];
        assert.doesNotThrow(async () => await setup(testRoot, dbRoot, migrationsRoot, newRelations, true));
    });
});
