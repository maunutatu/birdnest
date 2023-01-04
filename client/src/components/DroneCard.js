import {Card, CardContent, Typography} from '@mui/material'
import EmailIcon from '@mui/icons-material/Email'
import LocalPhoneIcon from '@mui/icons-material/LocalPhone'

// Component responsible for rendering a single drone card in the Dronelist

const DroneCard = ({drone}) => {

  // Built using material-ui components
  return (
    <Card sx={{maxWidth: 300}}>
      <CardContent>
        <Typography variant={'h6'}>
          {Math.floor(drone.closestDistanceFromNest / 1000)}m
        </Typography>
        <Typography variant={'caption'}>
          Closest confirmed distance from the nest
        </Typography>
        <Typography variant={'body1'}>
          {drone.name}
        </Typography>
        <Typography variant={'body2'}>
          <EmailIcon/> {drone.email}
          <br/>
          <LocalPhoneIcon/> {drone.phoneNumber}
        </Typography>
      </CardContent>
    </Card>
  )
}

export default DroneCard