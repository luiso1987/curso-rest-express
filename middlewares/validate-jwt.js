const { response, request } = require('express');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const validateJWT = async(req = request, res = response, next) => {
    const token = req.header('x-token');
    if(!token) {
        return res.status(401).json({
            msg: 'No hay token en la petición'
        });
    }

    try {
        const {uid} = jwt.verify(token, process.env.SECRET_KEY);

        const user_auth = await User.findById( uid );

        if(!user_auth) {
            return res.status(401).json({
                msg: 'Token no válido - Usuario no existe'
            });
        }

        if(!user_auth.state)
            return res.status(401).json({
                msg: 'Token no válido - Estado Inactivo'
            });

        req.user_auth = user_auth;

        next();
    } catch(err) {
        console.log(err);
        res.status(401).json({
            msg: 'Token no valido'
        });
    }
};


module.exports = {
    validateJWT
}