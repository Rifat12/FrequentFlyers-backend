//fetch sender here
const sender = require("../utils/sender");
const getToken = require("../services/OAuth");

async function flightOffersSearchRQ(params) {
  const apiVersion = "v2";
  const endPoint = "shopping/flight-offers";
  const reqType = "flightOffersSearch";
  const httpMethod = "POST";
  const body = buildFlightOffersRQBody(params);
  const token = await getToken.OAuth();
  const headersData = {
    Authorization: `Bearer ${token}`,
  };

  const searchRes = await sender.sendRequest(
    apiVersion,
    endPoint,
    reqType,
    httpMethod,
    body,
    headersData
  );

  return searchRes;
}

function buildFlightOffersRQBody(params) {
  // Prepare originDestinations array
  let originDestinations = params.fromTo.map((item, index) => {
    return {
      id: (index + 1).toString(),
      originLocationCode: item.from,
      destinationLocationCode: item.to,
      departureDateTimeRange: {
        date: item.departureDate,
        time: index === 0 ? "10:00:00" : "17:00:00",
      },
    };
  });

  // Prepare travelers array
  let travelers = [];
  if (params.adults > 0) {
    travelers.push({
      id: "1",
      travelerType: "ADULT",
      fareOptions: ["STANDARD"],
    });
  }
  if (params.children > 0) {
    travelers.push({
      id: "2",
      travelerType: "CHILD",
      fareOptions: ["STANDARD"],
    });
  }
  if (params.infants > 0) {
    travelers.push({
      id: "3",
      travelerType: "INFANT",
      fareOptions: ["STANDARD"],
    });
  }

  // Prepare final request body
  let requestBody = {
    currencyCode: "USD",
    originDestinations: originDestinations,
    travelers: travelers,
    sources: ["GDS"],
    searchCriteria: {
      maxFlightOffers: 2,
      flightFilters: {
        cabinRestrictions: [
          {
            cabin: params.travelClass,
            coverage: "MOST_SEGMENTS",
            originDestinationIds: ["1"],
          },
        ],
        carrierRestrictions: {
          excludedCarrierCodes: ["BS", "BG"],
        },
      },
    },
  };

  return requestBody;
}

module.exports = flightOffersSearchRQ;
