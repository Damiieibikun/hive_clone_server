const commentsModel = require('../model/commentsModel')
const postModel = require('../model/postModel')
const userModel = require('../model/userModel')
const likesModel = require('../model/likesModel')
const dislikesModel = require('../model/dislikesModel')
const bcryptjs = require('bcryptjs')
const otpGenerator = require('otp-generator')
const {sendOTPEmail} = require('../config/config')
const {cloudinary} = require('../config/config')

const uploadToCloudinary = (buffer, folder) => {
return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder }, (error, result) => {
        if (error) return reject(error);
        resolve(result);
    });
    stream.end(buffer);
});
};

const registerUser = async (req, res) => {  
    try {
        if(!req.body.password) return res.status(401).send({
            success: false,
            message: "Password is required"
        })
        if(!req.body.username) return res.status(401).send({
            success: false,
            message: "Username is required"
        })
        if(!req.body.firstname) return res.status(401).send({
            success: false,
            message: "First Name is required"
        })
        if(!req.body.lastname) return res.status(401).send({
            success: false,
            message: "Last Name is required"
        })
        if(!req.body.email) return res.status(401).send({
            success: false,
            message: "Email is required"
        })

        const found_email = await userModel.findOne({email: req.body.email})
        if(found_email){
            return res.status(401).send({
                success: false,
                message: "Email already exists"
                })
        }
        const found_username = await userModel.findOne({username: req.body.username})
        if(found_username){
            return res.status(401).send({
                success: false,
                message: "Username already exists"
                })
        }
     
        let avatarResult 
        let bannerResult
      
        if (req.files?.avatar?.length) {
            avatarResult = await uploadToCloudinary(req.files.avatar[0].buffer, 'user-profiles');
        }
      
        if (req.files?.banner?.length) {
            bannerResult = await uploadToCloudinary(req.files.banner[0].buffer, 'user-banners');
        }       
        

        const encrypted_pass = await bcryptjs.hash(req.body.password, 12);
        
        const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false });

        const new_user = {...req.body, 
            password:encrypted_pass, 
            avatar: {
                url: avatarResult ? avatarResult.secure_url: null,
                public_id: avatarResult ? avatarResult.public_id: null
            } , 
            banner: {
                url: bannerResult ? bannerResult.secure_url: null,
                public_id: bannerResult ? bannerResult.public_id: null,
            },
            otp:otp,
            otpExpiration: new Date(Date.now() + 3 * 60 * 1000)  
        };
        const created_user = new userModel(new_user);

        await created_user.save();

        await sendOTPEmail(req.body.email, otp);       

        res.status(200).send({
            success: true,
            message: "OTP sent to email.",
          
        });
       
        
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error in registering user",
            error: error.message
        })
    }
}

///////
const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).send({success: false, message: "User not found" });
        }

        if (user.otp !== otp || new Date() > user.otpExpiration) {
            return res.status(400).send({ success: false, message: "Invalid or expired OTP" });
        }
       
        user.verified = true;
        user.otp = undefined;
        user.otpExpiration = undefined;

        await user.save();

        res.status(201).send({ 
            success: true, 
            message: "Email verified successfully.",
            data: {
                    id: user._id,
                    username: user.username,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    descp: user.descp,  
                    avatar: user.avatar,
                    banner: user.banner,
                    role: user.role,
                    email: user.email,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt 
                }
        });
    } catch (error) {
        res.status(500).send({ success: false, message: "Error verifying OTP", error: error.message });
    }
};



//////

const loginUser = async (req, res) => {
    try {
        const {username, password} = req.body;
        const user = await userModel.findOne({username:username});
        if(!user){
            return res.status(404).send({
                success: false,
                message: "*User Not Found",
            })
        };

        const checkPassword = await bcryptjs.compare(password, user.password)
        if(!checkPassword){
            return res.status(401).send({
                success: false,
                message: "*Invalid Password!",
            })
        };


        res.status(200).send({
            success: true,
            message: "User logged in successfully",
            data: {
                id: user._id,
                username: user.username,
                avatar: user.avatar,
                banner: user.banner,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
                firstname: user.firstname,
                lastname: user.lastname,
                descp: user.descp                
            }
        })
        
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error in logging in user",
            error: error.message
        })
    }
}


const fetchAllusers = async (req, res) => {
    try {
        const users = await userModel.find({role: 'user'},{password:0, __v:0});
        res.status(200).send({
            success: true,
            data: users
            })
        
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error in fetching all users",
            error: error.message
        })
    }
}

