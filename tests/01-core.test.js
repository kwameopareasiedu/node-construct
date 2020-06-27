const path = require("path");
const { assert } = require("chai");
const { destroy, pathExists } = require("../dist/core/path");
const { createFolder, readFolder } = require("../dist/core/folder");
const { logSuccess, logWarning, logInfo, logError } = require("../dist/core/log");
const { createFile, writeFile, readFile, renderTemplate } = require("../dist/core/file");
const { toHyphenatedCamelCase, generateModelNameFrom, generateModelFileNameFrom, generateDatabaseTableNameFrom } = require("../dist/core/name");

describe("Unit tests for core files", () => {
    const testRoot = path.resolve(process.cwd(), "testing-area/core");

    before(() => {
        destroy(testRoot);
        createFolder(testRoot);
    });

    it("should verify the test root is empty", async () => {
        const content = readFolder(testRoot);
        assert.equal(content.length, 0);
    });

    it("should create a file", async () => {
        const filePath = path.resolve(testRoot, "test-file-1");
        createFile(filePath);
        assert.equal(pathExists(filePath), true);
    });

    it("should write to a file", async () => {
        const filePath = path.resolve(testRoot, "test-file-1");
        writeFile(filePath, "Hello world!");
        assert.equal(readFile(filePath), "Hello world!");
    });

    it("should read to a file", async () => {
        const content = readFile(path.resolve(testRoot, "test-file-1"));
        assert.equal(content, "Hello world!");
    });

    it("should delete a file", async () => {
        const filePath = path.resolve(testRoot, "test-file-1");
        destroy(filePath);
        assert.equal(pathExists(filePath), false);
    });

    it("should render a template correctly", () => {
        const filePath = path.resolve(testRoot, "test-file-1.ejs");
        createFile(filePath);
        writeFile(filePath, "Hello world <%= name %>!");

        const parsedContent = renderTemplate(filePath, { name: "John Doe" });
        assert.equal(parsedContent, "Hello world John Doe!");
    });

    it("should convert a name to hyphenated camel-case", () => {
        assert.equal("Application-Log", toHyphenatedCamelCase("ApplicationLog"));
        assert.equal("Application-FAQ", toHyphenatedCamelCase("ApplicationFAQ"));
    });

    it("should generate a model's name from a string", () => {
        assert.equal("ApplicationLog", generateModelNameFrom("ApplicationLog"));
        assert.equal("ApplicationFaq", generateModelNameFrom("ApplicationFAQ"));
    });

    it("should generate a model's file name from a string", () => {
        assert.equal("application-log.js", generateModelFileNameFrom("ApplicationLOG"));
        assert.equal("application-faq.js", generateModelFileNameFrom("ApplicationFAQ"));
    });

    it("should generate a model's database table name from a string", () => {
        assert.equal("application_logs", generateDatabaseTableNameFrom("ApplicationLog"));
        assert.equal("application_faqs", generateDatabaseTableNameFrom("ApplicationFAQ"));
    });

    it("should log without errors", () => {
        assert.doesNotThrow(() => {
            logInfo("Info message");
            logSuccess("Success message");
            logWarning("Warning message");
            logError("Error message");
        });
    });
});
