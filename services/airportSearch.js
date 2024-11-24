const NodeCache = require('node-cache');
const axios = require('axios');
const Fuse = require('fuse.js');

const cache = new NodeCache({ stdTTL: 86400 });
let airports = null;
let fuseIndex = null;
const AIRPORTS_URL = 'https://raw.githubusercontent.com/mwgg/Airports/refs/heads/master/airports.json';

async function initialize() {
  try {
    airports = cache.get('airports');
    if (!airports) {
      console.log('Fetching airports data...');
      const response = await axios.get(AIRPORTS_URL);
      airports = Object.entries(response.data).map(([icao, data]) => ({
        icao,
        ...data,
      }));
      cache.set('airports', airports);
    }

    fuseIndex = new Fuse(airports, {
      keys: [
        { name: 'iata', weight: 2 },
        { name: 'city', weight: 2 },
        { name: 'name', weight: 1 },
        { name: 'country', weight: 1 },
      ],
      threshold: 0.3,
      includeScore: true,
    });
    return true;
  } catch (error) {
    console.error('Error initializing airport service:', error);
    throw error;
  }
}

async function searchAirports(query) {
  if (!fuseIndex) {
    await initialize();
  }

  if (!query || query.length < 2) {
    return [];
  }

  return fuseIndex
    .search(query)
    .filter((result) => result.score < 0.4)
    .slice(0, 10)
    .map((result) => ({
      ...result.item,
      displayName: `${result.item.city} (${result.item.iata}) - ${result.item.name}`,
      countryCode: result.item.country,
    }));
}

async function getAirportByIata(iata) {
  if (!airports) {
    await initialize();
  }

  return airports.find(
    (airport) =>
      airport.iata && airport.iata.toUpperCase() === iata.toUpperCase()
  );
}

module.exports = {
  searchAirports,
  getAirportByIata,
};
