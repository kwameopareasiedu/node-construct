# Initialize Knex.js

[Knex.js](https://knexjs.org) is the library that translates our model actions (create, read,
update, delete) into queries we can run on a database. We use Knex because we can write plain
JavaScript for all database vendors without writing vendor-specific SQL

### 1. Install Knex.js

To install Knex.js and initialize knex, run `npm install --save knex && knex init`. This installs
knex into your project and creates a `knexfile.js` at the root of your project

### 2. Configure knex

Open the `knexfile.js` and replace the content of the file with the following:

```js
module.exports = {
    development: {
        client: "pg",
        connection: "postgresql://USERNAME:PASSWORD@localhost:5432/DATABASE_NAME",
        migrations: { directory: "./migrations" }
    }
};
```

The snippet above instructs knex to do a number of things:

1. Use `pg` **client** when to communicate with the database Replace with `mysql` or the relevant
   database driver installed in the [previous step](02-setup-project.md#5-install-database-driver)
2. Connect to the database using the **connection** string. Replace `USERNAME`, `PASSWORD` and
   `DATABASE_NAME` with your credentials for your local database created in the
   [previous step](02-setup-project.md#1-create-a-test-database)
3. Store created migration files in the `./migrations` folder

---

<div>
    <a href="./02-setup-project.md">Previous (Setup your project)</a>
    <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
    <a href="./04-initialize-node-construct.md">Next (Initialize node-construct)</a>
</div>
