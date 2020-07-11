# Launch server and test

Congratulations on making it to the end. I trust you've seen how **node-construct** simplifies
management of your models to speed up your development.

In this section we'll finally launch our server and send some requests to it

### 1. Launch the server

If you are using a **Unix based OS (Linux, Mac)**, you can start the server by running:

```
export NODE_ENV=development && yarn start
```

If you are using **Windows**, you can start the server by running:

```
set NODE_ENV=development && yarn start
```

What this does is set `NODE_ENV` to _development_ before `yarn start` starts the server.
The server is configured to run on port **3000** by default and is accessbile at
[localhost:3000](localhost:3000)

That's it. You have a running server which can handle eleven (11) different requests.

### 2. Test the server

Now that our server is up and running, we can send requests to it.
To send requests, you can use `curl` command on Linux from the terminal. Windows users who don't
have `curl` installed can use [Postman](https://www.postman.com/) to send the requests
The requests we will use are listed in the table below:

| Description                                                                                                                 | Command                                                                                                              |
| --------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| Create a user called **John Doe** with a username of **johndoe**                                                            | `curl -X POST -d "name=John%20Doe" -d "username=johndoe" localhost:3000/users`                                       |
| Get all users                                                                                                               | `curl -X GET localhost:3000/users`                                                                                   |
| Get one user. Replace `<uuid>` with a uuid from the users list                                                              | `curl -X GET localhost:3000/users/<uuid>`                                                                            |
| Change **John Doe**'s name to **Gary Doe**. Replace `<uuid>` with **John Doe**'s uuid                                       | `curl -X PUT -d "name=Gary%20Doe" localhost:3000/users/<uuid>`                                                       |
| Delete **Gary Doe**. Replace `<uuid>` with **Gary Doe**'s uuid                                                              | `curl -X DELETE localhost:3000/users/<uuid>`                                                                         |
| Create a post titled **Node Construct** with content **An awesome library**. Replace `<id>` with a uuid from the posts list | `curl -X POST -d "title=Node%20Construct" -d "content=An%20awesome%20library" -d "userId=<id>" localhost:3000/posts` |
| Get all posts                                                                                                               | `curl -X GET localhost:3000/posts`                                                                                   |
| Get one post. Replace `<uuid>` with a uuid from the posts list                                                              | `curl -X GET localhost:3000/posts/<uuid>`                                                                            |
| Update **Node Construct**'s content to **Simply awesome**. Replace `<uuid>` with **Node Construct**'s uuid                  | `curl -X PUT -d "content=Simply%20awesome" localhost:3000/posts/<uuid>`                                              |
| Get all posts for user. Replace `<id>` with user's id                                                                       | `curl -X GET localhost:3000/posts/for-user/<id>`                                                                     |
| Delete **Node Construct**. Replace `<uuid>` with **Node Construct**'s uuid                                                  | `curl -X DELETE localhost:3000/posts/<uuid>`                                                                         |

---

<div>
    <a href="./07-setup-routes-for-post.md">Previous (Setup route handlers for the post model)</a>
</div>
