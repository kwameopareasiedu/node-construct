[Home](README.md)

# Changelog

-   `1.0.0`

    -   Public release of stable API

-   `0.1.0`

    -   Added [core](src/core) files containing utility functions used by the features
    -   Added the [init](src/features/init.ts) feature. This creates the `model-definitions.js` at
        the project root
    -   Added the [generate](src/features/generate.ts) feature. This creates the model file, the
        database helper file and the migration file for a given model name
    -   Added the [link](src/features/link.ts) feature. This modifies model file source codes to
        insert relationships between models. It also creates the migrations to commit changes to
        the database
    -   Added the [setup](src/features/setup.ts) feature. This processes the `model-definitions.js`
        file at the project root and uses the [generate](src/features/generate.ts) and
        [link](src/features/link.ts) features to create all models and relations specified in the
        file
    -   Added tests for all [core](src/core) and [feature](src/features) files