const fetchUserPage = async (req, res) => {
 try {
    const{id} = req.params
    if(!id) return res.status(404).send({
        success: false,
        message: "User ID not Provided"
    })

    const found_user = await userModel.findById(id)
    if(!found_user) return res.status(404).send({
        success: false,
        message: "User not found"
        })
    
    const user_posts = await postModel.find({user: id}).populate('category', 'name')
    const user_comments = await commentsModel.find({user: id}) 
    // const user_replies = user_posts.filter((post)=> post._id)

    res.status(200).send({
        success: true,
        message: 'User page fetched successfully!',
        data: {
            user: found_user,
            posts: user_posts,
            comments: user_comments
            }
    })
    



 } catch (error) {
    res.status(500).send({
        success: false,
        message: "Error in fetching user page",
        error: error.message
    })
 }   
}

const deleteUser = async (req, res) => {
    try {
        const {id} = req.params

        if(!id) return res.status(401).send({
            success: false,
            message: 'User ID is required'
        })

        const found_user = await userModel.findById(id)
        
        if(!found_user) return res.status(404).send({
            success: false,
            message: 'User not Found'
        })

        const user_profilepic = found_user.avatar.public_id
        const user_banner = found_user.banner.public_id

        if(user_profilepic){
            await cloudinary.uploader.destroy(user_profilepic)
        }
        if(user_banner){
            await cloudinary.uploader.destroy(user_banner)
        }       

        const found_posts = await postModel.find({user: id})
     
        if (found_posts.length > 0) {
            for (const post of found_posts) {  // Loop through posts
                if (post.images && post.images.length > 0) {
                    for (const image of post.images) { // Loop through images array
                        if(image.public_id){
                            await cloudinary.uploader.destroy(image.public_id);
                        }
                        
                    }
                }
            }
        }
        
        const delete_posts = await postModel.deleteMany({user: id})
        const delete_comments = await commentsModel.deleteMany({user: id})
        const delete_likes = await likesModel.deleteMany({user:id})
        const delete_dislikes = await dislikesModel.deleteMany({user:id})



        const deleteUser = await userModel.findByIdAndDelete(id)
        res.status(200).send({
            success: true,
            message: 'User Deleted Successfully!',
            data: {user_id: deleteUser._id}

        })
        
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Could not delete user',
            error: error.message
        })
    }
}


const editUser = async (req, res) => {
    const {user_id, username, firstname, lastname} = req.body
    try {        
        if(!user_id) return res.status(401).send({
            success: false,
            message: "User ID is required"
        })
        
        if(!username) return res.status(401).send({
            success: false,
            message: "Username is required"
        })
        if(!firstname) return res.status(401).send({
            success: false,
            message: "First Name is required"
        })
        if(!lastname) return res.status(401).send({
            success: false,
            message: "Last Name is required"
        })
       

        const found_user = await userModel.findById(user_id)
        if (!found_user) {
            return res.status(404).send({
                success: false,
                message: "User not found",
            });
        }

        let avatarResult 
        let bannerResult
      
        if (req.files?.avatar?.length) {
            avatarResult = await uploadToCloudinary(req.files.avatar[0].buffer, 'user-profiles');
        }
      
        if (req.files?.banner?.length) {
            bannerResult = await uploadToCloudinary(req.files.banner[0].buffer, 'user-banners');
        }       
        
        
        const update_user = await userModel.findByIdAndUpdate(user_id, {
            ...req.body,           
            avatar: {
                url: avatarResult ? avatarResult.secure_url: found_user.avatar.url,
                public_id: avatarResult ? avatarResult.public_id: found_user.avatar.public_id
            } , 
            banner: {
                url: bannerResult ? bannerResult.secure_url: found_user.banner.url,
                public_id: bannerResult ? bannerResult.public_id: found_user.banner.public_id,
            }
            },
               {new:true})
       
            

        res.status(200).send({
            success: true,
            message: 'User Edited Successfully!',
            data: {
                id: update_user._id,
                username: update_user.username,
                avatar: update_user.avatar,
                role: update_user.role,
                email: update_user.email,
                createdAt: update_user.createdAt,
                updatedAt: update_user.updatedAt,
                firstname: update_user.firstname,
                lastname: update_user.lastname,
                descp: update_user.descp
            }
        })


    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Could not edit User',
            error: error.message
        })
    }
}

const changePassword = async (req, res) => {
    try {
        const {id} = req.params;
        const {old_password, new_password} = req.body

        const found_user = await userModel.findById(id)
        if (!found_user) return res.status(404).send({
                success: false,
                message: "User not found",
                });

    const user_password = found_user.password
    const check_password = await bcryptjs.compare(old_password, user_password)
    if(!check_password){
        return res.status(401).send({
            success: false,
            message: "*Invalid Password!",
        })
    };

    const encrypted_pass = await bcryptjs.hash(new_password, 12);
    const update_password = await userModel.findByIdAndUpdate(id, {...req.body, password: encrypted_pass}, {new: true})

    res.status(200).send({
        success: true,
        message: 'Password Changed Successfully!',
        data: {
            role: update_password.role
        }
    })

        
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Could not change Users password',
            error: error.message
        })
    }
}

module.exports = {registerUser, loginUser, fetchAllusers, fetchUserPage, deleteUser, editUser, changePassword, verifyOTP}