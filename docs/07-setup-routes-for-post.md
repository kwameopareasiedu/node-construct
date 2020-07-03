# Setup route handlers for the post model

Next, we'll setup the route handlers for the post model. This file does not exist so let's create
if at `./routes/posts.js`, then copy and paste the code below into the file

```js
const PostRouter = require("express").Router();
const Post = require("../db/post");

/* CREATE a post */
PostRouter.post("/", async (req, res) => {
    const { title, content, userId } = req.body;
    const post = await Post.create({ title, content, user_id: userId });
    return res.json({ message: "Post created successfully", data: post });
});

/* GET all posts */
PostRouter.get("/", async (req, res) => {
    const posts = await Post.fetchAll();
    return res.json({ data: posts });
});

/* GET one post */
PostRouter.get("/:uuid", async (req, res) => {
    const post = await Post.fetchByUuid(req.params.uuid);
    return res.json({ data: post });
});

/* UPDATE a post */
PostRouter.put("/:uuid", async (req, res) => {
    const { title, content } = req.body;
    const post = await Post.edit(req.params.uuid, { title, content });
    return res.json({ message: "Post updated successfully", data: post });
});

/* DELETE a post */
PostRouter.delete("/:uuid", async (req, res) => {
    const post = await Post.destroy(req.params.uuid);
    return res.json({ message: "Post deleted successfully" });
});

/* GET all posts for user */
PostRouter.get("/for-user/:id", async (req, res) => {
    const posts = await Post.fetchAll().where({ user_id: req.params.id });
    return res.json({ data: posts });
});

module.exports = PostRouter;
```

Next, we register the route hanlders defined here with the application. To do this, open `./app.js`
and on line **19**, add the following snippet:

```js
var postsRouter = require("./routes/posts");
app.use("/posts", postsRouter);
```

### What did we do here?

What we've done here is specify six (6) route handlers for different types of request. These are
listed below:

| URL                                  | Method | Description                                                                                          |
| ------------------------------------ | ------ | ---------------------------------------------------------------------------------------------------- |
| `localhost:3000/posts`               | POST   | Creates a post in the database. `title` and `content` must be present in the request body            |
| `localhost:3000/posts`               | GET    | Returns a list of all posts in the database.                                                         |
| `localhost:3000/posts/<uuid>`        | GET    | Returns the post whose `uuid` matches `<uuid>`                                                       |
| `localhost:3000/posts`               | PUT    | Updates the whose `uuid` matches `<uuid>`. `title` and `content` must be present in the request body |
| `localhost:3000/posts/<uuid>`        | DELETE | Deletes the post whose `uuid` matches `<uuid>`                                                       |
| `localhost:3000/posts/for-user/<id>` | GET    | Returns a list of all posts in the database for the user with id `<id>`.                             |

This registers the post route handlers with the Express.js application

---

<div>
    <a href="./06-setup-routes-for-user.md">Previous (Setup route handlers for the user model)</a>
    <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
    <a href="./08-launch-server-and-test.md">Next (Launch server and test)</a>
</div>
