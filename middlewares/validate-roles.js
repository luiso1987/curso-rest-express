const { request, response } = require("express");


const validateAdminRole = (req = request, res = response, next) => {

    if(!req.user_auth) {
        return res.status(500).json({
            msg: 'Se quiere verificar el rol sin validar el token'
        });
    }

    const { role, name } = req.user_auth;

    if(role !== 'ADMIN_ROLE') {
        return res.status(401).json({
            msg: `${name} no es admiinistrador - No tienes permisos`
        });
    }

    next();
};

const validateRole = ( ...roles ) => {
    return (req, res = response, next) => {
        if(!req.user_auth) {
            return res.status(500).json({
                msg: 'Se quiere verificar el rol sin validar el token'
            });
        }

        if(!roles.includes(req.user_auth.role)) {
            return res.status(500).json({
                msg: `El servicio require uno de estos roles ${roles}`
            });
        }

        next();
    }
}


module.exports = {
    validateAdminRole,
    validateRole
}