import axios from 'axios'
import DOMParser from 'dom-parser'

// Fetching drone information for testing. Returns an array containing new observations
async function fetchValidDronesForTesting() {
  try {

    // Data on new observations is fetched using the Axios library.
    const response = await axios.get(Cypress.env('droneaddress'))

    // Returned XML data is parsed using dom-parser library
    const parser = new DOMParser()
    const data = parser.parseFromString(response.data.toString(), 'text/xml')

    // Extracting time of the snapshot
    const time = data.getElementsByTagName('capture')[0].getAttribute('snapshotTimestamp')

    // Latest drone observations
    const drones = data.getElementsByTagName('drone')

    let droneArray = []

    // Transforming drone data from XML to an array
    for (let drone of drones) {

      const serialNumber = drone.getElementsByTagName('serialNumber')[0].childNodes[0].textContent

      // Calculating distance from the nest using Pythagorean theorem
      const xCoordinate = drone.getElementsByTagName('positionX')[0].childNodes[0].textContent
      const yCoordinate = drone.getElementsByTagName('positionY')[0].childNodes[0].textContent
      const distanceFromNest = Math.sqrt(Math.pow((xCoordinate-250000),2) + Math.pow((yCoordinate-250000),2))

      // Drone gets added to the array only if it's in the no-fly-zone
      if (distanceFromNest <= 100000) {

        // Pilot information is fetched with helper function fetchPilots
        const pilotInformation = await fetchPilotsForTesting(serialNumber)

        // Drone information is assembled to an object
        const droneInformation = {serialNumber: serialNumber,
          closestDistanceFromNest: distanceFromNest,
          spottedTheLatest: time}

        // Pilot and drone information objects are merged into one object
        const droneObject = {...pilotInformation, ...droneInformation}

        droneArray.push(droneObject)
      }
    }

    // An array of the drones is returned for testing
    return droneArray
  } catch (error) {
    console.error('Server failed to provide drone information')
  }
}

// Function for fetching pilot information. Returns an object containing pilot information
async function fetchPilotsForTesting (serialNumber) {
  try {
    // Data is fetched using the Axios library
    const response = await axios.get(`${Cypress.env('pilotaddress')}/${serialNumber}`)
    const data = response.data

    // The returned JSON data is transformed to an object and returned
    return {name: `${data.firstName.toString()} ${data.lastName.toString()}`, phoneNumber: data.phoneNumber.toString(), email: data.email.toString()}
  } catch (err) {
    // In some cases, the server responds with a 404, meaning that there is no pilot information and an empty object is returned
    return {}
  }
}

// Fetching website api for an array of drones and returning it
async function fetchBackEndDataForTesting() {
  try {
    const response = await axios.get(Cypress.env('websiteaddress') + 'api/drones')
    return response.data
  } catch (err) {
    console.error('Failed to fetch data', err.message)
  }
}

module.exports = {fetchValidDronesForTesting, fetchBackEndDataForTesting}