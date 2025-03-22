const categoryModel = require("../model/categoryModel");
const postModel = require("../model/postModel");
const userModel = require("../model/userModel");
const {cloudinary} = require('../config/config');
const commentsModel = require("../model/commentsModel");
const likesModel = require("../model/likesModel");
const dislikesModel = require("../model/dislikesModel");

// Convert buffers to Cloudinary uploads
const uploadToCloudinary = (buffer, folder) => {
return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder }, (error, result) => {
        if (error) return reject(error);
        resolve(result);
    });
    stream.end(buffer);
});
};

const createPost = async (req, res) => {
    console.log('Sednding files: ', req.files)
   try {
    const {user, category, title, content} = req.body;
    if(!user) return res.status(401).send({
        success:false,
        message: "User is required to make a post"
    })
    if(!title) return res.status(401).send({
        success:false,
        message: "Title is required"
    })
    if(!content) return res.status(401).send({
        success:false,
        message: "Content cannot be empty"
    })
    if(!category) return res.status(401).send({
        success:false,
        message: "Category must be included"
    })

    const found_category = await categoryModel.findById(category);
    if(!found_category) return res.status(404).send({
        success:false,
        message: "Category not found"
        })

    const found_user = await userModel.findById(user);
    if(!found_user) return res.status(404).send({
        success:false,
        message: "User not found"
        })

    let created_images = [];

    if (req.files?.length) {
        created_images = await Promise.all(
            req.files.map(file =>
                uploadToCloudinary(file.buffer, 'user-posts').then(res => ({url: res.secure_url, public_id:res.public_id}))
            )
        );
}    
        
        
        
        const new_tags = req.body.tags ? req.body.tags.split(','): []
        const full_post = {...req.body,
            images:created_images,
             tags: new_tags
            }
        
        const created_post = new postModel(full_post);
        const resp = await created_post.save();

    res.status(201).send({
        success:true,
        message: "Post created successfully",
        data: {
            id: resp._id,
            title: resp.title                       
        }
    })
    
    
   } catch (error) {
    res.status(500).send({
        success: false,
        message: 'Could not create Post',
        error: error.message
    })
   } 
}

const fetchAllPosts = async(req,res)=>{
    try {
        const posts = await postModel.find({__v:0})
        res.status(200).send({
            success:true,
            data: posts
            })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Could not fetch posts',
            error: error.message
            })
    }
}


const fetchSinglePost = async (req, res) => {
    try {
        const {id} = req.params
        if(!id) return res.status(401).send({
            success:false,
            message: "Post id is required"
        })

        const found_post = await postModel.findById(id)
        if(!found_post) return res.status(404).send({
            success:false,
            message: "Post not found"
        })

        const found_user = await userModel.findById(found_post.user)
        if(!found_user) return res.status(404).send({
            success:false,
            message: "User not found"
        })

        const found_category = await categoryModel.findById(found_post.category)

        const complete_post = {
            id: found_post._id,
            user: found_user.username,
            user_id: found_user._id,
            avatar: found_user.avatar,
            category: found_category.name,           
            title: found_post.title,
            content: found_post.content,
            images: found_post.images,
            tags: found_post.tags,
            time_created: found_post.updatedAt            
        }

        res.status(200).send({
            success:true,
            message: "Post found successfully",
            data: complete_post
        })
        
    } catch (error) {
     res.status(500).send({
        success: false,
        message: 'Could not fetch Post',
        error: error.message
     })   
    }
}

const fetchByCategories =  async (req, res) => {
    try {
        const {id} = req.query
        if(!id) return res.status(401).send({
            success: false,
            message: 'Category ID is required'
        })

        const found_category = await categoryModel.findById(id)
        if(!found_category) return res.status(404).send({
            success: false,
            message: "Category not found"
            })

        const posts_ByCategories = await postModel.find({category: id})

        res.status(200).send({
            success:true,
            data: posts_ByCategories
            })


    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Could not fetch Post',
            error: error.message
        })
    }
}

const editPost = async (req, res) => {
    try {
     const {id} = req.params;
     const {user, category, title, content} = req.body;
     if(!id) return res.status(401).send({
         success:false,
         message: "Post ID is required"
     })
     if(!user) return res.status(401).send({
         success:false,
         message: "User ID is required to Edit a post"
     })
     if(!title) return res.status(401).send({
         success:false,
         message: "Title is required"
     })
     if(!content) return res.status(401).send({
         success:false,
         message: "Content cannot be empty"
     })
     if(!category) return res.status(401).send({
         success:false,
         message: "Category must be included"
     })
 
    
     const found_user = await userModel.findById(user);
     if(!found_user) return res.status(404).send({
         success:false,
         message: "User not found"
         })
     const found_post = await postModel.findById(id);
     if(!found_post) return res.status(404).send({
         success:false,
         message: "Post not found"
         })


        const post_images = found_post.images || []
        const edited_tags = req.body.tags ? req.body.tags.split(',') : []

        let sent_images = [];

        if (req.files?.length) {
            sent_images = await Promise.all(
                req.files.map(file =>
                    uploadToCloudinary(file.buffer, 'user-posts').then(res => ({url:res.secure_url, public_id:res.public_id}))
                )
            );
    }    
        

        const edited_images = sent_images.length > 0 ? [...post_images, ...sent_images] : post_images;


        const edited_post = {...req.body, images:edited_images, tags: edited_tags}
        const resp = await postModel.findByIdAndUpdate(id, edited_post, {new: true})
      
       
 
     res.status(201).send({
         success:true,
         message: "Post Edited successfully",
         data: {
             id: resp._id,
             title: resp.title,
                      
         }
     })
     
     
    } catch (error) {
     res.status(500).send({
         success: false,
         message: 'Could not edit Post',
         error: error.message
     })
    } 
 }

const removePostImg = async (req, res) => {
    try {
        const {id} = req.params
        const {image} = req.query

        const found_post = await postModel.findById(id)
        if(!found_post) return res.status(404).send({
            success:false,
            message: "Post not found"
        })

        const post_images = found_post.images
        const updated_images = post_images?.filter(({url})=> url !== image)

        const update_post = await postModel.findByIdAndUpdate(id, {images: updated_images}, {new:true})

        res.status(200).send({
            success:true,
            message: "Image removed successfully",
            data: update_post
        })

    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Could not remove post image',
            error: error.message
        }) 
    }
}

const deletePost = async (req, res) => {
    try {
        const {id} = req.params
        if(!id) return res.status(401).send({
            success: false,
            message: 'Post ID is required'
        })

        const found_post = await postModel.findById(id)      
            
        if(!found_post) return res.status(404).send({
            success: false,
            message: "Post not found"
            })
        const post_images = found_post.images

        if (post_images?.length > 0) {
            for (const image of post_images) {               
                await cloudinary.uploader.destroy(image.public_id);
            }
        }

        const deleteComments = await commentsModel.deleteMany({post: id})
        const deleteLikes = await likesModel.deleteMany({post: id}) 
        const deleteDislikes = await dislikesModel.deleteMany({post: id})

       
    
        const deletePost = await postModel.findByIdAndDelete(id) 
        
        res.status(200).send({
            success: true,
            message: "Post deleted successfully",
            data: {
                id: deletePost._id,
                title: deletePost.title,
            }
        })
        
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Could not fetch Post',
            error: error.message
        }) 
    }
}

module.exports = {createPost, fetchSinglePost, fetchAllPosts, fetchByCategories, editPost, deletePost, removePostImg };