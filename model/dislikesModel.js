const mongoose = require('mongoose');
const { Schema } = mongoose;
const dislikesSchema = new Schema({
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

disliked:{
    type:Boolean,
    default: false
}
}, {timestamps: true})

const dislikesModel = mongoose.model('dislike', dislikesSchema )
module.exports = dislikesModel;