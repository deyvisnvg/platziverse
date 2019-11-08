'use strict'

// Aquí vamos a empezar a ver la estructura de como van a ser nuestros servicios
// y como vamos a retornar los servicios desde el módulo principal

module.exports = function setupAgent (AgentModel) {
  async function createOrUpdate (agent) { // 'agent' es el objeto clonado, pasado como parámetro
    const cond = {
      where: {
        uuid: agent.uuid
      }
    }

    const existingAgent = await AgentModel.findOne(cond)

    if (existingAgent) {
      const update = await AgentModel.update(agent, cond) // 'agent' es el objeto clonado que le pasamos como parámetro
      return update ? AgentModel.findOne(cond) : existingAgent // Esto me va ha decir, si yo la actualizé esto me va ha retornar un número de filas que actualizó, entonces voya a retornar esa instancia de la DB para que me obtenga la información directamente de la DB y no el objeto de javascript, Caso contrario si no la actualizó yo retorno el agente existente.
    }

    const result = await AgentModel.create(agent)
    return result.toJSON()
  }

  function findByUuid (uuid) {
    return AgentModel.findOne({
      where: {
        uuid
      }
    })
  }

  function findAll () {
    return AgentModel.findAll()
  }

  function findConnected () {
    return AgentModel.findAll({
      where: {
        connected: true
      }
    })
  }

  function findByUsername (username) {
    return AgentModel.findAll({
      where: {
        username,
        connected: true
      }
    })
  }

  function findById (id) {
    return AgentModel.findById(id) // El modelo 'AgentModel' con sequelize ya tiene una función llamada con findById, ahora simplemente vamos a retornarlo
  }
  return {
    createOrUpdate,
    findById,
    findByUuid,
    findAll,
    findConnected,
    findByUsername
  }
}
