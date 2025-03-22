const likesModel = require("../model/likesModel")
const userModel = require("../model/userModel")
const postModel = require('../model/postModel')
const commentsModel = require("../model/commentsModel")

const likePost = async (req, res) => {
    try {
        const{user, post} = req.body
        if(!user) return res.status(401).send({
            success: false,
            message: "User ID is required"
        })
        if(!post) return res.status(401).send({
            success: false,
            message: "Post ID is required"
        })

        const found_user = await userModel.findById(user);
        const found_post = await postModel.findById(post); 
        const found_comment = await commentsModel.findById(post); 
        
        if(!found_user) return res.status(401).send({
            success: false,
            message: "User not found"
            })
       
        if(!found_post && !found_comment) return res.status(401).send({
            success: false,
            message: "Post not found"
            })

        const found_like = await likesModel.findOne({user: user, post: post})
        if(!found_like){
            const new_like = new likesModel({...req.body, liked: true})
            const resp = await new_like.save()
            res.status(201).send({
                success: true,
                message: "Post liked successfully",
                data: resp
                })
        }
        else{
          
            if(found_like.liked){
                found_like.liked = false
            }
            else{
                found_like.liked = true
                }

            const resp = await found_like.save()            
            
            res.status(200).send({
                success: true,
                message: "Post updated successfully",
                data: resp,
                
                })
        }
        
           
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Could not create Like',
            error: error.message
        })
    }
}

const getAllLikes = async (req, res) => {
    try {
        const likes = await likesModel.find()
        res.status(200).send({
            success: true,
            message: "Likes retrieved successfully",
            data: likes
            })
        
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Could not get all likes',
            error: error.message
        })
    }
    
}

module.exports = {likePost, getAllLikes}