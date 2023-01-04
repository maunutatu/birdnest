// Modeling MONGODB objects for drone observations with Mongoose library.

const mongoose = require('mongoose')

// Schema for a drone observation
const droneSchema = new mongoose.Schema({
  serialNumber: {type: String, required: true},
  closestDistanceFromNest: {type: Number, required: true},
  spottedTheLatest: {type: String, required: true},
  name: String,
  phoneNumber: String,
  email: String
})

// Modifying toJson method
droneSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Drone', droneSchema)
