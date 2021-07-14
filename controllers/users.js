const { response } = require('express');
const bcryptjs = require('bcryptjs');

const User = require('../models/user');


const usuariosGet = async(req, res = response) => {

    const { from = 0, limit = 5 } = req.query;
    const query = {state: true}

    const [total, users] = await Promise.all([
        User.countDocuments(query),
        User.find(query).limit(Number(limit)).skip(Number(from))
    ]);

    res.json({
        total,
        users
    });
}

const usuariosPost = async(req, res = response) => {

    const { name, email, password, role } = req.body;
    const user = new User({ name, email, password, role });

    // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    user.password = bcryptjs.hashSync( password, salt );

    // Guardar BD
    await user.save();

    res.json(user);
}

const usuariosPut = async(req, res = response) => {

    const { id } = req.params;
    const { _id, password, google, email, ...resto } = req.body;

    // ToDo validar contra base de datos
    if(password) {
        // Encriptar la contraseña
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync( password, salt );
    }

    const user = await User.findByIdAndUpdate( id, resto );

    res.json(user);
}

const usuariosPatch = (req, res = response) => {
    res.json({
        msg: 'patch API - Controlador'
    });
}

const usuariosDelete = async(req, res = response) => {
    const { id } = req.params;

    const user = await User.findByIdAndUpdate(id, { state: false });

    res.json(user);
}


module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
}