const express = require('express');
const { createCategory, fetchCategories, fetchCategoryByID, deleteCategory, editCategory } = require('../controller/categoryController');
const router = express.Router();

router.post('/createcategory', createCategory);
router.get('/allcategories', fetchCategories);
router.get('/', fetchCategoryByID);
router.delete('/delete/:id', deleteCategory);
router.put('/edit', editCategory);

module.exports = router;