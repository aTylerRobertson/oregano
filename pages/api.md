# API

Using Oregano's [Express](https://expressjs.com/)-powered API, you can connect your blog to all sorts of third-party apps! Here are a couple that I've already set up for you:

* [Zapier](https://zapier.com/developer/public-invite/137247/5be4c8f7dcee709640d5e6b20187f953/)
* [Drafts](https://actions.getdrafts.com/a/1il)

Read on for more ways to customize your experience with the API!

## Check Auth

When connecting to apps like Zapier or IFTTT, you'll sometimes want to double-check that your credentials are correct, and that you're allowed to do what you're trying to do. To do that, you can send a request to `/auth` with your `key` in the query. 

Like this:

```
curl -X GET https://yourSiteURL.com/auth?key=super-secret-key
```

If the key matches what you set in your environment variables (`🔑.env` in Glitch), you'll get a `200` response, meaning you're good to go! If the key is wrong, you'll get a `401` error instead.

## Write Posts

If you (like me) want to be able to write new posts from basically anywhere, you can send markdown to your blog's `/write` endpoint with a POST request. In the request body, you'll need to provide a JSON object with your unique `key` and the `markdown` that you want to publish. 

Here's what that could look like as a `curl` command:

```
curl -X POST -H "Content-Type: application/json" -d '{"key":"super-secret-key", "markdown":"# Hello, world! \n This is some markdown that I'm trying to post to my blog. 👋"}' https://yourSiteURL.com/write
```

If your `key` is correct, the response will come back with a success and all of the formatting that Oregano automatically applies:

```
{
  "id": "hello-world",
  "htmlTitle": "<span id=\"helloworld\">Hello, world!</span>",
  "plainTitle": "Hello, world!",
  "markdown": "# Hello, world! \n This is some markdown that I'm trying to post to my blog. 👋",
  "html": "<p>This is some markdown that I'm trying to post to my blog. 👋</p>",
  "image": "https://cdn.glitch.com/fa7f085f-a13c-465a-a613-7c70a76e9ec6%2Foregano_logo.png?v=1623311902221",
  "modifiedDate": "2021-06-07T14:46:24.000Z",
  "prettyDate": "Monday, June 7, 2021"
}
```

If the `key` is incorrect, you'll receive a `401` error.

**Note:** If you create two posts with the same title, the second will overwrite the first, because Oregano will give them the same ID.

## Drafts and Hidden Posts

You can create drafts or hidden posts using the same method as the above, but sending requests to the `/draft` endpoint instead. For example:

```
curl -X POST -H "Content-Type: application/json" -d '{"key":"super-secret-key", "markdown":"# Hello, world! \n This is some markdown that I'm trying to post to my blog. 👋"}' https://yourSiteURL.com/draft
```

That creates a new markdown file in the `/hidden` folder, which you can reach by going to `https://your-site.com/hidden/post-title`.

## Update Posts

Sometimes, you may want to change a post's content or title, but keep the same filename. You could always log into Glitch and manually edit the file, but if you want to do it remotely you can send a PUT request to the `/update` endpoint. 

In it, you'll need to provide your `key`, the `id` of the post you want to edit, and the new `markdown` to set the post to. For example, if I want to update that "Hello, world!" post we made earlier:

```
curl -X PUT -H "Content-Type: application/json" -d '{"key":"super-secret-key", "id":"hello-world", "markdown":"# Hello again, world ! \n This post has been updated. ⚡️✨"}' https://yourSiteURL.com/update
```

The response will include Oregano's formatting for the new content, and update the post's modified date to the current time:

```
{
  "id": "hello-world",
  "htmlTitle": "<span id=\"helloagainworld\">Hello again, world!</span>",
  "plainTitle": "Hello again, world!",
  "markdown": "# Hello again, world ! \n This post has been updated. ⚡️✨",
  "html": "<p>This post has been updated. ⚡️✨</p>",
  "image": "https://cdn.glitch.com/fa7f085f-a13c-465a-a613-7c70a76e9ec6%2Foregano_logo.png?v=1623311902221",
  "modifiedDate": "2021-06-10T15:58:24.000Z",
  "prettyDate": "Thursday, June 10, 2021"
}
```

**Note:** Because this process changes the modified date, it will cause the post to appear at the top of your blog's index page. _However_, because it does not change the link or guid, RSS readers looking at your RSS feed may not pick it up as "new".

## Delete Posts

Post something embarrassing, or just want to clear out old content? Send a DELETE request with your `key` and the post's `id` to `/delete` remove it. To yeet that "Hello, world!" post into orbit:

```
curl -X DELETE -H "Content-Type: application/json" -d '{"key":"super-secret-key", "id":"hello-world"}' https://yourSiteURL.com/delete
```

If successful, the response you'll see is simply:

```
hello-world was deleted.
```

**⚠ WARNING:** Deleting posts is permanent, be careful!

## Search for Posts

If you need to find a specific post, you can always search for it by going to `/search` and providing a query with `q`. For example, you can search for a post called "hello world" here:

```
https://yourSiteURL.com/search?q=hello%20world
```

By default, Oregano will render a page with the results, sorted by how many times your search terms appear in the post. 

_But_, what if you want to use the results in another app? You can change the `format` of the results to JSON by adding that to the query:

```
https://yourSiteURL.com/search?q=hello%20world&format=json
```

That will return a JSON array containing information about each post that matches the search terms. If you'd like to limit the results, you can add a `limit` parameter:

```
https://yourSiteURL.com/search?q=hello%20world&format=json&limit=1
```

## List all Posts

Finally, what if you just want... _everything?_ Head to the aptly-named `/all` endpoint:

```
https://yourSiteURL.com/all
```

By default, Oregano will render HTML to display a list of all of your post titles, with links to each (like what would happen if your index page didn't paginate). If you want all of the posts as JSON instead, to use with other apps, you can specify the format:

```
https://yourSiteURL.com/all?format=json
```

That will return all of Oregano's formatted details for all of your posts in a handy JSON array! 

What's that? I forgot about RSS? Change the format again to get it! 

```
https://yourSiteURL.com/all?format=rss
```

The RSS is generated using the `RSS.pug` file in the `/views` folder.

## Have a question, or spot a bug?

Let me know [on Twitter](https://twitter.com/oregano_blog)!