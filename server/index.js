const app = require('./app')
const http = require('http')
const config = require('./utils/config')
const logger = require('./utils/logger')
const fetchDrones = require('./utils/fetchDrones')

// Backend is built on top NodeJS
const server = http.createServer(app)

// Creating a socket.io server to implement a WebSocket protocol between server and the client
const io = require('socket.io')(server, {
  transports: ['websocket']
})

io.on('connection', () => {
  logger.info('Connected to a client')
})

// Polling Reaktor's server for new drone observations. No Websockets or SSE enabled on Reaktor's side.
// Data is sent to all connected clients
setInterval(async () => {
  const drones = await fetchDrones()
  if(drones) {
    io.emit("receive-drones", drones)
  }
}, 2000)

// Server waits for queries
const port = config.PORT || 8080
server.listen(port, () => {
  logger.info(`Server running on port ${port}`)
})