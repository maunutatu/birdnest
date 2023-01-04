import {fetchBackEndDataForTesting, fetchValidDronesForTesting} from '../support/commands'

describe('Birdnest', function() {

  beforeEach(function() {
    cy.visit(Cypress.env('websiteaddress'))
    cy.wait(2000)
  })

  it('All new observations in the NDZ are shown', function () {
    // Function returns a list of new drone observations. These should be found in the UI
    fetchValidDronesForTesting().then(drones => {
      // Looping through new observations and checking that they are found in the user interface
      for (let drone of drones) {
        // A drone does not always have pilot information
        if(drone.name) cy.contains(drone.name)
      }
    })
  })

  it('All backend data is shown on the client', function () {
    // Function returns a list of all drone observations breaking the NDZ inside 10 minutes
    fetchBackEndDataForTesting().then(drones => {
      //  Looping through observations and checking that they are found in the user interface
      for (let drone of drones) {
        // A drone does not always have pilot information
        if(drone.name) cy.contains(drone.name)
      }
    })
  })

})