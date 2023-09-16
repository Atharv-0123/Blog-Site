//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require('mongoose')

const homeStartingContent = `
Welcome to my blog! I'm Atharva, and I'm excited to share my thoughts, experiences, and insights with you. This blog is a platform where I'll be writing about topics that inspire me, whether it's technology, travel, personal development, or anything in between.

I believe that life is an adventure, and each day is an opportunity to learn and grow. Through my blog posts, I aim to provide valuable information, entertain you with engaging stories, and hopefully spark some thought-provoking conversations.

When I'm not writing, you can find me exploring new places, experimenting with new technologies, or diving into a captivating book. I'm a firm believer in continuous learning and strive to stay curious about the world around me.

Thank you for joining me on this journey. Feel free to explore my posts. Let's embark on this blogging adventure together!

Happy reading,
Atharva
`;
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/blogdb")

const postSchema = {
  title: String,
  content: String
}

const Post = mongoose.model("Post",postSchema)


app.get("/", function(req, res){
  Post.find({},function(err, posts){
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
      });
  }) 
});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

app.get("/compose", function(req, res){
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody 
  });
  post.save()
  res.render("compose");
});

app.post("/compose", function(req, res){
  const post = {
    title: req.body.postTitle,
    content: req.body.postBody
  };

  posts.push(post);

  res.redirect("/");

});

app.get("/posts/:postName", function(req, res){
  const requestedTitle = _.lowerCase(req.params.postName);

  posts.forEach(function(post){
    const storedTitle = _.lowerCase(post.title);

    if (storedTitle === requestedTitle) {
      res.render("post", {
        title: post.title,
        content: post.content
      });
    }
  });

});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
