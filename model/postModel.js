const mongoose = require('mongoose');
const { Schema } = mongoose;
const postSchema = new Schema({
    user:{
        type: mongoose.SchemaTypes.ObjectId,
        required: true
    },
    category: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: 'category'
    },
    title: {
        type: String,
        required: true
    },
    content:{
        type: String,
        required: true
    },
    images:[
        {
            url: {type: String},
            public_id: {type: String}
       }
    ],
  
    tags:{
        type: [String] 
    }    

}, {timestamps: true})

const postModel = mongoose.model('post', postSchema)

module.exports = postModel;