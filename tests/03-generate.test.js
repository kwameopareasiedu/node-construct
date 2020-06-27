const path = require("path");
const { assert } = require("chai");
const { destroy } = require("../dist/core/path");
const { createFolder } = require("../dist/core/folder");
const { generate } = require("../dist/features/generate");
const { init } = require("../dist/features/init");

describe("Unit tests for generate.ts", () => {
    const testRoot = path.resolve(process.cwd(), "testing-area/project");

    before(() => {
        destroy(testRoot);
        createFolder(testRoot);
        init(testRoot);
    });

    it("should generate a model from a name", () => {
        assert.doesNotThrow(async () => await generate("User", testRoot));
    });
});
