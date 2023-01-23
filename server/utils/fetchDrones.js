const axios = require('axios')
const config = require('./config')
const DOMParser = require('dom-parser')
const logger = require('../utils/logger')
const fetchPilots = require('./fetchPilots')
const Drone = require('../models/drone')

// Function for fetching latest drone data from the server, filtering previous data and providing an array with correct observations.
async function fetchDrones() {
  try {

    // Old drone observations fetched from MongoDB
    const oldDrones = await Drone.find({})

    // Previous data gets filtered from too old observations
    // New drone observations are added to the filtered previous drone observations

    for (let oldDrone of oldDrones) {

      // If the drone was last seen over 10 minutes ago, it is removed from the array

      // Javascript Date compares time using the number of milliseconds since 1 January 1970

      const compareTime = Date.now() - Date.parse(oldDrone.spottedTheLatest)
      if (compareTime >= 600000) {
        // Drone gets deleted from the MongoDB database
        await Drone.findByIdAndDelete(oldDrone.id)
      }
    }

    // Data on new observations is fetched using the Axios library.
    const response = await axios.get(config.DRONEADDRESS)

    // Returned XML data is parsed using dom-parser library
    const parser = new DOMParser()
    const data = parser.parseFromString(response.data.toString(), 'text/xml')

    // Extracting time of the snapshot
    const time = data.getElementsByTagName('capture')[0].getAttribute('snapshotTimestamp')

    // Latest drone observations
    const drones = data.getElementsByTagName('drone')

    // Transforming drone data from XML to MongoDB

    for (let drone of drones) {

      const serialNumber = drone.getElementsByTagName('serialNumber')[0].childNodes[0].textContent

      // Calculating distance from the nest using Pythagorean theorem
      const xCoordinate = drone.getElementsByTagName('positionX')[0].childNodes[0].textContent
      const yCoordinate = drone.getElementsByTagName('positionY')[0].childNodes[0].textContent
      const distanceFromNest = Math.sqrt(Math.pow((xCoordinate-250000),2) + Math.pow((yCoordinate-250000),2))

      // Drone gets added to MongoDB only if it's in the no-fly-zone
      if (distanceFromNest <= 100000) {

        // Pilot information is fetched with helper function fetchPilots
        const pilotInformation = await fetchPilots(serialNumber)

        // Drone information is assembled to an object
        const droneInformation = {serialNumber: serialNumber,
          closestDistanceFromNest: distanceFromNest,
          spottedTheLatest: time}

        // Pilot and drone information objects are merged into one object
        const droneObject = {...pilotInformation, ...droneInformation}

        // If the drone was previously spotted inside 10 minutes, the old observation data gets written over. If not, it's a new observation and is added to MongoDB
        if (oldDrones.map(drone => drone.serialNumber).includes(serialNumber)) {

          const indexOfOldObject = oldDrones.map(drone => drone.serialNumber).indexOf(serialNumber)

          // Checking if the new observation was closer to the nest than the previous one
          if (oldDrones[indexOfOldObject].closestDistanceFromNest >= distanceFromNest) {
            // If the new observation was closer than a previous one, the distance and time of the observation are updated
            await Drone.findOneAndUpdate({serialNumber: serialNumber}, {closestDistanceFromNest: distanceFromNest, spottedTheLatest: time}, {new: true, runValidators: true, context: 'query'})
          } else {
            // If not, only time of the observation is updated
            await Drone.findOneAndUpdate({serialNumber: serialNumber}, {spottedTheLatest: time}, {new: true, runValidators: true, context: 'query'})
          }
        } else {
          // A completely new observation is added to MONGODB
          await new Drone(droneObject).save()
        }
      }
    }
    // An array of the drones is returned from MONGODB for sending it to the client
    return await Drone.find({})
  } catch (error) {
    logger.info('Server failed to provide drone information', error.message)
  }
}

module.exports = fetchDrones