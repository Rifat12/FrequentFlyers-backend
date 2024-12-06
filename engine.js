const express = require("express");
const { flightSearch } = require("./services/flightSearch");
const { searchAirports, getAirportByIata } = require("./services/airportSearch");
const flightBookingService = require("./services/flightBooking");

async function search(args) {
  const response = {
    success: true,
    responseType: "flight-search",
    params: args,
    data: await flightSearch(args),
  };
  return response;
}

async function book(args) {
  const { tripId, passengerInfo, flightOfferInfo } = args;
  
  try {
    const bookingResult = await flightBookingService.bookFlight(
      tripId,
      passengerInfo,
      flightOfferInfo
    );
    
    return {
      success: true,
      responseType: "flight-booking",
      data: bookingResult
    };
  } catch (error) {
    throw new Error(`Booking failed: ${error.message}`);
  }
}

async function searchAirport(query) {
  const response = {
    success: true,
    responseType: "airport-search",
    data: await searchAirports(query),
  };
  return response;
}

async function getAirport(iata) {
  const response = {
    success: true,
    responseType: "airport-details",
    data: await getAirportByIata(iata),
  };
  return response;
}

module.exports = {
  search,
  book,
  searchAirport,
  getAirport,
};
