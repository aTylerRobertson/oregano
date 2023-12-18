/*
  🌱 WELCOME TO OREGANO 🌱
  A tiny blogging system, designed to help you post from wherever you are. 

  Made by Tyler Robertson: https://tyler.robertson.click
  Using Glitch: https://glitch.com
  & Express: https://expressjs.com 
  & Pug: https://pugjs.org
  & Showdown: http://showdownjs.com

  💡 HOW IT WORKS 💡
  To get started, remix or clone this site, and adjust the SITE SETTINGS (below) to
  make it your own. You can also edit /pages/index.md to customize your home page,
  /css/style.css to change how the site looks, and the files in /views adjust how 
  content is rendered.

  To publish content in Oregano, write a markdown (.md) file, and place it in either 
  the "pages" or "posts" folder. 

  "Pages" are considered evergreen content, and can be linked to directly. 
  For example, if you write "about.md" and add it to the "pages" folder,
  you can link to it at https://yourSiteURL.com/about. 

  "Posts" are part of your blog, are listed on the index page, and can be linked to at 
  https://yourSiteURL.com/read/your-post. The first line of your post's content
  is considered its title, and is used to create that link. For example, if
  you write a post that starts, "hello, world 👋", it will be available at
  https://yourSiteURL.com/read/hello-world-👋
  
  ❓ HAVE QUESTIONS? ❓
  Reach out to @oregano_blog on Twitter!
*/

/* 
  ⚙️ SITE SETTINGS ⚙️

  Change the values below to make the site your own!
  
  Not shown here is the KEY value, which you'll need in order to integrate your blog 
  with third-party apps. Set that in your ENVIRONMENT VARIABLES. 
  In Glitch, you can get to ENVIRONMENT VARIABLES by selecting "🔑.env" in the sidebar!
  
  You'll also want to edit /pages/index.md, to personalize your home page.
*/ 

const site = {
  title: "Oregano", // Your site's title appears at the top of every page
  description: "Super simple blogging for writers who don't have the thyme. 🌱", // A brief description of your site, appears in search results
  url: "https://oregano-blog.glitch.me", // Your site's URL! This is important, because if it's wrong your links won't work!
  image: "https://cdn.glitch.com/e610c8b0-504c-4186-884d-4efe9a6e8b51%2Foregano_logo.png?v=1623236080041", // The default image to show in search results or on social media
  favicon: "https://cdn.glitch.com/e610c8b0-504c-4186-884d-4efe9a6e8b51%2Foregano_logo.png?v=1623236080041", //The tiny icon to show in your browser tab
  header: { Home: "/", About: "/about-oregano", "Getting Started": "/getting-started", API: "/api" }, // Links to show on your site's header, using the format {"Text": "URL"}
  footer: { "All posts": "/all", RSS: "/all?format=rss", Twitter: "https://twitter.com/oregano_blog", "🔍": "/search" }, // Links to show on your site's footer, using the format {"Text": "URL"}
  pagination: 10 // How many posts should we show on the index page at one time?
};

/*  
  ⚠️ REQUIRED STUFF ⚠️

  This is where we include the stuff that helps Oregano run:
    * FS lets us access the File System, so we can read and write posts
    * Express lets us listen for requests at the endpoints we define below
    * Showdown turns markdown into HTML
    * Pug helps us render HTML dynamically
    
  You probably won't want to change anything here, unless you know what you're doing.
*/

const fs = require("fs"),
  express = require("express"),
  showdown = require("showdown"),
  converter = new showdown.Converter(),
  app = express(),
  port = 3000;
app.use(express.json());
app.set("view engine", "pug");

/* 
  🔑 AUTHORIZATION 🔑

  Any time you want to connect your Oregano site to a third-party app, you can
  make a GET request to https://yourSiteURL.com/auth, and include a "key" value
  in the query. If that key matches the key that you set in ENVIRONMENT VARIABLES,
  then you're good to go! That means that your key is correct, and you can use the
  other functions listed below successfully. 
*/

app.get("/auth", (req, res) => {
  if (req.query.key == process.env.key) {
    console.log("✅ Connected successfully!");
    res.send({
      message: "✅ Connected successfully!",
      url: site.url
    });
  } else {
    console.log("🛑 Unauthorized connection attempt!");
    res.status(401);
  }
});

