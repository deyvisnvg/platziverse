'use strict'

// var data = null;

// function prueba() {
//     if (data) {
//         console.log('esta vacío');
//     } else {
//         console.log('No esta vacío');
//     }
// }

const setupDatabase = require('./lib/db')
const setupAgentModel = require('./models/agent')
const setupMetricModel = require('./models/metric')
const defaults = require('defaults')
const setupAgent = require('./lib/agent')
const setupMetric = require('./lib/metric')

module.exports = async config => {
  config = defaults(config, { // Aqui decimos que todo lo que venga en el objeto de configuración lo vamos a obtener y si estas propiedades no estan definidas tome estas por defecto
    dialect: 'sqlite', // utiliza una base de datos en memoria como sqlite
    pool: { // Manejo de 'pool', 'pool' automáticamente va ha crear un pool de conexiones en caso tengamos varios usuarios accediendo a la DB
      max: 10, // máximo de conexiones
      min: 0, // mínimo de conexiones
      idle: 10000 // Si la conexion no pasa nada en 10seg  el lo va ha sacar del pool de conexiones
    },
    query: { // Aqui le digo que me entregue objetos .JSON sencillos, por que sequelize por defecto entrega objetos complejos donde tiene varias funciones por las cuales yo puedo obtener propiedades, actualizar la instancia, etc
      raw: true
    }
  })

  const sequelize = setupDatabase(config)
  const AgentModel = setupAgentModel(config)
  const MetricModel = setupMetricModel(config)

  AgentModel.hasMany(MetricModel) // El modelo de agente 'tiene muchas' métricas
  MetricModel.belongsTo(AgentModel) // El modelo de métrica 'pertenece a' un agente

  await sequelize.authenticate() // Validamos que la base de datos esta bien configurada, para verificar si hay una conexion directa con la base de datos

  if (config.setup) { // Si la configuracion tiene la propiedad de setup lista, lo que voya hacer es crear la base de datos en nuestro servidor.
    await sequelize.sync({ force: true }) // 'force:true' ->  siginifica si la base de datos existe borrela y crea una nueva.
  }

  const Agent = setupAgent(AgentModel)
  const Metric = setupMetric(MetricModel, AgentModel)

  return {
    Agent,
    Metric
  }
}
