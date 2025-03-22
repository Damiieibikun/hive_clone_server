require('dotenv').config()
const nodemailer = require('nodemailer');
const cloudinary = require('cloudinary').v2

const config =  {
    port: process.env.PORT,
    db_url: process.env.DB_URL,
}

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET

})

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendOTPEmail = async (email, otp) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your OTP Code',
        text: `Your OTP code is ${otp}. It expires in 10 minutes.`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("OTP email sent successfully.");
    } catch (error) {
        console.error("Error sending OTP email:", error);
    }
};



module.exports = {cloudinary, sendOTPEmail, config}