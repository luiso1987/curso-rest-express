const { Router } = require('express');
const { check } = require('express-validator');

const { validateFields } = require('../middlewares');

const {
    login, googleSignin,
} = require('../controllers/auth');

const router = Router();

router.post('/login', [
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'El password es obligatorio').not().isEmpty(),
    validateFields
], login);

router.post('/google', [
    check('id_token', 'El id_token es requerido').notEmpty(),
    validateFields
], googleSignin);

module.exports = router;