import { generate } from "./generate";
import { link, RelationType } from "./link";

const validRelations = ["HAS_ONE", "HAS_MANY", "BELONGS_TO_ONE"];

/** Processes the model-definitions.js file at the project root and creates the specified models with their relations */
export const setup = async (root: string, dbRoot: string, migrationsRoot: string, relations: Array<string>, noChecks = false): Promise<void> => {
    // Retrieve models from relations. A relation is of the form <SOURCE RELATION_TYPE TARGET> or <SOURCE RELATION_TYPE [TARGET_1, TARGET_1, ..., TARGET_N]>
    const relationGraph: Array<[string, string, string]> = [];

    const modelNamesHaveCircularDependency = (source: string, target: string): boolean =>
        relationGraph.filter(([s, t]) => s === target && t === source).length > 0;

    const modelNames: Array<string> = relations.reduce((names, relation) => {
        const components = relation.split(/[ |[|\]|,]/g);

        const source = (components[0] || "").trim();
        if (!source) throw new Error(`No source model found in "${relation}" relation`);

        const relationType = (components[1] || "").trim();
        if (!relationType) throw new Error(`No relation type found in "${relation}" relation`);
        if (!validRelations.includes(relationType)) throw new Error(`Invalid relation type. Valid values are: ${validRelations.join(", ")}`);

        const targets = components
            .slice(2)
            .map(c => c.trim())
            .filter(c => !!c);
        if (!targets || targets.length == 0) throw new Error(`No target model(s) found in "${relation}" relation`);

        if (!names.includes(source)) names.push(source);

        for (const target of targets) {
            // Warn when a circular dependency is found between the source and any of its targets, unless the check is skipped (I.e. noChecks = true).
            // A circular dependency is formed when a model depends on another, which also depends on the model
            if (!noChecks) {
                if (modelNamesHaveCircularDependency(source, target)) {
                    const msg1 = `Circular dependency detected between "${source}" and "${target}". (I.e. "${source}" depends on "${target}" and vice-versa). `;
                    const msg2 = `If this is desired, run this command with --no-checks or -n`;
                    throw new Error(msg1 + msg2);
                } else relationGraph.push([source, target, relationType]);
            } else relationGraph.push([source, target, relationType]);

            if (!names.includes(target)) names.push(target);
        }

        return [...names];
    }, []);

    // Generate the models for each model name
    for (const modelName of modelNames) await generate(root, dbRoot, migrationsRoot, modelName);

    // Link the models based on the relation graph
    for (const [source, target, _relationType] of relationGraph) {
        const relationType: RelationType = (() => {
            if (_relationType === "HAS_ONE") return RelationType.HAS_ONE;
            if (_relationType === "HAS_MANY") return RelationType.HAS_MANY;
            if (_relationType === "BELONGS_TO_ONE") return RelationType.BELONGS_TO_ONE;
        })();

        await link(root, dbRoot, migrationsRoot, source, target, relationType);
    }
};
