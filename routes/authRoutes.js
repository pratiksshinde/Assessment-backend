const routes = require('express').Router();
const { register, login } = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware');

routes.post('/register', register);
routes.post('/login',login);


module.exports = routes;