/*
  📚 ALL POSTS 📚
  
  Whether you want to scroll through all of your posts, get an RSS feed, or send
  posts to a third-party app, going to https://yourSiteURL.com/all is the place to start. 
  
  By default, it will render an HTML list of all of your posts. But, you can add a "format"
  value to the query, to change how the posts are displayed. 
  
  For RSS: https://yourSiteURL.com/all?format=rss
  For JSON: https://yourSiteURL.com/all?format=json
*/

app.get("/all", (req, res) => {
  const format = req.query.format;
  const posts = getAllPosts(); 
  if (format == "rss") {
    res.type("application/xml");
    res.render("rss", {
      posts: posts,
      site: site
    });
  } else if (format == "json") {
    res.type("application/json");
    res.send(posts);
  } else {
    res.render("list", {
      title: "All posts",
      htmlTitle: "All posts",
      image: site.image,
      posts: posts,
      site: site
    });
  }
});

/*
  🔍 SEARCH 🔍
  
  Want to find a specific post? Head to https://yourSiteURL.com/search
  
  By default, that will render an HTML page with a search bar and list of results. 
  If you want to return the results as JSON instead (such as for a third-party app), 
  you can specify "q" and "format" in the query. 
  
  For example, to return posts that contain "test" as JSON, use: 
  
  https://yourSiteURL.com/search?q=test&format=json
  
  To limit the number of results, you can add a "limit" value to the query.
  So to get only the top result for "test", use:
  
  https://yourSiteURL.com/search?q=test&format=json&limit=1
*/

app.get("/search", (req, res) => {
  const q = req.query.q,
    format = req.query.format,
    limit = req.query.limit;
  const pattern = new RegExp(q, "gi");
  var results = getAllPosts()
    .filter(post => {
      return post.markdown.search(pattern) > -1;
    })
    .sort((a, b) => {
      return (
        b.markdown.match(pattern).length - a.markdown.match(pattern).length
      );
    });
  if (typeof limit !== undefined) {
    results = results.slice(0, limit);
  }
  if (format == "json") {
    res.send(results);
  } else {
    res.render("search", {
      title: "Search",
      query: q,
      image: site.image,
      posts: results,
      site: site
    });
  }
});

/* 
  📖 READ 📖
  
  This is where your blog posts come from! 
  
  When you go to https://yourSiteURL.com/read/post-title, this code looks for a
  file in the "posts" folder called "post-title.md". If it exists, we render it
  in HTML. If it doesn't, you get redirected back to the index page. 
*/

app.get("/read/:post?", (req, res) => {
  const post = getFile("posts", req.params.post);
  if (!post) {
    res.redirect("/");
  }
  res.render("post", {
    title: post.plainTitle,
    htmlTitle: post.htmlTitle,
    html: post.html,
    meta: post.prettyDate,
    image: post.image,
    site: site
  });
});

/*
  🤫 HIDDEN 🤫
  
  Same as the above, but for private posts!
  Add markdown files to /hidden to draft up new posts, or make something
  private. Only people with the link can access the file at `/hidden/post-title`
*/

app.get("/hidden/:post?", (req, res) => {
  const post = getFile("hidden", req.params.post);
  if (!post) {
    res.redirect("/");
  }
  res.render("post", {
    title: post.plainTitle,
    htmlTitle: post.htmlTitle,
    html: post.html,
    meta: post.prettyDate,
    image: post.image,
    site: site,
    params: req.query
  });
});

/*
  📄 PAGES 📄
  
  Pages are considered "evergreen" content, and exist outside the regular blog. 
  For example, an "About Me" page would be a good thing to put in the "pages" folder. 
  
  When someone goes to https://yourSiteURL.com/page-title, this code looks for a 
  file in the "pages" folder called "page-title.md". If it exists, we render it 
  in HTML. Otherwise, you get redirected back to the index page.
*/

app.get("/:page", (req, res) => {
  const page = getFile("pages", req.params.page);
  if (!page) {
    res.redirect("/");
  }
  res.render("page", {
    title: page.plainTitle,
    htmlTitle: page.htmlTitle,
    html: page.html,
    image: page.image,
    site: site
  });
});

