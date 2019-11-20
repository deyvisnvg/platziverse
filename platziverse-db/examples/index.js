'use strict'

const chalk = require('chalk')
const db = require('../')

async function run() {
    const config = {
        database: process.env.DB_NAME || 'platziverse',
        username: process.env.DB_USER || 'platzi',
        password: process.env.DB_PASS || 'platzi',
        host: process.env.DB_HOST || 'localhost',
        dialect: 'postgres'
    }
    
    const { Agent, Metric } = await db(config).catch(handleFatalError)

    // Crear o Actualizar un registro - tabla Agents
    // const agent = await Agent.createOrUpdate({
    //     uuid: 'yyw',
    //     name: 'test',
    //     username: 'test',
    //     hostname: 'test',
    //     pid: 2,
    //     connected: false
    // }).catch(handleFatalError)

    // if (agent) {
    //     console.log('---agent---')
    //     console.log(agent) 
    // }

    // Listar el registro completo - tabla Agents
    // const agents = await Agent.findAll().catch(handleFatalError)
    // if (agents) {
    //     console.log('---agents---')
    //     console.log(agents) 
    // }

    // Listar un registro cuando "connected: true" - tabla Agents
    // const agentConnec = await Agent.findConnected().catch(handleFatalError)
    // if (agentConnec) {
    //     console.log('---agentConnec---')
    //     console.log(agentConnec)
    // }

    // Crear un registro de Metricas - relacionado con su Agent
    // const metricCreate = await Metric.create('yyw', {
    //     type: 'memory',
    //     value: 300
    // }).catch(handleFatalError)

    // if (metricCreate) {
    //     console.log('---metricCreate---')
    //     console.log(metricCreate)
    // }

    // Listar un registro de metricas cuando la uuid de Agent sea igual a: xxx
    // const metric = await Metric.findByAgentUuid('yyy').catch(handleFatalError)
    // if (metric) {
    //     console.log('---metric---')
    //     console.log(metric)
    // }

    //Listar el registro de Metricas cuando "type: xxx and agent.uuid: xxx"
    const metricAll = await Metric.findByTypeAgentUuid('memory', 'yyw').catch(handleFatalError)
    if (metricAll) {
        console.log('---metricAll---')
        console.log(metricAll)
    }
    
}

function handleFatalError(err) {
    console.log(`${chalk.red('[fatal error]')} ${err.message}`) // Imprimimos el mensaje de error
    console.log(err.stack) // // Imprimimos el tipo de error que esta ocurriendo
    process.exit(1) // Matamos el proceso retornando un código 1, que es un código de error
}

run()