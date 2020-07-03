# node-construct

![](https://img.shields.io/badge/node-12.16.1-green)
[![Codeship Status for kwameopareasiedu/node-construct](https://app.codeship.com/projects/dda11be0-9f85-0138-80da-5e64375207e7/status?branch=master)](https://app.codeship.com/projects/401769)

This is a tool that handles model creation within your Node project. When invoked, it'll create the
model file and a database helper file containing commonly used operations (create, read, update and 
delete). It can also link existing models using one of has-one, has-many and belongs-to-one 
relationships. Finally, it allows you to quickly setup multiple models using a mass-generate 
feature.

`node-construct` was created to automate a lot of the repetitive stuff involved in model management,
allowing you to focus more on creating your app and less of scaffolding your models.

Models created using this library are [Objection.js](https://vincit.github.io/objection.js/) models.
Migrations created are based on the [Knex.js](http://knexjs.org/) query builder.

## Install

This library is meant to be a global NPM module, so install using
```
npm i -g node-construct
```

## Usage

A comprehensive guide on how to use this library to speed up the creation of a simple API server 
using [Express.js](https://expressjs.com/) has been exists. 
[Click here to get started](docs/01-getting-started.md)

### Testing

Testing is carried out using the [Mocha test runner](https://mochajs.org/) and the 
[Chai assertion library](https://www.chaijs.com/). Tests are automatically run on Codeship before
deploying to the public.

To run the tests manually, follow these steps:

1.  Clone the project from [Github](https://github.com/kwameopareasiedu/node-construct)
2.  Run `npm install` to install the project dependencies
3.  Run `npm test`

During testing, generated files are stored in `/testing-area/` for your perusal

### Maintainers

-   [Kwame Opare Asiedu](https://github.com/kwameopareasiedu/)

### Support

If you'd like this library and would like to support the author, you can do so by becoming a 
patreon at [Patreon](https://www.patreon.com/kwameopareasiedu)

It would also be really helpful if you can star the project at 
[Github](https://github.com/kwameopareasiedu/node-construct)

### Changelog

[View changelog](CHANGELOG.md)