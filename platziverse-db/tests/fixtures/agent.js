'use strict'

const agent = {
  id: 1,
  uuid: 'yyy-yyy-yyy',
  name: 'fixture',
  username: 'platzi',
  hostname: 'test-host',
  pid: 0,
  connected: true,
  createdAt: new Date(),
  updatedAt: new Date()
}

const agents = [
  agent,
  extend(agent, { id: 2, uuid: 'yyy-yyy-yyw', name: 'fixture', connected: false, username: 'test' }),
  extend(agent, { id: 3, uuid: 'yyy-yyy-yyx', name: 'fixture', connected: false }),
  extend(agent, { id: 4, uuid: 'yyy-yyy-yyz', name: 'fixture', username: 'test' })

]

function extend (obj, values) { // Esto va extender un objeto y le va aplicar los siguiente valores; es decir sobreescribir un objeto clonarlo y reemplazarle ciertos valores
  const clone = Object.assign({}, obj) // hacemos un clon de ese objeto con 'Object.assing', le decimos que a ese objeto vacío vamos a aplicarle todas las propiedades que tiene el objeto que vamos a querer clonar.
  return Object.assign(clone, values) // retornamos para que no modifique la referencia original, le pasamos el clon y los valores que le estoy pasando.
}

module.exports = {
  single: agent,
  all: agents,
  connected: agents.filter(a => a.connected),
  platzi: agents.filter(a => a.username === 'platzi'),
  byUuid: id => agents.filter(a => a.uuid === id).shift(), // Ejecutamos shift para retornar solo el primer elemento
  byId: id => agents.filter(a => a.id === id).shift()
}

/*
Fixtures = Es un set de datos falsos o set de datos de pruebas.
*/
