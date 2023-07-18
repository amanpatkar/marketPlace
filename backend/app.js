const express = require('express');

const bodyParser = require('body-parser');
const mongoose = require('mongoose')
const Post = require('./models/post')
const app = express();
const cors = require('cors');
app.use(cors());

mongoose.set('strict', false);
mongoose.connect("mongodb://127.0.0.1:27017/marketPlace", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to the database!');
  })
  .catch((err) => {
    console.error('Failed to connect:', err);
  });
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}))
app.use((req,res,next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    res.setHeader("Access-Control-Allow-Method","GET,POST,PATCH,DELETE,OPTIONS,PUT")
    next();
})


// OPTIONS route handler
app.options('/api/posts/:id', (req, res) => {
    res.setHeader('Access-Control-Allow-Methods', 'DELETE');
    res.setHeader('Access-Control-Allow-Methods', 'PUT');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Max-Age', '86400'); // 24 hours
    res.sendStatus(200);
  });

  app.get('/api/posts/:id', (req, res, next) => {
    // Handle the GET request for retrieving a specific post by ID
    const postId = req.params.id;

    Post.findById(postId)
      .then((todo) => {
        if (todo) {
          res.json(todo);
        } else {
          res.status(404).json({ error: 'Todo not found' });
        }
      })
      .catch((error) => {
        res.status(500).json({ error: 'Error retrieving todo' });
      });
  
});

app.post("/api/posts",(req,res,next) =>{
    const post = new Post({
        title:req.body.title,
        content:req.body.content
    });
    post.save();
    console.log(post);
    res.status(201).json({
        message:"post send successfully!"
    });
})
// Get All Posts
app.get('/api/posts',(req, res, next) => {
    Post.find().then(document =>{
        res.status(200).json({
            message:'Post fetch  successfully!',
            data: document,
            status:200
        })
    })
   
})
// Get a specific todo
app.get('/api/todos/:id', (req, res) => {
    const { id } = req.params;
  
    Post.findById(id)
      .then((todo) => {
        if (todo) {
          res.json(todo);
        } else {
          res.status(404).json({ error: 'Todo not found' });
        }
      })
      .catch((error) => {
        res.status(500).json({ error: 'Error retrieving todo' });
      });
  });
  // Update a todo
app.put('/api/posts/:id', (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body;
  
    Post.findByIdAndUpdate(id, { title, content })
      .then((todo) => {
        if (todo) {
          res.json({ message: 'Todo updated successfully' });
        } else {
          res.status(404).json({ error: 'Todo not found' });
        }
      })
      .catch((error) => {
        res.status(500).json({ error: 'Error updating todo' });
      });
  });
// Delete a todo
app.delete('/api/posts/:id', (req, res) => {
    const { id } = req.params;
    console.log(id)
    Post.findByIdAndRemove(id)
      .then((todo) => {
        if (todo) {
          res.json({ message: 'Todo deleted successfully' });
        } else {
          res.status(404).json({ error: 'Todo not found' });
        }
      })
      .catch((error) => {
        res.status(500).json({ error: 'Error deleting todo' });
      });
  });

module.exports = app;