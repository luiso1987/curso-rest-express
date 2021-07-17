const { response } = require('express');
const bcryptjs = require('bcryptjs');

const User = require('../models/user');
const { generarJWT } = require('../helpers/jwt');


const login = async(req, res = response) => {

    const { email, password } = req.body;

    try {
        // Verificar el email
        const user = await User.findOne({ email });
        if(!user) {
            return res.status(404).json({
                msg: 'Usuario no registrado en la base de datos - email'
            });
        }

        // Verificar si esta activo
        if(!user.state) {
            return res.status(404).json({
                msg: 'Usuario no registrado en la base de datos - estado: false'
            });
        }

        // Verificar la contraseña
        const validatePassword = bcryptjs.compareSync( password, user.password );
        if(!validatePassword) {
            return res.status(404).json({
                msg: 'Usuario no registrado en la base de datos - password'
            });
        }

        // Generar El JWT
        const token = await generarJWT( user.id );

        res.json({
            user,
            token
        });
    } catch(err) {
        console.log(err)
        res.status(500).json({
            msg: 'Ocurrio un error, consulte a soporte'
        });
    }
}


module.exports = {
    login,
}