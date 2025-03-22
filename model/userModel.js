const mongoose = require('mongoose');
const { Schema } = mongoose;
const userSchema = new Schema({
    firstname:{
        type:String,
        required:true       
    },
    lastname:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true,
        unique:true       
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    descp:{
        type:String        
    },
    password:{
        type:String,
        required:true
    },
    avatar:{
        url:{
            type: String
        },
        public_id:{
            type:String
            }        
    },
    banner:{
        url:{
            type: String
        },
        public_id:{
            type:String
            } 
    },

    role:{
        type:String,
        default:'user',
        required: true,
        enum:['user', 'admin']

    },
    verified:{
        type:Boolean,
       default:false
       
    },
    
    otp: { 
        type: String 
    },
    otpExpiration: {
         type: Date 
    }
}, {timestamps:true})

const userModel = mongoose.model('user', userSchema)
module.exports = userModel