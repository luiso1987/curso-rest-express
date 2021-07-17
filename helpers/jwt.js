const jwt = require('jsonwebtoken');


const generarJWT = (uid = '') => {
    return new Promise( (res, rej) => {
        const payload = { uid };

        jwt.sign(payload, process.env.SECRET_KEY, {
            expiresIn: '4h'
        }, (err, token) => {
            if(err) {
                console.log('ERROR JWT', err);;
                rej('No se pudo generar el JWT');
            } else {
                res(token);
            }
        });
    } );
}

module.exports = {
    generarJWT
}