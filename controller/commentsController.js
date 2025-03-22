const commentsModel = require("../model/commentsModel");
const likesModel = require("../model/likesModel");
const dislikesModel = require("../model/dislikesModel")

const createComment = async (req, res) => {
    try {
        const{user, post, reply} = req.body;
        if(!reply) return res.status(401).send({
            success: false,
            message: "Reply cannot be empty"
        })
        if(!user) return res.status(401).send({
            success: false,
            message: "User ID must be provided"
        })
        if(!post) return res.status(401).send({
            success: false,
            message: "Post ID must provided"
        })

        const created_reply = new commentsModel(req.body);
        const savedReply = await created_reply.save();
        res.status(201).send({
            success: true,
            message: "Comment created successfully",
            data: savedReply
            })
        
        
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Could not post comment',
            error: error.message
        })
    }

};

const fetchPostComment = async (req, res) => {
    try {
        const { id } = req.params;
        if(!id) return res.status(401).send({
            success: false,
            message: "Post ID must be provided"
        })

        const post_comment = await commentsModel.find({post: id}).populate('user')
        if(!post_comment) return res.status(404).send({
            success: false,
            message: "No comments found for this post"
        });

        
        res.status(200).send({
            success: true,
            message: "Comments fetched successfully",
            data: post_comment
            })
        
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Could not fetch post comments',
            error: error.message
        })
    }
};



const fetchAllComments = async (req, res) => {
    try {
        const comments = await commentsModel.find();           

        res.status(200).send({
            success: true,
            message: "Comments fetched successfully",
            data: comments,
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Could not fetch comments",
            error: error.message,
        });
    }
};

const deleteComment = async (req, res) => {
    try {
        const {id} = req.params
        if(!id) return res.status(401).send({
            success: false,
            message: "Comment id is required"
        })

        const delete_comment =  await commentsModel.findByIdAndDelete(id)
        if(!delete_comment) return res.status(404).send({
            success: false,
            message: "Comment not found"
            })       
        const delete_likes = await likesModel.deleteMany({post:id})
        const delete_dislike = await dislikesModel.deleteMany({post:id}) 

        res.status(200).send({
            success: true,
            message: "Comment deleted successfully",
            data:{
                id: delete_comment._id,
                content: delete_comment.reply,
            }
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Could not delete comments",
            error: error.message,
        });
    }
};

const editComment = async (req, res) => {
    try {
        const {id} = req.params
        const{user, post, reply} = req.body;
        if(!id) return res.status(401).send({
            success: false,
            message: "Comment ID is required"
        })
        if(!reply) return res.status(401).send({
            success: false,
            message: "Reply cannot be empty"
        })
        if(!user) return res.status(401).send({
            success: false,
            message: "User ID must be provided"
        })
        if(!post) return res.status(401).send({
            success: false,
            message: "Post ID must provided"
        })

        const found_comment = await commentsModel.findById(id)
        if(!found_comment) return res.status(404).send({
            success: false,
            message: 'Comment not found'
        })

        const update_comment = await commentsModel.findByIdAndUpdate(id, req.body, {new: true})

        res.status(200).send({
            success: true,
            message: "Comment updated successfully",
            data: update_comment
            })
        
        
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Could not post comment',
            error: error.message
        })
    }

}


module.exports = {createComment, fetchPostComment, fetchAllComments, deleteComment, editComment}