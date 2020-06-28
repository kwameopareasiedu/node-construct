import * as path from "path";
import * as moment from "moment";
import { format } from "prettier";
import { singular } from "pluralize";
import { parse, print } from "recast";
import { logSuccess } from "../core/log";
import { pathExists } from "../core/path";
import { prettierConfig } from "../core/misc";
import { readFile, renderTemplate, writeFile } from "../core/file";
import { generateDatabaseTableNameFrom, generateModelFolderNameFrom, generateModelNameFrom } from "../core/name";

export enum RelationType {
    HAS_ONE,
    HAS_MANY,
    BELONGS_TO_ONE
}

/** Modifies source codes of target models to create relations between them */
export const link = async (
    root: string,
    dbRoot: string,
    migrationsRoot: string,
    source: string,
    target: string,
    relation: RelationType
): Promise<void> => {
    // Verify that source and target are valid models in project
    const sourceModelFolderName = generateModelFolderNameFrom(source);
    const targetModelFolderName = generateModelFolderNameFrom(target);

    if (!pathExists(path.resolve(root, dbRoot, sourceModelFolderName))) throw new Error(`${source} is not a valid model in the project`);
    if (!pathExists(path.resolve(root, dbRoot, targetModelFolderName))) throw new Error(`${target} is not a valid model in the project`);

    // Generate abstract syntax tree of relation depending on relation type
    const relationAST = (() => {
        if (relation === RelationType.HAS_ONE) return generateASTForHasOneRelation(source, target);
        else if (relation === RelationType.HAS_MANY) return generateASTForHasManyRelation(source, target);
        else if (relation === RelationType.BELONGS_TO_ONE) return generateASTForBelongsToOneRelation(source, target);
        else throw new Error("Invalid relation type");
    })();

    // Add the source-to-target relation to the source model source code
    const sourceModelName = generateModelNameFrom(source);
    const sourceModelPath = path.resolve(root, dbRoot, sourceModelFolderName, "index.js");
    const sourceModelAST = parse(readFile(sourceModelPath));
    const sourceModelClassDeclarationSubTree = sourceModelAST.program.body.filter(
        (subTree: any) => subTree.type === "ClassDeclaration" && subTree.id.name === sourceModelName
    )[0];
    const sourceModelRelationMappingsMethodDeclarationSubTree = sourceModelClassDeclarationSubTree.body.body.filter(
        (subTree: any) => subTree.type === "MethodDefinition" && subTree.key.name === "relationMappings"
    )[0];
    const sourceModelRelationMappingsReturnStatementSubTree = sourceModelRelationMappingsMethodDeclarationSubTree.value.body.body.filter(
        (subTree: any) => subTree.type === "ReturnStatement"
    )[0];

    sourceModelRelationMappingsReturnStatementSubTree.argument.properties.push(relationAST);
    writeFile(sourceModelPath, format(print(sourceModelAST).code, prettierConfig));

    // Add the target-to-source relation to the target model source code
    const reverseRelationAST = (() => {
        if (relation === RelationType.HAS_ONE) return generateASTForBelongsToOneRelation(target, source);
        else if (relation === RelationType.HAS_MANY) return generateASTForBelongsToOneRelation(target, source);
        else if (relation === RelationType.BELONGS_TO_ONE) return generateASTForHasManyRelation(target, source);
        else throw new Error("Invalid relation type");
    })();

    // Add the source-to-target relation to the source model source code
    const targetModelName = generateModelNameFrom(target);
    const targetModelPath = path.resolve(root, dbRoot, targetModelFolderName, "index.js");
    const targetModelAST = parse(readFile(targetModelPath));
    const targetModelClassDeclarationSubTree = targetModelAST.program.body.filter(
        (subTree: any) => subTree.type === "ClassDeclaration" && subTree.id.name === targetModelName
    )[0];
    const targetModelRelationMappingsMethodDeclarationSubTree = targetModelClassDeclarationSubTree.body.body.filter(
        (subTree: any) => subTree.type === "MethodDefinition" && subTree.key.name === "relationMappings"
    )[0];
    const targetModelRelationMappingsReturnStatementSubTree = targetModelRelationMappingsMethodDeclarationSubTree.value.body.body.filter(
        (subTree: any) => subTree.type === "ReturnStatement"
    )[0];

    targetModelRelationMappingsReturnStatementSubTree.argument.properties.push(reverseRelationAST);
    writeFile(targetModelPath, format(print(targetModelAST).code, prettierConfig));

    // Create migration file for the relation
    const sourceDatabaseTableName = generateDatabaseTableNameFrom(source);
    const targetDatabaseTableName = generateDatabaseTableNameFrom(target);
    const sourceLinksToTarget = [RelationType.HAS_ONE, RelationType.HAS_MANY].includes(relation);
    const migrationTemplatePath = path.resolve(__dirname, "../../templates/relation-migration.js.ejs");
    const migrationTemplateContent = renderTemplate(migrationTemplatePath, {
        sourceModelName: sourceLinksToTarget ? sourceModelName : targetModelName,
        targetModelName: sourceLinksToTarget ? targetModelName : sourceModelName,
        sourceDatabaseTableName: sourceLinksToTarget ? sourceDatabaseTableName : targetDatabaseTableName,
        targetDatabaseTableName: sourceLinksToTarget ? targetDatabaseTableName : sourceDatabaseTableName,
        targetDatabaseTableColumn: `${singular(generateDatabaseTableNameFrom(sourceLinksToTarget ? source : target))}_id`
    });
    const migrationFilePath = (() => {
        const timestamp = moment().format("YYYYMMDDHHmmssSSS");
        const table = sourceLinksToTarget ? targetDatabaseTableName : sourceDatabaseTableName;
        const column = `${singular(generateDatabaseTableNameFrom(sourceLinksToTarget ? source : target))}_id`;
        return path.resolve(root, migrationsRoot, `${timestamp}_add_${column}_to_${table}_table.js`);
    })();

    writeFile(migrationFilePath, format(migrationTemplateContent, prettierConfig));
    logSuccess(`Successfully linked ${sourceModelName} model to ${targetModelName} model!\n`);
};

