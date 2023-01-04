import Grid from '@mui/material/Unstable_Grid2'
import DroneCard from './DroneCard'

// Component responsible for showing drones breaking the NDZ

const Dronelist = ({drones}) => {

  // Sorts drones by the closest distance from the nest in an ascending fashion
  function sortByDistance(x, y) {
    if (x.closestDistanceFromNest && y.closestDistanceFromNest) {
      return x.closestDistanceFromNest - y.closestDistanceFromNest
    } else {
      return 1
    }
  }

  // Uses material-ui Grid component
  // DroneCard component is responsible for rendering each information card
  return (
    <div>
      <Grid container spacing={2} justifyContent={'center'} alignItems={'center'} >
        {drones.map(drones => drones).sort(sortByDistance).map(drone =>
          <Grid key={drone.serialNumber}>
            <DroneCard drone={drone}/>
          </Grid>
        )}
      </Grid>
    </div>
  )
}

export default Dronelist