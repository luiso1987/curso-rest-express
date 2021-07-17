const { response } = require('express');
const bcryptjs = require('bcryptjs');

const User = require('../models/user');
const { generarJWT } = require('../helpers/jwt');
const { googleVerify } = require('../helpers/google-validate');


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

const googleSignin = async(req, res = response, next) => {

    const { id_token } = req.body;

    try {

        const { name, image, email } = await googleVerify(id_token);

        let user = await User.findOne({ email });
        if(!user) {
            // Crear usuario
            const data = {
                name,
                email,
                image,
                password: ':P',
                google: true
            }

            user = new User(data);
            await user.save();
        }

        // Si usuario en BD esta inactivo
        if(!user.state) {
            return res.status(401).json({
                msg: 'Usuario Bloqueado contacte a sotorpe'
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
        res.status(400).json({
            msg: 'El Token de google no es válido'
        });
    }
}


module.exports = {
    login,
    googleSignin
}