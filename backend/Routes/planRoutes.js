const express = require('express');
const router = express.Router();
const { createPlan, getAllPlans, getPlanById, updatePlan, deletePlan } = require('../Controllers/PlanController');
const ensureAuthenticated = require('../Middleware/Auth');
const isAdmin = require('../Middleware/isAdmin');

router.post('/', ensureAuthenticated, isAdmin, createPlan);
router.get('/', ensureAuthenticated, getAllPlans);
router.get('/:id', ensureAuthenticated, getPlanById);
router.put('/:id', ensureAuthenticated, isAdmin, updatePlan);
router.delete('/:id', ensureAuthenticated, isAdmin, deletePlan);

module.exports = router;
