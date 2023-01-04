// utils
const fetchDrones = require('./utils/fetchDrones')
const config = require('./utils/config')
const logger = require('./utils/logger')

// express
const express = require('express')
const app = express()

// Mongoose library is used for communication between MongoDB and the server
const mongoose = require('mongoose')

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MONGODB')
  })
  .catch((error) => {
    logger.error('error connecting to MONGODB', error.message)
  })

// cors
const cors = require('cors')
app.use(cors())

// Morgan for logging incoming http requests for debugging
const morgan = require('morgan')
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :req[header]'))

// Filtered drone data is fetchable for testing purposes
app.get('/api/drones', async (request, response) => {
  const data = await fetchDrones()
  response.status(200).json(data)
})

// Serving static files
app.use(express.static('build'))

module.exports = app