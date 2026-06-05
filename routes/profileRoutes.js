const router = require('express').Router();
const { setupInvestorPreferences, getPreferences, updatePreferences} = require('../controllers/profileController');
const { verifyToken, verifyInvestor } = require('../middleware/authMiddleware');

router.post('/profile/preferences', verifyToken, verifyInvestor, setupInvestorPreferences);
router.get('/profile/preferences', verifyToken, verifyInvestor, getPreferences);
router.put('/profile/preferences', verifyToken, verifyInvestor, updatePreferences);

module.exports = router;