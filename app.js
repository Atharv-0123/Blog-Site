//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const homeStartingContent = `
Welcome to my blog! I'm Atharva, and I'm excited to share my thoughts, experiences, and insights with you. This blog is a platform where I'll be writing about topics that inspire me, whether it's technology, travel, personal development, or anything in between.

I believe that life is an adventure, and each day is an opportunity to learn and grow. Through my blog posts, I aim to provide valuable information, entertain you with engaging stories, and hopefully spark some thought-provoking conversations.

When I'm not writing, you can find me exploring new places, experimenting with new technologies, or diving into a captivating book. I'm a firm believer in continuous learning and strive to stay curious about the world around me.

Thank you for joining me on this journey. Feel free to explore my posts. Let's embark on this blogging adventure together!

Happy reading,
Atharva
`;
const aboutContent = `
Welcome to my blog! I'm Atharva, and I'm excited to share my thoughts, experiences, and insights with you. This blog is a platform where I'll be writing about topics that inspire me, whether it's technology, travel, personal development, or anything in between.

I believe that life is an adventure, and each day is an opportunity to learn and grow. Through my blog posts, I aim to provide valuable information, entertain you with engaging stories, and hopefully spark some thought-provoking conversations.

When I'm not writing, you can find me exploring new places, experimenting with new technologies, or diving into a captivating book. I'm a firm believer in continuous learning and strive to stay curious about the world around me.

Thank you for joining me on this journey. Feel free to explore my posts. Let's embark on this blogging adventure together!

Happy reading,
Atharva
`;

const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/blogdb", {useNewUrlParser: true});

const postSchema = {
  title: String,
  content: String
};

const Post = mongoose.model("Post", postSchema);

app.get("/", function(req, res){

  Post.find({}, function(err, posts){
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
      });
  });
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });


  post.save(function(err){
    if (!err){
        res.redirect("/");
    }
  });
});

app.get("/posts/:postId", function(req, res){

const requestedPostId = req.params.postId;

  Post.findOne({_id: requestedPostId}, function(err, post){
    res.render("post", {
      title: post.title,
      content: post.content
    });
  });

});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

app.get("/posts", function(req, res){
  Post.find({})
    .then(function(posts){
      res.render("posts", { posts: posts });
    })
    .catch(function(err){
      console.log(err);
    });
});

app.get("/view_post/:postId", function(req, res){
  const requestedPostId = req.params.postId;

  Post.findOne({_id: requestedPostId})
    .then(function(post){
      if(post){
        res.render("view_post", {
          post: post
        });
      } else {
        res.render("view_post", {
          post: null // Handle the case where post is not found
        });
      }
    })
    .catch(function(err){
      console.log(err);
    });
});


// Edit Post Route
app.post("/edit/:postId", function(req, res){
  const requestedPostId = req.params.postId;
  const updatedTitle = req.body.postTitle;
  const updatedContent = req.body.postBody;
  
  // Use Mongoose's findByIdAndUpdate function to update the post
  Post.findByIdAndUpdate(requestedPostId, { title: updatedTitle, content: updatedContent }, function(err){
    if(err){
      console.log(err);
    } else {
      res.redirect("/posts");
    }
  });
});



// Delete Post Route
app.get("/delete/:postId", function(req, res){
  const requestedPostId = req.params.postId;

  Post.findByIdAndDelete(requestedPostId, function(err){
    if(err){
      console.log(err);
    } else {
      console.log("Post successfully deleted.");
      res.redirect("/posts");
    }
  });
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
