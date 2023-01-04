const axios = require('axios')
const config = require('./config')

// Function for fetching pilot information. Returns an object containing pilot information
async function fetchPilots (serialNumber) {
  try {
    // Data is fetched using the Axios library
    const response = await axios.get(`${config.PILOTADDRESS}/${serialNumber}`)
    const data = response.data

    // The returned JSON data is transformed to an object and returned
    return {name: `${data.firstName.toString()} ${data.lastName.toString()}`, phoneNumber: data.phoneNumber.toString(), email: data.email.toString()}
  } catch (err) {
    // In some cases, the server responds with a 404, meaning that there is no pilot information and an empty object is returned
    return {}
  }
}

module.exports = fetchPilots