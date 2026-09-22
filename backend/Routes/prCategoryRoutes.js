const express = require("express");
const router = express.Router();
const {
  createPRCategory,
  getAllPRCategories,
  getPRCategoryById,
  updatePRCategory,
  deletePRCategory,
} = require("../Controllers/PrCategoryController");
const ensureAuthenticated = require("../Middleware/Auth");
const isAdmin = require("../Middleware/isAdmin");

router.post("/", ensureAuthenticated, isAdmin, createPRCategory);
router.get("/", ensureAuthenticated, getAllPRCategories);
router.get("/:id", ensureAuthenticated, getPRCategoryById);
router.put("/:id", ensureAuthenticated, isAdmin, updatePRCategory);
router.delete("/:id", ensureAuthenticated, isAdmin, deletePRCategory);

module.exports = router;
