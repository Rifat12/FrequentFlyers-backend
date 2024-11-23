function buildSearchParams(requestBody) {
  //destructure the search request params here
  const {
    tripId,
    origin,
    destination,
    departureDate,
    returnDate,
    adults,
    children,
    infants,
    travelClass,
    tripType,
  } = requestBody;

  // Validate tripId is present
  if (!tripId) {
    throw new Error("tripId is required for flight search");
  }

  // Validate tripId is a number
  if (typeof tripId !== "number" && !Number.isInteger(parseInt(tripId))) {
    throw new Error("tripId must be a valid number");
  }

  let fromTo = [{ from: origin, to: destination, departureDate }];
  if (tripType == "return") {
    fromTo.push({ from: destination, to: origin, departureDate: returnDate });
  }
  return { tripId, fromTo, adults, children, infants, travelClass };
}

const simplifyFlightData = (rawData) => {
  if (!rawData?.data?.data || !rawData?.data?.dictionaries) return [];

  const { locations, carriers, aircraft } = rawData.data.dictionaries;

  return rawData.data.data.map((offer) => {
    const { id, itineraries, price, validatingAirlineCodes } = offer;
    const flights = itineraries?.[0]?.segments.map((segment) => ({
      departure: {
        airportCode: segment.departure.iataCode,
        airportName: locations?.[segment.departure.iataCode]?.cityCode || "Unknown",
        time: segment.departure.at,
      },
      arrival: {
        airportCode: segment.arrival.iataCode,
        airportName: locations?.[segment.arrival.iataCode]?.cityCode || "Unknown",
        time: segment.arrival.at,
      },
      carrier: {
        code: segment.carrierCode,
        name: carriers?.[segment.carrierCode] || "Unknown",
      },
      flightNumber: segment.number,
      aircraft: {
        code: segment.aircraft?.code,
        name: aircraft?.[segment.aircraft?.code] || "Unknown",
      },
      duration: segment.duration,
    }));

    return {
      offerId: id,
      airline: {
        code: validatingAirlineCodes?.[0],
        name: carriers?.[validatingAirlineCodes?.[0]] || "Unknown",
      },
      totalPrice: price.grandTotal,
      currency: price.currency,
      flight_segments: flights,
    };
  });
};


module.exports = { buildSearchParams, simplifyFlightData };
