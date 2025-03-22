const mongoose = require('mongoose');
const { Schema } = mongoose;
const likesSchema = new Schema({
user: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true
},
post: {
    type: Schema.Types.ObjectId,
    ref: 'post',
    required: true
},

liked:{
    type:Boolean,
    default: false
}
}, {timestamps: true})

const likesModel = mongoose.model('like', likesSchema )
module.exports = likesModel;