const generateASTForHasOneRelation = (source: string, target: string) => {
    const relationSourceColumn = `${generateDatabaseTableNameFrom(source)}.id`;
    const relationTargetColumn = `${generateDatabaseTableNameFrom(target)}.${singular(generateDatabaseTableNameFrom(source))}_id`;

    return {
        type: "Property",
        method: false,
        shorthand: false,
        computed: false,
        key: { type: "Identifier", name: singular(generateDatabaseTableNameFrom(target)) },
        value: {
            type: "ObjectExpression",
            properties: [
                {
                    type: "Property",
                    method: false,
                    shorthand: false,
                    computed: false,
                    key: { type: "Identifier", name: "relation" },
                    value: {
                        type: "MemberExpression",
                        object: { type: "Identifier", name: "RootModel" },
                        property: { type: "Identifier", name: "HAS_ONE" },
                        computed: false
                    },
                    kind: "init"
                },
                {
                    type: "Property",
                    method: false,
                    shorthand: false,
                    computed: false,
                    key: { type: "Identifier", name: "from" },
                    value: { type: "Literal", value: relationSourceColumn, raw: `"${relationSourceColumn}"` },
                    kind: "init"
                },
                {
                    type: "Property",
                    method: false,
                    shorthand: false,
                    computed: false,
                    key: { type: "Identifier", name: "to" },
                    value: { type: "Literal", value: relationTargetColumn, raw: `"${relationTargetColumn}"` },
                    kind: "init"
                }
            ]
        },
        kind: "init"
    };
};

const generateASTForHasManyRelation = (source: string, target: string) => {
    const relationSourceColumn = `${generateDatabaseTableNameFrom(source)}.id`;
    const relationTargetColumn = `${generateDatabaseTableNameFrom(target)}.${singular(generateDatabaseTableNameFrom(source))}_id`;

    return {
        type: "Property",
        method: false,
        shorthand: false,
        computed: false,
        key: { type: "Identifier", name: generateDatabaseTableNameFrom(target) },
        value: {
            type: "ObjectExpression",
            properties: [
                {
                    type: "Property",
                    method: false,
                    shorthand: false,
                    computed: false,
                    key: { type: "Identifier", name: "relation" },
                    value: {
                        type: "MemberExpression",
                        object: { type: "Identifier", name: "RootModel" },
                        property: { type: "Identifier", name: "HAS_MANY" },
                        computed: false
                    },
                    kind: "init"
                },
                {
                    type: "Property",
                    method: false,
                    shorthand: false,
                    computed: false,
                    key: { type: "Identifier", name: "from" },
                    value: { type: "Literal", value: relationSourceColumn, raw: `"${relationSourceColumn}"` },
                    kind: "init"
                },
                {
                    type: "Property",
                    method: false,
                    shorthand: false,
                    computed: false,
                    key: { type: "Identifier", name: "to" },
                    value: { type: "Literal", value: relationTargetColumn, raw: `"${relationTargetColumn}"` },
                    kind: "init"
                }
            ]
        },
        kind: "init"
    };
};

const generateASTForBelongsToOneRelation = (source: string, target: string) => {
    const relationSourceColumn = `${generateDatabaseTableNameFrom(source)}.${singular(generateDatabaseTableNameFrom(target))}_id`;
    const relationTargetColumn = `${generateDatabaseTableNameFrom(target)}.id`;

    return {
        type: "Property",
        method: false,
        shorthand: false,
        computed: false,
        key: { type: "Identifier", name: singular(generateDatabaseTableNameFrom(target)) },
        value: {
            type: "ObjectExpression",
            properties: [
                {
                    type: "Property",
                    method: false,
                    shorthand: false,
                    computed: false,
                    key: { type: "Identifier", name: "relation" },
                    value: {
                        type: "MemberExpression",
                        object: { type: "Identifier", name: "RootModel" },
                        property: { type: "Identifier", name: "BELONGS_TO_ONE" },
                        computed: false
                    },
                    kind: "init"
                },
                {
                    type: "Property",
                    method: false,
                    shorthand: false,
                    computed: false,
                    key: { type: "Identifier", name: "from" },
                    value: { type: "Literal", value: relationSourceColumn, raw: `"${relationSourceColumn}"` },
                    kind: "init"
                },
                {
                    type: "Property",
                    method: false,
                    shorthand: false,
                    computed: false,
                    key: { type: "Identifier", name: "to" },
                    value: { type: "Literal", value: relationTargetColumn, raw: `"${relationTargetColumn}"` },
                    kind: "init"
                }
            ]
        },
        kind: "init"
    };
};