/*
  🏠 INDEX 🏠
  
  When you visit https://yourSiteURL.com, we render the "index.md" file in your "pages" folder.
*/

app.get("/", (req, res) => {
  var p = req.query.p ? parseInt(req.query.p) : 1;
  var index = getFile("pages", "index");
  const allPosts = getAllPosts();
  const posts = allPosts.slice(site.pagination*(p-1),(site.pagination*(p-1))+site.pagination);
  res.render("list", {
    title: index.plainTitle,
    htmlTitle: index.htmlTitle,
    html: index.html,
    image: index.image,
    posts: posts,
    current: p,
    all: allPosts.length,
    next: allPosts.length > (site.pagination*(p-1))+site.pagination ? p+1 : null,
    prev: p > 1 ? p-1 : null,
    site: site
  });
});

/*
  ✏️ WRITE ✏️
  
  While you can always publish posts by adding markdown files directly to the "posts" folder,
  you can also use third-party apps to send a POST request to https://yourSiteURL.com/write to 
  publish remotely!
  
  When you do that, you'll need to include your "key" and "markdown" in the request body. For example:

  {
    key: "super-secret-key",
    markdown: "# Hello, world 👋 \n This is a brand new post on my site!"
  }
  
  The "key" helps make sure you're authorized to publish here, and is set in your ENVIRONMENT VARIABLES.
  
  The "markdown" is the raw markdown content you want to post. The first line of that content is then
  used as the post's title and filename. If the first line doesn't include any discernable text 
  (for example, if it's an image), we'll use the current timestamp as the filename instead.
*/

