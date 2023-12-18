# About Oregano

Hi! 👋 I'm [Tyler](https://tyler.robertson.click), a writer who (up until recently) had a problem with blogging: it was too much. 

Let me clarify: blogging platforms, like WordPress or Squarespace, had too many features, all trying to pull me in various directions that I had no interest in. This was annoying specifically because writing is my day job, and I wanted to keep my _for-fun_ writing as simple as possible. All I really wanted was a space to drop words off, and maybe link back to them on Twitter. 

In my mind, the ideal blogging platform only needed three features:

1. Write in [markdown](https://en.wikipedia.org/wiki/Markdown)
2. Get full control over my code and content
3. Post from anywhere (like your phone)

After a year of searching, nothing quite fit the bill, so I decided to make my own. 

I'm not a developer, but I'm pretty good at googling, and a few months later here we are: the tiny, simple, feature-less blogging I wanted this whole time. I've been using it [on my personal blog](https://tyler.robertson.click) for a while now, and it's worked out pretty well for me so far, so I'm sharing it with everyone!

Oregano is a "flat-file" blogging tool, meaning all of your pages and post exists as markdown files in easy-to-access folders on your site. No more futzing around with an interface that you're only using 2% of. If you want to post to your blog, pop a markdown file in `/posts`, and put more evergreen content in `/pages`. **That's it!**

It's powered by [Glitch](https://glitch.com), a simple tool for creating web apps. It uses [Express](https://expressjs.com) to receive and handle requests (like when someone wants to read a post), and [Showdown](http://showdownjs.com) and [Pug](https://pugjs.org) to make sure your content gets displayed correctly. 

All of the code powering Oregano is designed to be easily documented and as-minimal-as-possible, so there's plenty of room to play around and make it grow with you.

[Check out the Getting Started guide to try it out!](https://oregano-blog.glitch.me/getting-started)

If you have questions about Oregano or how it works, please reach out [on Twitter](https://twitter.com/oregano_blog)!