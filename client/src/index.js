import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import {io} from 'socket.io-client'

// Creating a socket.io client to implement a WebSocket protocol between the server and the client
export const socket = io('/', {
  transports: ['websocket']
})

ReactDOM.createRoot(document.getElementById('root')).render(<App/>)
