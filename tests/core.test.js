const { assert } = require("chai");
const { createFolder, readFolder } = require("../dist/core/folder");
const { destroy, resolvePath, pathExists } = require("../dist/core/path");
const { createFile, writeFile, readFile, renderFile } = require("../dist/core/file");

describe("Unit tests for core files", () => {
    const testRoot = resolvePath("testing-area/core");

    const prepare = () => {
        destroy(testRoot);
        createFolder(testRoot);
    };

    before(prepare);

    it("should verify the test root is empty", async () => {
        const content = readFolder(testRoot);
        assert.equal(content.length, 0);
    });

    it("should create a file", async () => {
        const filePath = resolvePath(testRoot + "/test-file-1");
        createFile(filePath);
        assert.equal(pathExists(filePath), true);
    });

    it("should write to a file", async () => {
        const filePath = resolvePath(testRoot + "/test-file-1");
        writeFile(filePath, "Hello world!");
        assert.equal(readFile(filePath), "Hello world!");
    });

    it("should read to a file", async () => {
        const content = readFile(resolvePath(testRoot + "/test-file-1"));
        assert.equal(content, "Hello world!");
    });

    it("should delete a file", async () => {
        const filePath = resolvePath(testRoot + "/test-file-1");
        destroy(filePath);
        assert.equal(pathExists(filePath), false);
    });

    it("should render a template correctly", () => {
        const filePath = resolvePath(testRoot + "/test-file-1.ejs");
        createFile(filePath);
        writeFile(filePath, "Hello world <%= name %>!");

        const parsedContent = renderFile(filePath, { name: "John Doe" });
        assert.equal(parsedContent, "Hello world John Doe!");
    });
});
