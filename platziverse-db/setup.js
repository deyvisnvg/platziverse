'use strict'

const debug = require('debug')('platziverse:db:setup') // Aqui le digo que muestre específicamente en que modulo o archivo estoy haciendo debug // El modulo de debug me permite tener mensajes de logs que yo voya a imprimir en pantalla, siempre en cuando yo tenga una variable de entorno configurada
const inquirer = require('inquirer')// Es un modulo que nos permite hacer preguntas en la consola para tomar decisiones
const chalk = require('chalk')// Me permite estilizar string para darle color y estilo
const db = require('./')

const prompt = inquirer.createPromptModule()// Este objeto de 'prompt' es el que me va ha permitir hacer preguntas al usuario cada vez que yo necesite, y esas preguntas son promesas

async function setup () {
  const answer = await prompt([
    {
      type: 'confirm', // Tipo de pregunta
      name: 'setup', // En 'setup' aquí se guarda la respuesta del usuario
      message: 'Esto va ha destruir la Base de Datos. Esta seguro?' // Pregunta formulada
    }
  ])

  if (!answer.setup) {
    return console.log('Nothing happened! :)') // con retur termina si la respuesta en setup en 'no', negación
  }

  const config = {
    database: process.env.DB_NAME || 'platziverse', // Vamos a pasar valores como si fueran variables de entorno por defecto
    username: process.env.DB_USER || 'platzi',
    password: process.env.DB_PASS || 'platzi',
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres', // Es una propiedad de sequelite que es el dialecto. Si n algun momento deseamos migrar a mysql, simplement cambiar este dialecto.
    logging: s => debug(s),
    setup: true
  }

  await db(config).catch(handleFatalError)

  console.log('Success!')
  process.exit(0)
}

function handleFatalError (err) {
  console.error(`${chalk.red('[fatal error]')} ${err.message}`) // Imprimimos el mensaje de error
  console.error(err.stack) // Imprimimos el tipo de error que esta ocurriendo
  process.exit(1) // Matamos el proceso retornando un código 1, que es un código de error
}

setup()
