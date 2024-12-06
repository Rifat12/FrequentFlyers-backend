require('dotenv').config();
const fetch = require('node-fetch');
const axios = require('axios');

// Preserve existing functions
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

// Basic city to IATA mapping for demonstration
const cityToIATA = {
  // United States
  "atlanta": "ATL",
  "los angeles": "LAX",
  "dallas": "DFW",
  "denver": "DEN", 
  "chicago": "ORD",
  "new york": "JFK",
  "nyc": "JFK",
  "orlando": "MCO",
  "las vegas": "LAS",
  "charlotte": "CLT",
  "miami": "MIA",
  "seattle": "SEA",
  "newark": "EWR",
  "san francisco": "SFO",
  "phoenix": "PHX",
  "houston": "IAH",
  "boston": "BOS",
  "minneapolis": "MSP",
  "detroit": "DTW",
  "philadelphia": "PHL",

  // International Major Cities
  "london": "LHR",
  "dubai": "DXB",
  "istanbul": "IST",
  "delhi": "DEL", 
  "paris": "CDG",
  "amsterdam": "AMS",
  "madrid": "MAD",
  "tokyo": "HND",
  "Dhaka": "DAC",
  "frankfurt": "FRA",
  "mexico city": "MEX",
  "bangkok": "BKK",
  "singapore": "SIN",
  "seoul": "ICN",
  "beijing": "PEK",
  "shanghai": "PVG",
  "hong kong": "HKG",
  "toronto": "YYZ",
  "sydney": "SYD",
  "melbourne": "MEL",
  "auckland": "AKL",

  // European Cities
  "rome": "FCO",
  "milan": "MXP",
  "barcelona": "BCN",
  "vienna": "VIE", 
  "munich": "MUC",
  "zurich": "ZRH",
  "copenhagen": "CPH",
  "oslo": "OSL",
  "stockholm": "ARN",
  "brussels": "BRU",

  // Asian Cities
  "mumbai": "BOM",
  "bangalore": "BLR",
  "guangzhou": "CAN",
  "shenzhen": "SZX",
  "taipei": "TPE",
  "manila": "MNL",
  "jakarta": "CGK",
  "kuala lumpur": "KUL",
  "hanoi": "HAN",
  "ho chi minh": "SGN",

  // Middle Eastern Cities
  "doha": "DOH",
  "abu dhabi": "AUH",
  "riyadh": "RUH",
  "jeddah": "JED",
  "tehran": "IKA",
  "tel aviv": "TLV",
  "cairo": "CAI",
  "muscat": "MCT",
  "kuwait": "KWI",
  "bahrain": "BAH",

  // African Cities
  "johannesburg": "JNB",
  "cape town": "CPT",
  "nairobi": "NBO",
  "addis ababa": "ADD",
  "casablanca": "CMN",
  "lagos": "LOS",
  "accra": "ACC",
  "dakar": "DKR",
  "tunis": "TUN",
  "algiers": "ALG",

  // Latin American Cities
  "sao paulo": "GRU",
  "rio de janeiro": "GIG",
  "buenos aires": "EZE",
  "lima": "LIM",
  "bogota": "BOG",
  "santiago": "SCL",
  "panama city": "PTY",
  "san jose": "SJO",
  "quito": "UIO",
  "caracas": "CCS",

  // Canadian Cities
  "vancouver": "YVR",
  "montreal": "YUL",
  "calgary": "YYC",
  "ottawa": "YOW",
  "edmonton": "YEG",
  "halifax": "YHZ",
  "quebec city": "YQB",
  "winnipeg": "YWG",
  "saskatoon": "YXE",
  "regina": "YQR",

  // Oceania Cities
  "brisbane": "BNE",
  "perth": "PER",
  "adelaide": "ADL",
  "gold coast": "OOL",
  "christchurch": "CHC",
  "wellington": "WLG",
  "cairns": "CNS",
  "darwin": "DRW",
  "hobart": "HBA",
  "nadi": "NAN"
};


