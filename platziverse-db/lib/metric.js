'use stric'

/*
El servicio Agent lo que hace es reportar unas métricas cada cierto tiempo. Para implementar el servicio Metric
vamos a necesitar tres funciones asíncronas:

- create: Que va a recibir dos parámetros: el ID del agente y la métrica.
- findByAgentUuid: En el que vamos a hacer una consulta que va a buscar todas las métricas cuyo AgentId es igual al
- findByTypeAgentUuid: Que va a buscar por tipo de métrica y por AgentId.
*/
module.exports = function setupMetric (MetricModel, AgentModel) {
  async function findByAgentUuid (uuid) {
    return MetricModel.findAll({
      attributes: ['type'], // Para seleccionar ese atributo específico que quiero retornar
      group: ['type'], // Lo agrupamos por type
      include: [{ // Con include hacemos los join o la relación con la tabla
        atrributes: [],
        model: AgentModel, // La tabla o modelo con quien voya a relacionarlo o hacer el join
        where: { // Especificamos la uuid
          uuid
        }
      }],
      query: {
        raw: true // Que los query sean de tipo row es decir que me devuelvan objetos simples, la información en JSON()
      }
    })
  }

  async function findByTypeAgentUuid (type, uuid) {
    return MetricModel.findAll({
      atrributes: ['id', 'type', 'value', 'createdAt'],
      group: ['type'],
      where: { // filtro de búsqueda
        type
      },
      limit: 20, // Límite de registros que quiero que me muestre
      order: [['createdAt', 'DESC']], // Me muestre el registro por orden 'campode fecha' createdAt
      include: [{
        attributes: [],
        model: AgentModel,
        where: { // filtro de búsqueda
          uuid
        }
      }],
      query: {
        raw: true
      }
    })
  }

  async function create (uuid, metric) {
    const agent = await AgentModel.findOne({ where: { uuid } })

    if (agent) {
      // metric.AgentId = agent.uuid // De esta manera vamos a asignarle a nuestro objeto de metricas el id del agente (agent.id)
      Object.assign(metric, { agentId: agent.id }) // De esta manera vamos a asignarle a nuestro objeto de metricas el id del agente (agent.id)
      const result = await MetricModel.create(metric)
      return result.toJSON()
    }
  }

  return {
    create,
    findByAgentUuid,
    findByTypeAgentUuid
  }
}
