const dislikesModel = require("../model/dislikesModel");
const userModel = require("../model/userModel")
const postModel = require('../model/postModel')
const commentsModel = require("../model/commentsModel")

const dislikePost = async (req, res) => {
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

        const found_dislike = await dislikesModel.findOne({user: user, post: post})
        if(!found_dislike){
            const new_dislike = new dislikesModel({...req.body, disliked: true})
            const resp = await new_dislike.save()
            res.status(201).send({
                success: true,
                message: "Post disliked successfully",
                data: resp
                })
        }
        else{
          
            if(found_dislike.disliked){
                found_dislike.disliked = false
            }
            else{
                found_dislike.disliked = true
                }

            const resp = await found_dislike.save()            
            
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

const getAllDislikes = async (req, res) => {
    try {
        const disllikes = await dislikesModel.find()
        res.status(200).send({
            success: true,
            message: "Dislikes retrieved successfully",
            data: disllikes
            })
        
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Could not get all dislikes',
            error: error.message
        })
    }
    
}

module.exports = {dislikePost, getAllDislikes}