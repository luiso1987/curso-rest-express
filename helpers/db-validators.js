const Role = require('../models/role');
const User = require('../models/user');

const validateRoleExist = async(role = '') => {
    const existRole = await Role.findOne({ role });
    if(!existRole) {
        throw new Error(`El rol [${role}] no existe en la BD`);
    }
}

const validateEmailExist = async(email = '') => {
    const existEmail = await User.findOne({ email });
    if(existEmail) {
        throw new Error(`El email [${email}] ya se encuentra registrado`);
    }
}

const validateIdExist = async(id) => {
    const existId = await User.findById(id);
    if(!existId) {
        throw new Error(`El id [${id}] no existe en la BD`);
    }
}


module.exports = {
    validateRoleExist,
    validateEmailExist,
    validateIdExist
}