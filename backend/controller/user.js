
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require('../models/user')


exports.createUser = (req,res,next) =>{
    bcrypt.hash(req.body.password, 10).then(hash =>{

        const user = new User({
            full_name:req.body.full_name,
            email:req.body.email,
            password:hash
        })
        user.save().then(result =>{
            res.status(201).json({
                message:'User Created!!',
                result:result
            })
        }).catch(err =>{
            res.status(500).json({
                error:{
                    message:'Invalid Authentication credentials'
                }
            })
        })
    })
}

exports.userLogin = (req,res,next) =>{
    let fetchedUser;
    User.findOne({ email:req.body.email}).then(user =>{
        if(!user){
            return res.status(400).json({
                error:{
                    message:'Invalid Authentication credentials'
                }
            })
        }
        fetchedUser = user;
      return  bcrypt.compare(req.body.password, user.password)
    })
    .then(result =>{
        if(!result){
            return res.status(401).json({
                error:{
                    message:'Invalid Authentication credentials'
                }
            })
        }

        const token = jwt.sign({email:fetchedUser.email, userId:fetchedUser._id}, "secret_this_should_be_longer",{expiresIn:'1h'});
        res.status(200).json({
            token:token,
            expiresIn:3600,
            userId:fetchedUser._id
        })
    })
    .catch(error =>{
        console.log(error)
        return res.status(401).json({
            error:{
                message:'Invalid Authentication credentials'
            }
        })
    })
}
exports.getUserLists = (req, res, next) => {
    User.find({}, "-password")
        .then(users => {
            res.status(200).json({
                message: 'Users fetched successfully!',
                data: users,
                status: 200
            });
        })
        .catch(error => {
            res.status(500).json({
                error: {
                    message: 'Fetching users failed!'
                }
            });
        });
};

exports.getUserById = (req, res, next) => {
    const userId = req.params.id;

    User.findById(userId, "-password")
        .then(user => {
            if (!user) {
                return res.status(404).json({
                    error: {
                        message: 'User not found!'
                    }
                });
            }
            res.status(200).json(user);
        })
        .catch(error => {
            res.status(500).json({
                error: {
                    message: 'Fetching user failed!'
                }
            });
        });
};