// Helper function to parse relative dates
function parseDateFromText(text) {

  const lower = text.toLowerCase();
  let targetDate;

  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (lower.includes('today')) {
    targetDate = today;
  } else if (lower.includes('tomorrow')) {
    targetDate = tomorrow;
  } else {
    const dateMatch = text.match(/\b(20\d{2}-\d{2}-\d{2})\b/);
    if (dateMatch) {
      targetDate = new Date(dateMatch[1]);
    } else {
      return null;
    }
  }

  return targetDate.toISOString().split('T')[0];
}


// Helper to guess IATA from city/country mention
function getIATACode(location) {
  if (!location) return null;
  const lower = location.toLowerCase().trim();
  return cityToIATA[lower] || null;
}

// Function to call OpenRouter LLM API
// async function callLLMv1(query) {

//   const prompt = `
// You are a flight search parser. The user will give you a natural language flight request. 
// You must return a JSON ONLY with the following fields:
// {
//   "success": boolean,
//   "message": "string",
//   "data": {
//     "origin": "string (IATA code for the city mentioned, e.g. ORD for Chicago)",
//     "destination": "string (IATA code for the city mentioned, e.g. JFK for New York)",
//     "departureDate": "ONLY YYYY-MM-DD", //nothing but YYYY-MM-DD
//     "returnDate": "ONLY YYYY-MM-DD or empty since currently not supported",
//     "adults": integer,
//     "children": integer,
//     "infants": integer,
//     "travelClass": "ECONOMY or BUSINESS (default ECONOMY if not specified)",
//     "tripType": "one-way"
//   }
// }

// Constraints:
// - If passenger count not mentioned, assume 1 adult, 0 children, 0 infants.
// - If travel class not mentioned, assume ECONOMY.
// - Trip type always one-way, so returnDate can be empty.
// - If date not clearly mentioned or can't be parsed, return success:false and message "Date not specified or invalid".
// - If origin/destination can't be found or matched to a known IATA code, return success:false and message "Invalid origin or destination".
// - Origin and destination must be IATA codes for major airports. If query says "Chicago", must return "ORD". If "New York" or "NYC", must return "JFK".
// - Make sure each field is correctly formatted and validated., eg departureDate must be in YYYY-MM-DD format without any extra text.

// Input: "${query}"

// Now return the requested JSON only. No extra text.
// `;

// try {
//   const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
//     model: "meta-llama/llama-3.1-405b-instruct:free",
//     messages: [{ role: "system", content: "You are a helpful assistant." }, { role: "user", content: prompt }],
//     temperature: 0.2
//   }, {
//     headers: {
//       'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
//       'Content-Type': 'application/json'
//     }
//   });

//   let result;
//   console.log("PRINT", response.data.choices[0].message.content);
//   const newResponse = response.data.choices[0].message.contentstr.replace(/```[\s\S]*```/g, '');
//   try {
//     result = JSON.parse(newResponse);
//   } catch (e) {
//     return {
//       success: false,
//       message: "Failed to parse LLM response"
//     };
//   }

//   return result;
// } catch (error) {
//   return {
//     success: false,
//     message: "LLM API error: " + (error.response?.data?.error || error.message)
//   };
// }

// }

