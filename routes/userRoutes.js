const express = require('express');
const { registerUser, loginUser, fetchAllusers, fetchUserPage, 
     deleteUser, editUser, changePassword, verifyOTP } = require('../controller/userController');
const router = express.Router();
const upload = require('../middleware/fileUpload')


router.post('/register', upload.fields([
    { name: 'avatar', maxCount: 1 },  
    { name: 'banner', maxCount: 1 } 
]),  registerUser);
router.post('/verify-otp', verifyOTP);
router.post('/login', loginUser)
router.get('/allusers', fetchAllusers)
router.delete('/delete/:id', deleteUser)
router.get('/allusers/:id', fetchUserPage)

router.put('/edituser', upload.fields([
    { name: 'avatar', maxCount: 1 },  
    { name: 'banner', maxCount: 1 } 
]), editUser);

router.put('/changepwd/:id', changePassword)

module.exports = router