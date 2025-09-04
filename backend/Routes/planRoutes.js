const express = require('express');
const router = express.Router();
const{createPlan,getAllPlans,getPlanById,updatePlan,deletePlan} = require('../Controllers/PlanController');


//CREATE

router.post('/',createPlan);

//READ
router.get('/',getAllPlans);
router.get('/:id',getPlanById)

//UPDATE
router.put('/:id',updatePlan);

//DELETE
router.delete('/:id',deletePlan)

module.exports = router;