const searchutils = require("../utils/searchUtils.js");
const flightOffersSearchRQ = require("../requests/flightOffersSearchRQ.js");

async function flightSearch(params) {
  const searchParams = searchutils.buildSearchParams(params);
  console.log("searchParams", searchParams);
  
  // Extract tripId before sending to Amadeus
  const { tripId, ...amadeuParams } = searchParams;
  
  const searchRes = await flightOffersSearchRQ(amadeuParams);
  const simpliefiedRes = searchutils.simplifyFlightData(searchRes);
  
  // Add tripId to the response
  return {
    tripId: tripId,
    simpliefiedRes,
  };
}

module.exports = { flightSearch };
