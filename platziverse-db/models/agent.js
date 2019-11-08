'use strict'

const Sequelize = require('sequelize')
const setupDatabase = require('../lib/db')

module.exports = function setupAgentModel (config) {
  const sequelize = setupDatabase(config)

  return sequelize.define('agent', { // Como creamos nuestro modelo para ello -> Hay una función dentro del objeto sequelize llamada 'define' que me permite definir un moedelo utilizando un objeto sencillo de javascript
    uuid: {
      type: Sequelize.STRING,
      allowNull: false // No va ha permitir ningun dato nulo
    },
    username: {
      type: Sequelize.STRING,
      allowNull: false
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    hostname: {
      type: Sequelize.STRING,
      allowNull: false
    },
    pid: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    connected: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false // Valor por defecto
    }
  })
}
