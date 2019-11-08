'use strict'

// Aquí vamos a definir como crear el objeto de Sequelize, para despues utilizar el objeto de sequelize para crear nuestros modelos.
const Sequelize = require('sequelize')
let sequelize = null

module.exports = function setupDatabase (config) {
  if (!sequelize) { // Si sequelize no existe o es null
    sequelize = new Sequelize(config)
  }
  return sequelize
}
