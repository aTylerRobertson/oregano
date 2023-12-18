# Getting started

Welcome to Oregano! If [you didn't already know](/about), it's a tiny [Glitch](https://glitch.com) app designed to help you start blogging with as few frills as possible. I'm glad you're here!

To start blogging with Oregano, you'll want a [Glitch](https://glitch.com) account. 

That will let you **remix** this app to create a new copy of it on your account, and start your new blog!

<center><h2>
  [🌱 Click to Remix! 🌱](https://glitch.com/edit/#!/remix/oregano-blog)
  </h2></center>
  
<iframe width="560" height="315" src="https://www.youtube.com/embed/5XDg0h4vks4" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## Opening the box

When you remix Oregano, you'll be automatically given a new project name by Glitch, but you can change it or [connect your custom domain](https://glitch.happyfox.com/kb/article/9-how-do-i-add-a-custom-domain-a-cname-or-a-record-for-my-custom-domain/). 

When you remix the app, you'll have access to these features right off the bat:

* A blog that's automatically populated by any markdown files you add to the `posts/` folder
* Customizable  pages, including an [index](/), [search](/search), a list of [all](/all) posts, and any markdown file you add to the `pages/` folder
* A built-in RSS feed at `https://yourSiteURL.com/all?format=rss`
* Easy-to edit settings in `oregano.js` and styling at `css/style.css`
* [A full-featured API](/api) that lets you read, write, update, and delete posts remotely

And it's all yours to hack and play with however you want!

## Making it your own

When you're logged in and editing your new copy of Oregano, the first thing you'll want to do is head to `oregano.js` and edit the `site` settings. There, you can adjust each of the following:

* **title**: The primary title of your site -- Appears on every page, and in the browser tab
* **description**: A brief description of your site, used for search results and some social sharing
* **url**: Your site's primary URL (ex.: "https://YourSite.com")
* **image**: The default image for your site, primarily used on social media
* **favicon**: The icon that appears in the browser tab
* **header**: Links to display in your site's header, beneath the title. Uses this format: `{"Link 1":"URL 1","Link 2":"URL 2"}`
* **footer**: Links to display in your site's footer. Uses the same format as header.
* **pagination**: How many posts should appear on the index page at one time?

Then, you can start adding new Markdown files to your `pages/` and `posts/` folders, and Oregano will start publishing them right away! (I recommend starting with `/pages/index.md` to customize your home page.)

You can also poke around in `css/` where a single CSS file changes how the site looks, and `views/`, where [Pug](https://pugjs.org) files inform the site's layout.

## Writing anything from anywhere

While [Glitch](https://glitch.com)'s built-in editor is great, I've added a suite of API features to help you create new posts from wherever you're doing your best writing. 

To learn more, [check out the API docs](/api)!

## Building more than a blog

If you want to add more evergreen content to your site that doesn't quite fit in your blog, you can add markdown files to the `pages/` folder. You can then access those pages by entering your site's URL, followed by their filename. 

For example, this page is `getting-started.md`, and can be found at [https://oregano-blog.glitch.me/getting-started](https://oregano-blog.glitch.me/getting-started).

## What if I find a bug, or have a question?

This is a "for fun" project, so it may take a bit for me to get around to bugs or feature requests.

But, if you run into any trouble or have questions, please feel free to [reach out on Twitter](https://twitter.com/oregano_blog). I'm always happy to chat! 👋