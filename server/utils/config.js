require('dotenv').config()

// Port and URLs are fetched from environmental data

const PORT = process.env.PORT

const PILOTADDRESS = process.env.PILOTADDRESS

const DRONEADDRESS = process.env.DRONEADDRESS

const MONGODB_URI = process.env.MONGODB_URI

module.exports = {PORT, PILOTADDRESS, DRONEADDRESS, MONGODB_URI}