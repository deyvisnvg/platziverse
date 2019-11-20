'use strict'

const debug = require('debug')('platziverse:mqtt')
const mosca = require('mosca')
// const redis = require('redis')
const mongo = require('mongoose')
const chalk = require('chalk')
const db = require('platziverse-db')
const { configuration } = require('platziverse-utils')

// const backend = {
//   type: 'redis',
//   redis,
//   return_buffers: true
// }
const backend = {
  type: 'mongoose',
  url: 'mongodb+srv://db_user_platzinodejs:baEsdbcl2zC0k0Nd@cluster0-seudv.mongodb.net/test2?retryWrites=true&w=majority',
  // redis,
  mongo,
  return_buffers: true
}

const settings = {
  port: 1883,
  backend
}

const config = configuration(false) // El setup es falso //Revisar el módulo platziverse-utils

const server = new mosca.Server(settings)

let Agent, Metric

server.on('clientConnected', client => {
  debug(`Client Connected: ${client.id}`)
})

server.on('clientDisconnected', client => {
  debug(`Client Disconnected: ${client.id}`)
})

server.on('published', (packet, client) => {
  debug(`Received: ${packet.topic}`) // 'topic' viene siendo el tipo de mensaje en este caso sería agent/connected, agent/disconnected
  debug(`Payload: ${packet.payload}`) // Esa informacion que va ser enviada va ha venir en el payload
})

server.on('ready', async () => {

  const services = await db(config).catch(handleFatalError) // Cuando el servidor esta listo yo instancio mi Base de Datos

  Agent = services.Agent
  Metric = services.Metric
  
  console.log(`${chalk.green('[platziverse-mqtt]')} server is running`)
  // console.log("Activo")
})

server.on('error', handleFatalError)

process.on('uncaughtException', handleFatalError)
process.on('unhandledRejection', handleFatalError)

function handleFatalError (err) {
  console.error(`${chalk.red('[fatal error]')} ${err.message}`) // Imprimimos el mensaje de error
  console.error(err.stack) // Imprimimos el tipo de error que esta ocurriendo
  process.exit(1) // Matamos el proceso retornando un código 1, que es un código de error
}


/*
OJO: 
Referenciamos a platziverse-db desde el package.json para poder requerirlo desde aquí.

*/