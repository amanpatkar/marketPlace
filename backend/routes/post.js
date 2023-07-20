const express = require("express");
const router = express.Router();
const Post = require('../models/post')



router.get('/:id', (req, res, next) => {
    // Handle the GET request for retrieving a specific post by ID
    const postId = req.params.id;

    Post.findById(postId)
      .then((todo) => {
        if (todo) {
          res.json(todo);
        } else {
          res.status(404).json({ error: 'Post not found' });
        }
      })
      .catch((error) => {
        res.status(500).json({ error: 'Error retrieving post' });
      });
  
});

router.post("",(req,res,next) =>{
    const post = new Post({
        title:req.body.title,
        content:req.body.content
    });
    post.save().then(result =>{
      res.status(201).json({
        message:"post send successfully!",
        postId:result._id
    });
    });
    console.log(post);
   
})
// Get All Posts
router.get('',(req, res, next) => {
    Post.find().then(document =>{
        res.status(200).json({
            message:'Post fetch  successfully!',
            data: document,
            status:200
        })
    })
   
})
// Get a specific todo
router.get('/:id', (req, res) => {
    const { id } = req.params;
  
    Post.findById(id)
      .then((todo) => {
        if (todo) {
          res.json(todo);
        } else {
          res.status(404).json({ error: '{Post} not found' });
        }
      })
      .catch((error) => {
        res.status(500).json({ error: 'Error retrieving post' });
      });
  });
  // Update a todo
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;
  
    Post.findByIdAndUpdate(id, { title, content })
      .then((todo) => {
        if (todo) {
          res.json({ message: 'Post updated successfully' });
        } else {
          res.status(404).json({ error: 'Post not found' });
        }
      })
      .catch((error) => {
        res.status(500).json({ error: 'Error updating post' });
      });
  });
// Delete a todo
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    console.log(id)
    Post.findByIdAndRemove(id)
      .then((todo) => {
        if (todo) {
          res.json({ message: 'Post deleted successfully' });
        } else {
          res.status(404).json({ error: 'Post not found' });
        }
      })
      .catch((error) => {
        res.status(500).json({ error: 'Error deleting post' });
      });
  });


   
  module.exports = router;