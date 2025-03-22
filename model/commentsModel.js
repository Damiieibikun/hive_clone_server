const mongoose = require('mongoose');
const { Schema } = mongoose;
const commentsSchema = new Schema({
    user:{
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: 'user'
    },
    post:{
        type: mongoose.SchemaTypes.ObjectId,
        required: true
    },
    reply:{
        type:String,
        required:true
    }
}, {timestamps: true})

const commentsModel = mongoose.model('comment', commentsSchema)

module.exports = commentsModel;