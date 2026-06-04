const routes = require('express').Router();
const { invest } = require('../controllers/investmentController');
const { verifyToken, verifyInvestor } = require('../middleware/authMiddleware');

routes.post('/deals/:id/invest', verifyToken, verifyInvestor, invest);

module.exports = routes;