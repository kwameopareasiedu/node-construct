# Initialize node-construct

### 1. Install node-construct

To install initialize node-construct, run `yarn global add node-construct && node-construct init` or
`npm install -g node-construct && node-construct init`. This installs node-construct as a global
dependency and creates a `model-definitions.js` at the root of your project

### 2. Configure node-construct

Open the `model-definitions.js` and replace the content of the file with the following:

```js
module.exports = {
    dbRoot: "db",
    migrationsRoot: "migrations",
    relations: ["User HAS_MANY Post"]
};
```

The snippet above instructs node-construct to do a number of things:

1. Use `./db` as the database service root directory. This is where all model folders will be
   created
2. Use `./migrations` as the root of generated migration files. **This should be set to the
   same directory as that of Knex.js**
3. Create two models **User** and **Post** and create a relationship between them where a user
   **can have** many posts. When building the files, node-construct will infer that a post
   therefore **belongs to** a user

### 3. Setup the models using the `model-definitions.js`

When your `model-definitions.js` file is configured, run `node-construct setup` to process the
setup the models with the specified relationships and migration files (A migration file is a file
with code to modify the database in some way)

After this command is executed, you should see the newly created `./db` and `./migrations` folders.
You should see the following file paths created:

-   `./db`
-   `./db/index.js` - Database helpers export
-   `./db/cofig.js` - Configuration for the Objection.js ORM
-   `./db/root.js` - Root model which all other models inherit. Common model operations should reside here
-   `./db/user/index.js` - Model file for User
-   `./db/user/crud.js` - Database helper functions for the User model
-   `./db/post/index.js` - Model file for Post
-   `./db/post/crud.js` - Database helper functions for the Post model
-   `./migrations/YYYYMMDDHHmmssSSS_create_users_table.js` - Migration to create the 'users' table
-   `./migrations/YYYYMMDDHHmmssSSS_create_posts_table.js` - Migration to create the 'posts' table
-   `./migrations/YYYYMMDDHHmmssSSS_add_user_id_to_posts_table.js` - Migration to add the 'user_id' foreign key column to the 'posts' table

The `YYYYMMDDHHmmssSSS` is a timestamp placeholder for when the file was created.

-   `YYYY` - Year
-   `MM` - Month
-   `DD` - Day
-   `HH` - 24-Hour
-   `mm` - Minute
-   `ss` - Second
-   `SSS` - Millisecond

---

<div>
    <a href="./03-initialize-knex.md">Previous (Initialize Knex.js)</a>
    <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
    <a href="./05-finalize-models.md">Next (Finalize models)</a>
</div>
