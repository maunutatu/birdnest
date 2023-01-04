import './index.css'
import {useState} from 'react'
import Dronelist from './components/Dronelist'
import {socket} from './index'

const App = () => {
  // The state of the drones is maintained with a State Hook
  const [drones, setDrones] = useState([])

  // Client's drone observations are updated when it receives data from the server via WebSocket
  socket.on('receive-drones', (newDrones) => {
    setDrones(newDrones)
  })

  return (
    <div className={'container'}>
      <h1>Birdnest</h1>
      <h2>Exposing pilots whom threaten our beloved Monadikuikka</h2>
      {drones.length !== 0 ? <Dronelist drones={drones}/> : <p>loading...</p>}
    </div>
  )
}

export default App