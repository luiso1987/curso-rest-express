const express = require('express')
const cors = require('cors');

const user_route = require('../routes/user');
const auth_route = require('../routes/auth');
const { dbConnection } = require('../database/config');

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.usersPath = '/api/users';
        this.authPath = '/api/auth';

        // Conectar a base de datos
        this.conectarBD();

        // Middlewares
        this.middlewares();

        // Rutas de aplicación
        this.routes();
    }

    async conectarBD() {
        await dbConnection();
    }

    middlewares() {
        // CORS
        this.app.use( cors() );

        // Lectura y parse de Body
        this.app.use( express.json() );

        // Directorio publico
        this.app.use( express.static('public') );
    }

    routes() {
        this.app.use(this.usersPath, user_route);
        this.app.use(this.authPath, auth_route);
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Example app listening at http://localhost:${this.port}`)
        });
    }
}


module.exports = Server;