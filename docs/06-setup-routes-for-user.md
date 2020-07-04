# Setup route handlers for the user model

Now that we've taken care of database level stuff, we move higher to specify our route handlers.
A route handler is a function that process a request that reaches the server. We'll setup the route
handlers for the user model

Open the `./routes/users.js` file and replace its content with:

```js
const UserRouter = require("express").Router();
const User = require("../db/user");

/* CREATE a user */
UserRouter.post("/", async (req, res) => {
    const { name, username } = req.body;
    const user = await User.create({ name, username });
    return res.json({ message: "User created successfully", data: user });
});

/* GET all users */
UserRouter.get("/", async (req, res) => {
    const users = await User.fetchAll();
    return res.json({ data: users });
});

/* GET one user */
UserRouter.get("/:uuid", async (req, res) => {
    const user = await User.fetchByUuid(req.params.uuid);
    return res.json({ data: user });
});

/* UPDATE a user */
UserRouter.put("/:uuid", async (req, res) => {
    const { name, username } = req.body;
    const user = await User.edit(req.params.uuid, { name, username });
    return res.json({ message: "User updated successfully", data: user });
});

/* DELETE a user */
UserRouter.delete("/:uuid", async (req, res) => {
    const user = await User.destroy(req.params.uuid);
    return res.json({ message: "User deleted successfully" });
});

module.exports = UserRouter;
```

### What did we do here?

What we've done here is specify five (5) route handlers for different types of request. These are
listed below:

| URL                           | Method | Description                                                                                          |
| ----------------------------- | ------ | ---------------------------------------------------------------------------------------------------- |
| `localhost:3000/users`        | POST   | Creates a user in the database. `name` and `username` must be present in the request body            |
| `localhost:3000/users`        | GET    | Returns a list of all users in the database.                                                         |
| `localhost:3000/users/<uuid>` | GET    | Returns the user whose `uuid` matches `<uuid>`                                                       |
| `localhost:3000/users`        | PUT    | Updates the whose `uuid` matches `<uuid>`. `name` and `username` must be present in the request body |
| `localhost:3000/users/<uuid>` | DELETE | Deletes the user whose `uuid` matches `<uuid>`                                                       |

---

<div>
    <a href="./05-finalize-models.md">Previous (Finalize models)</a>
    <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
    <a href="./07-setup-routes-for-post.md">Next (Setup route handlers for the post model)</a>
</div>
