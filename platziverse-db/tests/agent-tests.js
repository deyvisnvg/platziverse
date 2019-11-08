'use strict'

const test = require('ava')
const sinon = require('sinon')
const proxyquire = require('proxyquire')
const agentFixtures = require('./fixtures/agent')

// Nosotros queremos verificar que el agente exista, este agente va ser la funcion que devuelva la configuración de mi DB,
// entonces necesitamos de alguna manera cada vez que ejecutamos un test, hacer una instancia de la DB para testearla.

const config = { // Yo no quiero que esto haga una conexion real a la DB, para ese caso voya a definir un parámetro de configuración para utilizar una base de datos en memoria como sqlite
  logging: function () {} // Aquí solo esta sobreescribiendo el valor de la propiedad logging, puedes ponerlo también en el defaults y así no es necesario definirlo, pero esto te permite para algunos test poner el valor de loggin en el valor que se necesite para un determinado test.
}

const MetricStub = { // Esto va ha representar al modelo de Metricas.
  belongsTo: sinon.spy() // Por ahora o solo en este caso en específico que sería el caso del agente, el unico metodo que yo tengo que crearlo como un Stubs sería el de 'belongsTo'
}

const single = Object.assign({}, agentFixtures.single)
const id = 1
const uuid = 'yyy-yyy-yyy'
const username = 'platzi'
let AgentStub = null // Esto representa el modelo de Agentes // Es un objeto falso que representa a nuestro módulo falso
let db = null
let sandbox = null

const uuidArgs = {
  where: { uuid } // uuid: uuid
}

const connectedArgs = {
  where: { connected: true }
}

const usernameArgs = {
  where: {
    username,
    connected: true
  }
}

const newAgent = {
  uuid: '123-123-123',
  name: 'test',
  username: 'test',
  hostname: 'test',
  pid: 0,
  connected: false
}

test.beforeEach(async () => { // Antes de cada uno de los test ejecuteme la siguiente funcion asincrona
  sandbox = sinon.createSandbox() // Le decimos a sinon que nos cree un sandbox

  AgentStub = { // Esto representa el modelo de Agentes
    hasMany: sandbox.spy()
  }

  // Model create Stub
  AgentStub.create = sandbox.stub()
  AgentStub.create.withArgs(newAgent).returns(Promise.resolve({
    toJSON () { return newAgent }
  }))
  // AgentStub.create = sandbox.stub()
  // AgentStub.create.withArgs(newAgent).returns(Promise.resolve({ toJSON () { return newAgent }}))

  // Model findOne - existing
  AgentStub.findOne = sandbox.stub()
  AgentStub.findOne.withArgs(uuidArgs).returns(Promise.resolve(agentFixtures.byUuid(uuid)))

  // Model findById Stub
  AgentStub.findById = sandbox.stub() // Aquí creamos a findById como un Stubs, esta función ya existe dentro de mi modelo.
  AgentStub.findById.withArgs(id).returns(Promise.resolve(agentFixtures.byId(id))) // Una vez creado findById, aquí le digo Sinon la función findById cuando yo la llame con el argumento 'id', usted me va ha retornar una promesa que cuando la resuelvas, va ha efectivamente a retornar 'agentFixtures.byId(id)'

  // Model update Stub
  AgentStub.update = sandbox.stub()
  AgentStub.update.withArgs(single, uuidArgs).returns(Promise.resolve(single))

  // Model findAll Stub
  AgentStub.findAll = sandbox.stub()
  AgentStub.findAll.withArgs().returns(Promise.resolve(agentFixtures.all))
  AgentStub.findAll.withArgs(connectedArgs).returns(Promise.resolve(agentFixtures.connected))
  AgentStub.findAll.withArgs(usernameArgs).returns(Promise.resolve(agentFixtures.platzi))

  const setupDatabase = proxyquire('../', { // Aqui vamos a sobreescribir el index
    './models/agent': () => AgentStub,
    './models/metric': () => MetricStub
  })

  db = await setupDatabase(config)
})

test.afterEach(() => {
  sandbox && sinon.resetHistory() // Aca lo que hacemos es: Si existe el sandbox, usted vuelva a recrear ese sandbox
})

test('Agente', t => {
  // console.log(t.truthy)
  t.truthy(db.Agent, 'Agent service should exist') // Aqui vamos hacer una ascepción de tipo 'truthy', que significa que existe un valor es decir que ese valor resuelve a verdadero, no necesariamente sea un booleano sino que no sea 0 o Vacío
})

test.serial('setup', t => { // El test serial es recomendado ya que estamos utilizando Stubs que estos test sean seriales para garantizar efectivamente que nuestro entorno de Stubs no esté saturado.
  t.true(AgentStub.hasMany.called, 'AgentStubs.hasMany was executed') // una vez que tengamos la prueba, vamos a garantizar que la función del AgentStubs que se llama hasMany fue llamada o ejecutada(called) // esta propiedad ejecutada me la va entregar el espía(sinon.spy)
  t.true(AgentStub.hasMany.calledWith(MetricStub), 'Argument should be the MetricModel')
  t.true(MetricStub.belongsTo.called, 'MetricStubs.belongsTo was executed')
  t.true(MetricStub.belongsTo.calledWith(AgentStub), 'Argument should be the AgentModel')
}) // Digamos que aca nosotros queremos probar el setup de la base de datos.

