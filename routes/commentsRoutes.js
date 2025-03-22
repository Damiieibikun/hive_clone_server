const express = require('express');
const { createComment, fetchPostComment, fetchAllComments, deleteComment, editComment } = require('../controller/commentsController');
const router =  express.Router();

router.post('/reply', createComment);
router.put('/edit/:id', editComment);
router.get('/allcomments', fetchAllComments);
router.delete('/deletecomment/:id', deleteComment);
router.get('/:id', fetchPostComment);

module.exports = router