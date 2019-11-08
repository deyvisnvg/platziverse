'use strict'

const agentFixture = require('./agent')

const metric = {
  id: 1,
  agentId: agentFixture.single.id,
  type: 'scanner',
  value: 3200,
  createdAt: new Date(),
  updatedAt: new Date()
}

const metrics = [
  metric,
  extend(metric, { id: 2, agentId: 1, type: 'impresora', value: 500 }),
  extend(metric, { id: 3, agentId: 1, type: 'impresora', value: 500 }),
  extend(metric, { id: 4, agentId: 2, type: 'computadora', value: 3400 }),
  extend(metric, { id: 5, agentId: 1, type: 'mouse', value: 60 }),
  extend(metric, { id: 6, agentId: 2, type: 'parlantes', value: 200 })
]

function extend (obj, values) {
  const clone = Object.assign({}, obj)
  return Object.assign(clone, values)
}
// console.log(agentFixture.all[])

module.exports = {
  single: metric,
  all: metrics,
  byUuid: uuid => {
    const type = metrics.filter(a => a.agentId === agentFixture.byUuid(uuid).id).map(m => m.type)
    return type.filter((elem, pos) => type.indexOf(elem) === pos) // 'elem' es cada uno de los elementos del array // 'pos' es la posición del array de cada elemento [0,1,2]
  },
  byTypeUuid: (type, uuid) => metrics.filter(a => a.type === type && a.agentId === agentFixture.byUuid(uuid).id)

  // byTypeUuid: (type, uuid) => {
  //   return metrics.filter(a => a.type === type && a.agentId === agentFixture.byUuid(uuid).id).map(m => ({
  //     id: m.id,
  //     type: m.type,
  //     value: m.value,
  //     createdAt: m.createdAt
  //   }))
  //     .sort((a, b) => b.createdAt - a.createdAt) // Por defecto, el método sort () ordena los valores como cadenas en orden alfabético y ascendente. // b-a = Ordenar números en una matriz en orden descendente
  //     .slice(0, 20) // El método slice () devuelve los elementos seleccionados en una matriz, como un nuevo objeto de matriz.
  // }

}

/*
El método filter () crea una matriz llena de todos los elementos de la matriz que pasan una prueba (proporcionada como una función).
Nota: filter () no ejecuta la función para elementos de matriz sin valores.

El método indexOf () ===> busca en la matriz el elemento especificado y devuelve su posición.
La búsqueda comenzará en la posición especificada, o al principio si no se especifica una posición de inicio, y finalizará la búsqueda al final de la matriz.
Devuelve -1 si no se encuentra el artículo.

Si el elemento está presente más de una vez, el método indexOf devuelve la posición de la primera ocurrencia.
*/