app.post("/write", (req, res) => {
  const key = req.body.key,
        markdown = req.body.markdown;
  if (key == process.env.key) {
    var id = markdown.match(/(.*)\n?/)[0].replace(/[\#\!\?\[\]\&\.\,]/g, "").trim().replace(/\s/g, "-").toLowerCase();
    if (!id.match(/[^\!\?\s]/)) id = Date.now();
    fs.writeFile(`./posts/${id}.md`, markdown, (err) => {
      if (err) return console.log(err);
      res.send(getFile("posts", id));
    });
  } else {
    res.status(401);
  }
});

/*
  🤫 DRAFT 🤫
  
  Same as the above, but for drafts!
  Adds files to the /hidden folder
*/

app.post("/draft", (req, res) => {
  const key = req.body.key,
        markdown = req.body.markdown;
  if (key == process.env.key) {
    var id = markdown.match(/(.*)\n?/)[0].replace(/[\#\!\?\[\]\&\.\,]/g, "").trim().replace(/\s/g, "-").toLowerCase();
    if (!id.match(/[^\!\?\s]/)) id = Date.now();
    fs.writeFile(`./hidden/${id}.md`, markdown, (err) => {
      if (err) return console.log(err);
      res.send(getFile("hidden", id));
    });
  } else {
    res.status(401);
  }
});

/*
  📝 UPDATE 📝
  
  If you've already written a post, and want to update its content without changing its filename,
  you can send PUT a request to https://yourSiteURL.com/update
  
  In the request, you'll need to include your "key", "markdown", and the "id" of the post you want to
  update. For example, if you want to update "hello-world.md", you would send:

  {
    key: "super-secret-key",
    id: "hello-world",
    markdown: "# Oops! \n I forgot to edit this post!"
  }
*/

app.put("/update", (req, res) => {
  const key = req.body.key,
        id = req.body.id,
        markdown = req.body.markdown;
  if (key == process.env.key) {
    try {
      var currentMarkdown = fs.readFileSync(`./posts/${id}.md`, "utf8");
    } catch (err) {
      res.status(404);
    }
    fs.writeFile(`./posts/${id}.md`, markdown, (err) => {
      if (err) return console.log(err);
      res.send(getFile("posts", id));
    });
  } else {
    res.status(401);
  }
});

/*
  🗑 DELETE 🗑
  
  If you need to remove a post remotely, send a DELETE request to https://yourSiteURL.com/delete
  In the request body, you'll need to include your "key", and the "id" of the post you want to delete.
  For example, to delete the post "hello-world.md", you'd send:

  {
    key: "super-secret-key",
    id: "hello-world"
  }
*/

app.delete("/delete", (req, res) => {
  const key = req.body.key,
        id = req.body.id;
  if(key == process.env.key){
    try {
      var file = fs.readFileSync(`./posts/${id}.md`, "utf8");
    } catch (err) {
      res.status(404);
    }
    fs.unlinkSync(`./posts/${id}.md`);
    res.send({
      message: `${id} was deleted`
    });
  } else {
    req.status(401);
  }
});

/*
  🤗 HELPER FUNCTIONS 🤗
  
  The functions below help the endpoints above run, and are referenced quite a bit 
  in the code you just scrolled past. If you want to make changes to things like 
  how markdown is coverted into HTML, this is where to look!
*/

/*
  ♾ GET ALL POSTS ♾
  
  This function looks at *all* of the files in the "posts" folder, and returns 
  them as an array of objects, sorted by their modified date.
  
  The objects include values like the filename ("id"), the original markdown, 
  the post's title, and the converted HTML.
*/

const getAllPosts = () => {
  const posts = fs
    .readdirSync(`./posts`)
    .filter(file => {
      return file.toLowerCase().match(/\.md$/);
    })
    .map(file => {
      const markdown = fs.readFileSync(`./posts/${file}`, "utf8");
      const title = markdown.match(/(.*)\n?/)[0];
      return {
        id: file.split(".")[0],
        markdown: markdown,
        html: converter.makeHtml(markdown.replace(title, "")),
        image: markdown.match(/\!\[.*\]\((.*)\)/)
          ? markdown.match(/\!\[.*\]\((.*)\)/)[1]
          : site.image,
        htmlTitle: converter.makeHtml(title).replace(/[Hh]\d/g, "span"),
        plainTitle: converter.makeHtml(title).replace(/(<([^>]+)>)/gi, ""),
        modifiedDate: fs.statSync(`./posts/${file}`).mtime,
        prettyDate: fs.statSync(`./posts/${file}`).mtime.toLocaleDateString("en-GB",{weekday:"long",year:"numeric",month:"long",day:"numeric"})
      };
    })
    .sort((a, b) => {
      return b.modifiedDate - a.modifiedDate;
    });
  return posts;
};

/*
  1️⃣ GET ONE FILE 1️⃣
  
  This function is used when we need just one page or post to display. It returns a JSON 
  object containing all of the stuff we might need to render that file for the reader.
  
  If the file can't be found, it returns FALSE, which tells us to kick the user back 
  to the index page.
*/

const getFile = (folder, id) => {
  var markdown = "";
  try {
    markdown = fs.readFileSync(`./${folder}/${id}.md`, "utf8");
  } catch (err) {
    return false;
  }
  const title = markdown.match(/(.*)\n?/)[0];
  return {
    id: id,
    htmlTitle: converter.makeHtml(title).replace(/[Hh]\d/g, "span"), 
    plainTitle: converter.makeHtml(title).replace(/(<([^>]+)>)/gi, ""),
    markdown: markdown,
    html: converter.makeHtml(markdown.replace(title, "")),
    image: markdown.match(/\!\[.*\]\((.*)\)/)
      ? markdown.match(/\!\[.*\]\((.*)\)/)[1]
      : site.image,
    modifiedDate: fs.statSync(`./${folder}/${id}.md`).mtime,
    prettyDate: fs.statSync(`./${folder}/${id}.md`).mtime.toLocaleDateString("en-GB", {weekday:"long",year:"numeric",month:"long",day:"numeric"})
  };
};

/*
 🧚‍ HEY, LISTEN 🧚‍♂️
 
 This starts the listening process, so that your site can receive the requests we defined above!
*/

app.listen(port, () => {
  console.log(`Listening at port ${port}`);
});

/*
  ❤️ THANK YOU ❤️
  
  Thanks for trying out Oregano, and reading down this far! If you have questions,
  comments, gripes, or complaints about Oregano, please feel free to reach out on
  Twitter any time at @aTylerRobertson
  
  Have a great day! 👋
*/