const express = require('express');
const { createPost, fetchSinglePost, fetchAllPosts, fetchByCategories, deletePost, editPost, removePostImg } = require('../controller/postController');
const router = express.Router();
const upload = require('../middleware/fileUpload');

router.post('/createpost', upload.array('images', 3),createPost);
router.put('/editpost/:id', upload.array('images', 3), editPost);
router.put('/removepostimg/:id', removePostImg);
router.get('/allposts', fetchAllPosts);
router.get('/', fetchByCategories)
router.get('/:id', fetchSinglePost);
router.delete('/delete/:id', deletePost);


module.exports = router;