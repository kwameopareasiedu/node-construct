const path = require("path");
const { assert } = require("chai");
const { destroy } = require("../dist/core/path");
const { createFolder } = require("../dist/core/folder");
const { readModelDefinitions } = require("../dist/core/misc");
const { init } = require("../dist/features/init");

describe("Unit tests for init.ts", () => {
    const testRoot = path.resolve(process.cwd(), "testing-area/project");

    before(() => {
        destroy(testRoot);
        createFolder(testRoot);
    });

    it("should create a model-definitions file in root", () => {
        assert.doesNotThrow(() => init(testRoot));
    });

    it("should verify that model-definitions file exists", async () => {
        const definitions = await readModelDefinitions(testRoot);
        assert.isNotNull(definitions);
        assert.isNotNull(definitions.models);
        assert.isNotNull(definitions.relations);
        assert.isNotNull(definitions.dbRoot);
        assert.equal(Object.prototype.toString.call(definitions.models), "[object Array]");
        assert.equal(Object.prototype.toString.call(definitions.relations), "[object String]");
        assert.equal(Object.prototype.toString.call(definitions.dbRoot), "[object String]");
        assert.equal(definitions.models.length, 0);
        assert.equal(definitions.relations, "");
        assert.equal(definitions.dbRoot, "src/server/services/db");
    });
});