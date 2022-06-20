const Router = require('express').Router;
const userController = require('../controllers/user-controler')
const router = new Router();
const { body } = require('express-validator');
const authMiddleware = require('../middlewares/auth-middleware');

router.post(
    '/registration',
    body('login').isLength({ min: 3, max: 32 }),
    body('password').isLength({ min: 5, max: 32 }),
    userController.registration
);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.get('/refresh', userController.refresh);
router.get('/users', authMiddleware, userController.getUsers);
router.post('/user', authMiddleware, userController.getUser);


module.exports = router;