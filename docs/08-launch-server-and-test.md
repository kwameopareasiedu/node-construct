# Launch server and test

Congratulations on making it to the end. I trust you've seen how node-construct simplifies
management of your models to speed up your development.

In this section we'll finally launch our server and send some requests to it

### Launch server

If you are using a Unix based OS (Linux, Mac), you can start the server by running:

```
export NODE_ENV=development
npm start
```

If you are using Windows, you can start the server by running:

```
set NODE_ENV=development
npm start
```

What these do is set `NODE_ENV` to development before `npm start` starts the server.
The server is configured to run on port **3000** by default.

That's it. You have a running server which can handle eleven (11) different requests.

### Test server

Now that our server is up and running, we can send requests to it.
To send requests, you can use `curl` command on Linux from the terminal. Windows users who don't
have `curl` installed can use [Postman](https://www.postman.com/) to send the requests
The requests we will use are listed in the table below:

| Description                                                                                                                 | Command                                                                                                              |
| --------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| Create a user with name, "John Doe" and username, "johndoe"                                                                 | `curl -X POST -d "name=John%20Doe" -d "username=johndoe" localhost=3000/users`                                       |
| Get all users                                                                                                               | `curl -X GET localhost=3000/users`                                                                                   |
| Get one users. Replace `<uuid>` with a uuid from the users list                                                             | `curl -X GET localhost=3000/users/<uuid>`                                                                            |
| Update user "John Doe" to "Gary Doe". Replace `<uuid>` with John's uuid                                                     | `curl -X PUT -d "name=Gary%20Doe" localhost=3000/users/<uuid>`                                                       |
| Delete user "Gary Doe". Replace `<uuid>` with Gary's uuid                                                                   | `curl -X DELETE localhost=3000/users/<uuid>`                                                                         |
| Create a post with title, "Node Construct" and content, "An awesome library".Replace `<id>` with a uuid from the posts list | `curl -X POST -d "title=Node%20Construct" -d "content=An%20awesome%20library" -d "userId=<id>" localhost=3000/posts` |
| Get all posts                                                                                                               | `curl -X GET localhost=3000/posts`                                                                                   |
| Get one posts. Replace `<uuid>` with a uuid from the posts list                                                             | `curl -X GET localhost=3000/posts/<uuid>`                                                                            |
| Update post "Node Construct" content to "Simply awesome". Replace `<uuid>` with "Node Construct"'s uuid                     | `curl -X PUT -d "content=Simply%20awesome" localhost=3000/posts/<uuid>`                                              |
| Get all posts for user. Replace `<id>` with user's id                                                                       | `curl -X GET localhost=3000/posts/for-user/<id>`                                                                     |
| Delete post "Node Construct". Replace `<uuid>` with "Node Construct"'s uuid                                                 | `curl -X DELETE localhost=3000/posts/<uuid>`                                                                         |

<div>
    <a href="./07-setup-routes-for-post.md">Previous (Setup route handlers for the post model)</a>
</div>
