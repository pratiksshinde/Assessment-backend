const routes = require('express').Router();
const { createDeal, UpdateDeal, DeleteDeal, recommended, analytics, getDeals } = require('../controllers/dealController');
const { verifyToken, verifyCorporate, verifyInvestor } = require('../middleware/authMiddleware');

routes.get('/deals',                    getDeals);                             
routes.get('/deals/recommended',        verifyToken, verifyInvestor, recommended);
routes.get('/deals/:id/analytics',      verifyToken, verifyCorporate, analytics);
routes.post('/deals',                   verifyToken, verifyCorporate, createDeal);
routes.put('/deals/:id',                verifyToken, verifyCorporate, UpdateDeal);
routes.delete('/deals/:id',             verifyToken, verifyCorporate, DeleteDeal);

module.exports = routes;