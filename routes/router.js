const express = require('express');
const Control = require('../controllers/controller');
const router = express.Router();

router.post('/registration', Control.createUser);
router.put('/update/:id', Control.updateUser);
router.post('/login', Control.login);
router.post('/logout', Control.logout);
router.get('/user/:id', Control.getUserById);
router.get('/users/:username', Control.getUsersByUsername);

module.exports = router;