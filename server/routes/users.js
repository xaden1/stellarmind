const router = require('express').Router();
const {
  getUser, saveAnalysis, getGoals, addGoal, deleteGoal, updateGoal
} = require('../controllers/userController');

router.get('/:walletAddress', getUser);
router.post('/:walletAddress/analysis', saveAnalysis);
router.get('/:walletAddress/goals', getGoals);
router.post('/:walletAddress/goals', addGoal);
router.delete('/:walletAddress/goals/:goalId', deleteGoal);
router.patch('/:walletAddress/goals/:goalId', updateGoal);

module.exports = router;
