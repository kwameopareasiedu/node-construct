# Finalize models

To finish our model setup, we need to specify what columns they should have.

### User models

For users, we'll add a name and a unique username. Open the
`./migrations/YYYYMMDDHHmmssSSS_create_users_table.js` file and replace its content with:

```js
exports.up = function (knex) {
    return knex.schema.createTable("users", table => {
        table.increments();
        table.string("uuid").notNullable().unique();
        table.string("name");
        table.string("username").unique().notNullable();
        table.timestamps(true, true);
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable("users");
};
```

The `exports.up` is executed when migrations are being run. In it we have specified the following
coumns for the `users` table:

-   `id` - Numeric incrementing id (Created by `table.increments()`)
-   `uuid` - Unique string uuid for the column
-   `name` - Nullable name string
-   `username` - Non-nullable unique name string
-   `created_at` - Created at timestamp (Created by `table.timestamps(true, true)`)
-   `updated_at` - Updated at timestamp (Created by `table.timestamps(true, true)`)

### Post models

Just as we did for the user, we'll do for the post. Post will contain the unique title string and
content text. Open the `./migrations/YYYYMMDDHHmmssSSS_create_posts_table.js` file and replace its
content with:

```js
exports.up = function (knex) {
    return knex.schema.createTable("posts", table => {
        table.increments();
        table.string("uuid").notNullable().unique();
        table.string("title").unique();
        table.text("content");
        table.timestamps(true, true);
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable("posts");
};
```

### Run migrations on the database

Once all our migrations have been written and verified, we can now run it on our database. Make
sure you `knexfile.js` has been setup properly. Refer to the section on
[initializing knex](docs/03-initialize-knex.md)

Run the migrations with `knex migrate:latest`. Verify in your database that the fields specified
have indeed been created.

<div>
    <a href="./04-initialize-node-construct.md">Previous (Initialize node-construct)</a>
    <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
    <a href="./06-setup-routes-for-user.md">Next (Setup route handlers for the user model)</a>
</div>
