# Setup your project

In this section, you'll setup an Express.js project that will be our server

### 1. Create a test database

We'll be using PostgreSQL in this guide, but MySQL can also be used. Please follow your database
client software to create a new database. Leave it empty as we'll be using the migrations to create
the tables and columns

### 2. Install Express.js

If your version of NodeJS is higher than **8.1.0**, you can install Express.js by running
`npx express-generator`. For lower versions of NodeJS (or if you don't want to install `npx` first),
install Express.js with `npm install -g express-generator`.

For more information on the express generator, visit the
[getting started guide](https://expressjs.com/en/starter/generator.html) with Express.js

### 3. Create the project folder

Open a terminal and `cd` to the location you want to create the project and run
`express --no-view <project-name>`. Substitute **<project-name>** with your desired name

### 4. Install dependencies

After your project folder has been created, `cd` into it and run `npm install` to install
all dependencies.

> **_FROM THIS POINT ONWARD, ALL TERMINAL COMMANDS ARE EXECUTED AT THE ROOT OF THE PROJECT_**

### 5. Install database driver

Afterwards, you need to install a database driver to communicate with your database server. If you
are using PostgreSQL, run `npm install --save pg`. If you are using MySQL, run
`npm install --save mysql`

For more database driver installation commands, visit the
[Knex.js installation guide](http://knexjs.org/#Installation)

---

<div>
    <a href="./01-getting-started.md">Home</a>
    <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
    <a href="./03-initialize-knex.md">Next (Initialize Knex.js)</a>
</div>
