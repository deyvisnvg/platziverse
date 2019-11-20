const debug = require('debug')('platziverse:db:setup') // Aqui le digo que muestre específicamente en que modulo o archivo estoy haciendo debug // El modulo de debug me permite tener mensajes de logs que yo voya a imprimir en pantalla, siempre en cuando yo tenga una variable de entorno configurada

module.exports = setup => ({
        database: process.env.DB_NAME || 'platziverse', // Vamos a pasar valores como si fueran variables de entorno por defecto
        username: process.env.DB_USER || 'platzi',
        password: process.env.DB_PASS || 'platzi',
        host: process.env.DB_HOST || 'localhost',
        dialect: 'postgres', // Es una propiedad de sequelite que es el dialecto. Si n algun momento deseamos migrar a mysql, simplement cambiar este dialecto.
        logging: s => debug(s),
        setup: setup
    })

// function configuracion(setup) {
//     return {
//         database: process.env.DB_NAME || 'platziverse', // Vamos a pasar valores como si fueran variables de entorno por defecto
//         username: process.env.DB_USER || 'platzi',
//         password: process.env.DB_PASS || 'platzi',
//         host: process.env.DB_HOST || 'localhost',
//         dialect: 'postgres', // Es una propiedad de sequelite que es el dialecto. Si n algun momento deseamos migrar a mysql, simplement cambiar este dialecto.
//         logging: s => debug(s),
//         setup: setup
//     }  
// }

// module.exports = {
//     config: configuracion
// }