const userModel = require("../model/userModel");
const categoryModel = require('../model/categoryModel');
const postModel = require("../model/postModel");

const createCategory = async(req, res)=>{
    try {
        const {user_id, name} = req.body;
        if(!user_id) return res.status(401).send({
            success: false,
            message: "User ID is required"

        })
        if(!name) return res.status(401).send({
            success: false,
            message: "Category name is required"

        })

        const found_user = await userModel.findById(user_id);
        if(!found_user) return res.status(404).send({
            success: false,
            message: "User not found"
            })
        
        if(found_user.role != 'admin') return res.status(401).send({
            success: false,
            message: "You are not authorized to create a category"
        })


        const found_cat = await categoryModel.findOne({name: name})
        if(found_cat) return res.status(401).send({
            success: false,
            message: 'Category already exists'
        })

       
        const created_category = new categoryModel(req.body);
        const resp = await created_category.save();

        res.status(201).send({
            success: true,
            message: "Category created successfully",
            data: resp
        })


    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error creating category",
            error: error.message

        })
    }
}

const fetchCategories = async (req, res) => {
    try {
        const categories = await categoryModel.find({ __v:0});
        res.status(200).send({
            success: true,
            message: "Categories fetched successfully",
            data: categories
            })
        
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error fetching categories",
            error: error.message
        })
    }
    
}

const fetchCategoryByID = async (req, res) => {
    try {

        const {id} = req.query
        if(!id) return res.status(401).send({
            success: false,
            message: "Category ID is required",
        })

        const found_cat = await categoryModel.findById(id)
        if(!found_cat) return res.status(404).send({
            success: false,
            message: "Category not found",
        })

        res.status(200).send({
            success: true,
            data: found_cat
        })
        
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error fetching category",
            error: error.message
        })
    }
}

const deleteCategory = async (req, res) => {
    try {
        const{id} = req.params
        if(!id) return res.status(401).send({
            success: false,
            message: 'Category ID is required'
        })

        const found_post = await postModel.findOne({category:id})
        if(found_post) return res.status(401).send({
            success: false,
            message: 'Cannot Delete Category; Posts assigned to it'
        })

        const delete_category = await categoryModel.findByIdAndDelete(id)
        res.status(200).send({
            success: true,
            message: 'Category Deleted Successfully!',
            data: {
                cat_id: delete_category._id
            }
        })
        
    } catch (error) {
       res.status(500).send({
        success: false,
        message: 'Could not delete Category',
        error: error.message
       }) 
    }
}

const editCategory = async (req, res) => {
    try {
        const {cat_id, user_id, name, descp} = req.body;
        if(!cat_id) return res.status(401).send({
            success: false,
            message: "Category ID is required"

        })
        if(!user_id) return res.status(401).send({
            success: false,
            message: "User ID is required"

        })
        if(!name) return res.status(401).send({
            success: false,
            message: "Category name is required"

        })

        const found_user = await userModel.findById(user_id);
        if(!found_user) return res.status(404).send({
            success: false,
            message: "User not found"
            })
        
        if(found_user.role != 'admin') return res.status(401).send({
            success: false,
            message: "You are not authorized to edit a category"
        })


        const found_cat = await categoryModel.findOne({name: name})
        
        if(found_cat && found_cat._id.toString() !== cat_id) return res.status(401).send({
            success: false,
            message: 'Category already exists'
        })


        const update_cat = await categoryModel.findByIdAndUpdate(cat_id, {name, descp}, {new:true})
        
        if (!update_cat) {
            return res.status(404).send({
                success: false,
                message: "Category not found",
            });
        }
        res.status(200).send({
            success: true,
            message: 'Category Edited Successfully!',
            data: update_cat
        })

        
    } catch (error) {
       res.status(500).send({
        success: false,
        message: 'Could not update Category',
        error: error.message
       }) 
    }
}

module.exports = {createCategory, fetchCategories, fetchCategoryByID, deleteCategory, editCategory}