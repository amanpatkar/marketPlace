const express = require('express');

const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}))
app.use((req,res,next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    res.setHeader("Access-Control-Allow-Method","GET,POST,PATCH,DELETE,OPTIONS")
    next();
})
app.post("/api/posts",(req,res,next) =>{
    const post = req.body;
    console.log(post);
    res.status(201).json({
        message:"post send successfully!"
    });
})
app.use('/api/posts',(req, res, next) => {
    const posts = [
        {
            id: 'fadf12421l', title:'First server side post', content:'this is coming from server'
        },
        {
            id: 'fadf12422l', title:'Second server side post', content:'this is coming from server'
        },  {
            id: 'fadf12423l', title:'Third server side post', content:'this is coming from server'
        },
    ]
    res.status(200).json({
        message:'Post fetch  successfully!',
        data: posts,
        status:200
    })
})

module.exports = app;