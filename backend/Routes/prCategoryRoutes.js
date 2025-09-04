const express = require("express");
const router = express.Router();
const{createPRCategory,getAllPRCategories,getPRCategoryById,updatePRCategory,deletePRCategory}=
require('../Controllers/PrCategoryController')

//CREATE
router.post('/',createPRCategory);

//READ
router.get('/',getAllPRCategories);
router.get('/:id',getPRCategoryById);


//UPDATE

router.put('/:id',updatePRCategory);


//DELETE
router.delete('/:id',deletePRCategory);

module.exports = router;
