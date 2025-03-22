const mongoose = require('mongoose');
const { Schema } = mongoose;
const categorySchema = new Schema({
    name: { 
        type: String, 
        required: true,
        unique: true
     },

     descp:{
        type: String,
        require: true
     }
    
}, {timestamps: true})

const categoryModel = mongoose.model('category', categorySchema)
module.exports = categoryModel