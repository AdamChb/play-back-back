const express = require('express');
const router = express.Router();

const authController = require('../controllers/authControllers');
const { authenticateToken } = require('../middleware/authMiddleware');

router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/create', authenticateToken, authController.createUser);
router.post('/update', authenticateToken, authController.updateUser);
router.delete('/delete', authenticateToken, authController.deleteUser);
router.get('/getUser', authenticateToken, authController.getUser);
router.get('/getAllUsers', authenticateToken, authController.getAllUsers);

module.exports = router;
