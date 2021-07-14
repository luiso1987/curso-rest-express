const { Router } = require('express');
const { check } = require('express-validator');

const { validateFields } = require('../middlewares/validate-fields');
const { validateRoleExist, validateEmailExist, validateIdExist } = require('../helpers/db-validators');

const {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
} = require('../controllers/users');

const router = Router();

router.get('/', usuariosGet);

router.put('/:id', [
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(validateIdExist),
    check('role').custom( validateRoleExist ),
    validateFields
], usuariosPut);

router.post('/', [
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password es obligatorio').isLength({min: 6}),
    check('email', 'El correo no es válido').isEmail(),
    check('email').custom( validateEmailExist ),
    check('role').custom( validateRoleExist ),
    validateFields
], usuariosPost);

router.delete('/:id', [
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(validateIdExist),
    validateFields
], usuariosDelete);

router.patch('/', usuariosPatch);


module.exports = router;