test.serial('Agent#findById', async t => { // Con esto implementamos la prueba
  const agent = await db.Agent.findById(id) // De esta manera voya a obtener el agente acá

  t.true(AgentStub.findById.called, 'findById should be called on model') // De esta manero garantizo que -> Aqui le digo que la función findById de mi modelo sea llamada o ejecutada
  t.true(AgentStub.findById.calledOnce, 'findById should be called Once') // De esta manero garantizo que -> Aqui le digo que debe ser llamada solo una ves
  t.true(AgentStub.findById.calledWith(id), 'findById should be called with specified id') // De esta manero garantizo que -> Yo específicamente para esta prueba, yo quiero que findById este llamada con el argumento que yo le pasé

  t.deepEqual(agent, agentFixtures.byId(id), 'shoul be the same') // Digamos que vamos a comparar que este agente que acabamos de obtener es igual al agentFixtures que yo obtengo con este mismo 'id'
})

test.serial('Agent#createOrUpdate - exist', async t => {
  const agent = await db.Agent.createOrUpdate(single)

  t.true(AgentStub.findOne.called, 'findOne should be called on model')
  t.true(AgentStub.findOne.calledTwice, 'findOnce shoud be called Twice')
  t.true(AgentStub.findOne.calledWith(uuidArgs), 'findOne should be called with specified uuid Args')
  t.true(AgentStub.update.called, 'update should be called')
  t.true(AgentStub.update.calledOnce, 'update should be called Once')
  t.true(AgentStub.update.calledWith(single), 'update should be called with specified Args')

  t.deepEqual(agent, single, 'agent should be the same')
})

test.serial('Agent#findByUuid', async t => {
  const agent = await db.Agent.findByUuid(uuid)

  t.true(AgentStub.findOne.called, 'findOne should be called on model')
  t.true(AgentStub.findOne.calledOnce, 'findOnce should be called once')
  t.true(AgentStub.findOne.calledWith(uuidArgs), 'findOne should be called with specified id')

  t.deepEqual(agent, agentFixtures.byUuid(uuid), 'agent should be the same')
})

test.serial('Agent#findAll', async t => {
  const agent = await db.Agent.findAll()

  t.true(AgentStub.findAll.called, 'findAll should be called on model')
  t.true(AgentStub.findAll.calledOnce, 'findAll should be called once')
  t.true(AgentStub.findAll.calledWith(), 'findAll should be called with specified')
  t.is(agent.length, agentFixtures.all.length, 'findAll should be the same amount')

  t.deepEqual(agent, agentFixtures.all, 'agent should be the same')
})

test.serial('Agent#findConnected', async t => {
  const agent = await db.Agent.findConnected()

  t.true(AgentStub.findAll.called, 'findAll should be called on model')
  t.true(AgentStub.findAll.calledOnce, 'findAll should be called once')
  t.true(AgentStub.findAll.calledWith(connectedArgs), 'findAll should be called with ')
  t.is(agent.length, agentFixtures.connected.length, 'agent should be the same amount')

  t.deepEqual(agent, agentFixtures.connected, 'agent should be the same')
})

test.serial('Agent#findByUsername', async t => {
  const agent = await db.Agent.findByUsername(username)

  t.true(AgentStub.findAll.called, 'findAll should be called on model')
  t.true(AgentStub.findAll.calledOnce, 'findAll should be called once')
  t.true(AgentStub.findAll.calledWith(usernameArgs), 'findAll should be called with username')

  t.deepEqual(agent, agentFixtures.platzi, 'platzi shoul be the same')
})

test.serial('Agent#createOrUpdate - new', async t => {
  const agent = await db.Agent.createOrUpdate(newAgent)

  t.true(AgentStub.findOne.called, 'findOne should be called on model')
  t.true(AgentStub.findOne.calledOnce, 'findOne should be called once')
  t.true(AgentStub.findOne.calledWith({
    where: { uuid: newAgent.uuid }
  }), 'findOne should be called with specified uiid Args')
  t.true(AgentStub.create.called, 'create should be called on model')
  t.true(AgentStub.create.calledOnce, 'create should be called once')
  t.true(AgentStub.create.calledWith(newAgent), 'create should be called with spcified newAgent Args')

  t.deepEqual(agent, newAgent, 'agent should be the same')
})

/*
Stubs = Es un objeto que es muy similar a mi objeto original que en este caso sería al modelo, osea que contiene
los métodos que nosotros vamos a necesitar para el modelo, pero que la respuesta y los argumentos de entrada estan
previamente especificadas con una librería o con una estrategia.
Básicamente lo que se va hacer son objetos falsos que se van a comportar muy similar a los objetos reales, lo que
queremos probar o garantizar en este momento es la prueba de agentes, es que nuestro servicio de agentes
efectivamente si esté llamando a las funciones del modelo de la base de datos.
Para ello vamos a utilizar una librería sinon.

No probamos directamente los modelos, es por que la librería sequelize ya tiene un set de pruebas que se encarga
de garantizar que estos métodos de los modelos funcionen, nosotros estamos probando nuestro API, nuestra implementación,
es por eso que abstraemos los modelos utilizando Stubs
*/
/*
Proxyquery es una utilidad que me permite hacer proxy osea requerir un módulo, pero sobreescribir los require que esa
aplicación esta haciendo y de esa manera yo voya a poder setear los Stubs
*/
/*
sinon.spy() = Es una función específica que me va ha permitir hacerle preguntas ej.: cuantas veces fue llamada esta function,
si fue llamado?, con que argumentos fueron llamados? y es muy util a la hora de hacer pruebas.
*/
/*
Sandbox = Un sandbox sería un ambiente específico de sinon que solo va ha funcionar para este caso en particular
y cuando terminos de ejecutar la prueba vamos a reiniciar el sandbox para que vuelva a arrancar desde el principio,
con el fin de que: Si nosotros queremos garantizar que una funcion fue llamada una vez; cuando terminemos de correr el test
resetiemos el estado de esos stubs y volvamos a correr un test diferente vuelva a aparecer desde cero o sino nos va ha decir
que esa función fue llamada mas de una vez.
*/
