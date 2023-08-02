const express = require("express");
const router = express.Router();
const Post = require('../models/post')
const checkAuth = require("../middleware/check.auth")
const multer = require("multer")


const MIME_TYPE_MAP = {
  'image/png':'png',
  'image/jpeg':'jpg',
  'image/jpg':'jpg'
};

 const storage = multer.diskStorage({
  destination: (req , file, cb) =>{
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if(isValid){
      error = null;
    }
    cb(null,"backend/images");
  },
  filename: (req,file,cb) =>{
     const name = file.originalname.toLowerCase().split(' ').join('-');
     const ext = MIME_TYPE_MAP[file.mimetype];
     cb(null,name,'-',Date.now(),'.'+ext)
  }
 })
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

router.post("",checkAuth,
 multer({storage:storage}).single("image"),(req,res,next) =>{
  const url = req.protocol + '://' + req.get("host");
    const post = new Post({
        title:req.body.title,
        content:req.body.content,
        imagePath: url + "/images/" +req.file.filename,
        creator: req.userData.userId
    });
    post.save().then(result =>{
      res.status(201).json({
        message:"post send successfully!",
        post: {
          ...result,
          id: result._id
        }
    });
    });
    console.log(post);
   
})
// Get All Posts
router.get('',(req, res, next) => {
  let fetchedPost;
  const pageSize = req.query.pageSize;
  const currentPage = req.query.page;
  const postQuery = Post.find();
  
  if(pageSize && currentPage){
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  postQuery.then(document =>{
    fetchedPost = document;
    return Post.count();
  })
  .then(count =>{
    res.status(200).json({
      message:'Post fetch  successfully!',
      data: fetchedPost,
      maxPost:count,
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
router.put('/:id',checkAuth,
multer({storage:storage}).single("image"), (req, res) => {
    const { id } = req.params;
    let { title, content, imagePath , creator} = req.body;
    if(req.file){
      const url = req.protocol + '://' + req.get("host");
      imagePath = url + "/images/" +req.file.filename
    }

    Post.updateOne({_id:req.params.id,creator:req.userData.userId}, { title, content, imagePath ,creator})
      .then((todo) => {
        if (todo) {
          if(todo.modifiedCount === 0){
            res.status(410).json("Invild User!!!")
          }else{
            res.json({ message: 'Post updated successfully' });
          }
        } else {
          res.status(404).json({ error: 'Post not found' });
        }
      })
      .catch((error) => {
        res.status(500).json({ error: 'Error updating post' });
      });
  });
// Delete a todo
router.delete('/:id',checkAuth,
 (req, res) => {
    const { id } = req.params;
    Post.deleteOne({_id:req.params.id,creator:req.userData.userId})
      .then((todo) => {
        if (todo) {
          console.log(todo)
          if(todo.deletedCount === 0){
            res.status(410).json("Invild User!!!")
          }else{
            res.json({ message: 'Post deleted successfully' });
          }
        } else {
          res.status(404).json({ error: 'Post not found' });
        }
      })
      .catch((error) => {
        res.status(500).json({ error: 'Error deleting post' });
      });
  });


   
  module.exports = router;