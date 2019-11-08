'use strict'

const debug = require('debug')('platziverse:mqtt')
const mosca = require('mosca')
// const redis = require('redis')
const mongo = require('mongoose')
const chalk = require('chalk')

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

const server = new mosca.Server(settings)

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

server.on('error', handleFatalError)

function handleFatalError (err) {
  console.error(`${chalk.red('[fatal error]')} ${err.message}`)
  console.error(err.stack)
  process.exit(1)
}

process.on('uncaughtException', handleFatalError)
process.on('unhandledRejection', handleFatalError)

server.on('ready', () => {
  console.log(`${chalk.green('[platziverse-mqtt]')} server is running`)
  // console.log("Activo")
})
