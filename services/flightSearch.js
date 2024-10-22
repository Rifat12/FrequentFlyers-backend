const searchutils = require("../utils/searchUtils.js");
const flightOffersSearchRQ = require("../requests/flightOffersSearchRQ.js");

async function flightSearch(params) {
  const searchParams = searchutils.buildSearchParams(params);
  console.log("searchParams", searchParams);
  const searchRes = await flightOffersSearchRQ(searchParams);
  return searchRes;
}

module.exports = { flightSearch };
