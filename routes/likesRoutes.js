const express = require('express');
const { likePost, getAllLikes } = require('../controller/likesController');
const { dislikePost , getAllDislikes} = require('../controller/dislikesController');
const router = express.Router();

router.post('/createlike', likePost);
router.post('/createdislike', dislikePost);

router.get('/alllikes', getAllLikes);
router.get('/dislikes', getAllDislikes);

module.exports = router