async function callLLM(query) {
  const prompt = `
You are a flight search parser. The user will give you a natural language flight request. 
You must return a JSON ONLY with the following fields:
{
  "success": boolean,
  "message": "string",
  "data": {
    "origin": "string (IATA code for the city mentioned, e.g. ORD for Chicago)",
    "destination": "string (IATA code for the city mentioned, e.g. JFK for New York)",
    "departureDate": "ONLY YYYY-MM-DD",
    "returnDate": "ONLY YYYY-MM-DD or empty since currently not supported",
    "adults": integer,
    "children": integer,
    "infants": integer,
    "travelClass": "ECONOMY or BUSINESS (default ECONOMY if not specified)",
    "tripType": "one-way"
  }
}

Constraints:
- If passenger count not mentioned, assume 1 adult, 0 children, 0 infants.
- If travel class not mentioned, assume ECONOMY.
- Trip type always one-way, so returnDate can be empty.
- If date not clearly mentioned or can't be parsed, return success:false and message "Date not specified or invalid".
- If origin/destination can't be found or matched to a known IATA code, return success:false and message "Invalid origin or destination".
- Origin and destination must be IATA codes for major airports. If query says "Chicago", must return "ORD". If "New York" or "NYC", must return "JFK".
- Make sure each field is correctly formatted and validated, e.g. departureDate must be in YYYY-MM-DD format without any extra text.

Input: "${query}"

Now return the requested JSON only. No extra text.
`;

  try {
    const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
      model: "meta-llama/llama-3.1-405b-instruct:free",
      messages: [
        { role: "system", content: "You are a helpful assistant." }, 
        { role: "user", content: prompt }
      ],
      temperature: 0.2
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    let llmContent = response.data.choices[0].message.content || "";

    // Attempt to extract JSON inside triple backticks
    // This regex looks for a code block ``` ... ```
    const tripleBacktickMatch = llmContent.match(/```([\s\S]*?)```/);

    let jsonString = "";
    if (tripleBacktickMatch && tripleBacktickMatch[1]) {
      // We found a code block, let's assume that's the JSON
      jsonString = tripleBacktickMatch[1].trim();
    } else {
      // No code block found; the model might have returned JSON without triple backticks
      jsonString = llmContent.trim();
    }

    let result;
    try {
      result = JSON.parse(jsonString);
    } catch (e) {
      return {
        success: false,
        message: "Failed to parse LLM response: Invalid JSON"
      };
    }

    return result;
  } catch (error) {
    return {
      success: false,
      message: "LLM API error: " + (error.response?.data?.error || error.message)
    };
  }
}


//   const response = await fetch('https://openrouter.your-endpoint.com/v1/chat/completions', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`
//     },
//     body: JSON.stringify({
//       model: "openai/gpt-4",
//       messages: [{ role: "system", content: "You are a helpful assistant." }, { role: "user", content: prompt }],
//       temperature: 0.2
//     })
//   });

//   if (!response.ok) {
//     throw new Error(`LLM API error: ${response.statusText}`);
//   }

//   const data = await response.json();

//   let result;
//   try {
//     result = JSON.parse(data.choices[0].message.content);
//   } catch (e) {
//     return {
//       success: false,
//       message: "Failed to parse LLM response"
//     };
//   }

//   return result;
// }

// Natural language query parser


async function parseNaturalLanguageQuery(query, tripId) {
  let llmResponse = await callLLM(query);

  if (!llmResponse || typeof llmResponse !== 'object') {
    return { success: false, message: "No response from LLM" };
  }

  if (llmResponse.success === false) {
    return llmResponse;
  }

  // Validate fields from LLM
  const {
    origin, destination, departureDate,
    returnDate, adults, children, infants,
    travelClass, tripType
  } = llmResponse.data || {};

  // Validate IATA codes
  if (!origin || !getIATACode(origin) && !Object.values(cityToIATA).includes(origin)) {
    const fixedOrigin = getIATACode(origin);
    if (!fixedOrigin) {
      return { success: false, message: "Invalid origin" };
    } else {
      llmResponse.data.origin = fixedOrigin;
    }
  }

  if (!destination || !getIATACode(destination) && !Object.values(cityToIATA).includes(destination)) {
    const fixedDest = getIATACode(destination);
    if (!fixedDest) {
      return { success: false, message: "Invalid destination" };
    } else {
      llmResponse.data.destination = fixedDest;
    }
  }

  // Validate date
  if (!departureDate || isNaN(new Date(departureDate).getTime())) {
    const inferredDate = parseDateFromText(query);
    if (!inferredDate) {
      return { success: false, message: "Date not specified or invalid" };
    }
    llmResponse.data.departureDate = inferredDate;
  }

  // Validate passengers
  if (!adults && !children && !infants) {
    llmResponse.data.adults = 1;
    llmResponse.data.children = 0;
    llmResponse.data.infants = 0;
  }

  // Validate travel class
  if (!travelClass) {
    llmResponse.data.travelClass = "ECONOMY";
  }

  // Validate tripType
  if (!tripType) {
    llmResponse.data.tripType = "one-way";
  }

  // Add tripId to the response
  llmResponse.data.tripId = tripId;

  return llmResponse;
}

module.exports = { 
  buildSearchParams, 
  simplifyFlightData,
  parseNaturalLanguageQuery 
};
