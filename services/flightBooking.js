const db = require('../models');
const { v4: uuidv4 } = require('uuid');

class FlightBookingService {
  generatePNR() {
    // Generate a 6 character alphanumeric PNR
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  generateTicketNumber() {
    // Generate a 13 digit ticket number
    // First 3 digits: airline code (dummy: 999)
    // Last 10 digits: random numbers
    const airlinePrefix = '999';
    const randomNum = Math.floor(Math.random() * 10000000000).toString().padStart(10, '0');
    return airlinePrefix + randomNum;
  }

  validatePassengers(passengers) {
    if (!Array.isArray(passengers)) {
      throw new Error('Passengers must be an array');
    }

    console.log(passengers);

    passengers.forEach(passenger => {
      if (!passenger.firstName || !passenger.lastName || !passenger.dateOfBirth || 
          !passenger.gender || !passenger.nationality || !passenger.travelerType) {
        throw new Error('Missing required passenger information');
      }
    });
  }

  async bookFlight(tripId, passengerInfo, flightOfferInfo) {
    try {
      // Validate inputs
      if (!tripId || !passengerInfo || !flightOfferInfo) {
        throw new Error('Missing required booking information');
      }

      this.validatePassengers(passengerInfo);

      // Generate booking references
      const pnr = this.generatePNR();
      const ticketNo = this.generateTicketNumber();

      // Store in database
      const bookedFlight = await db.flightOffer.create({
        tripId,
        offer: JSON.stringify(flightOfferInfo),
        pnr,
        ticketNo,
        passengers: JSON.stringify(passengerInfo)
      });

      return {
        success: true,
        message: 'Flight booked successfully',
        data: {
          bookingId: bookedFlight.flightID,
          pnr,
          ticketNo,
          tripId,
          flightDetails: flightOfferInfo
        }
      };

    } catch (error) {
      throw new Error(`Flight booking failed: ${error.message}`);
    }
  }
}

module.exports = new FlightBookingService();
