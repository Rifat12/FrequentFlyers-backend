require("dotenv").config();
const fetch = require("node-fetch");
const axios = require("axios");
const Groq = require('groq-sdk');

const groqClient = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

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

  const calculateTransitDuration = (arrivalTime, departureTime) => {
    const arrivalDate = new Date(arrivalTime);
    const departureDate = new Date(departureTime);
    const diffMs = departureDate - arrivalDate; // Difference in milliseconds
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `PT${diffHours}H${diffMinutes}M`;
  };

  return rawData.data.data
    .filter((offer) => offer.itineraries[0].segments.length <= 2) // Skip offers with more than 2 segments
    .map((offer) => {
      const { id, itineraries, price, validatingAirlineCodes } = offer;
      const segments = itineraries[0].segments;

      // Determine if the flight is direct and transit info
      const isDirectFlight = segments.length === 1;
      const transitInfo = isDirectFlight
        ? "Direct flight"
        : `${segments.length - 1} stop, transit`;

      // Include transit location and duration for connecting flights
      const transitDetails = !isDirectFlight
        ? {
            transitLocation: segments[0].arrival.iataCode,
            transitDuration: calculateTransitDuration(
              segments[0].arrival.at,
              segments[1].departure.at
            ),
          }
        : null;

      const flights = segments.map((segment) => ({
        departure: {
          airportCode: segment.departure.iataCode,
          airportName:
            locations?.[segment.departure.iataCode]?.cityCode || "Unknown",
          time: segment.departure.at,
        },
        arrival: {
          airportCode: segment.arrival.iataCode,
          airportName:
            locations?.[segment.arrival.iataCode]?.cityCode || "Unknown",
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
        isDirectFlight,
        transitInfo,
        transitDetails,
        airline: {
          code: validatingAirlineCodes?.[0],
          name: carriers?.[validatingAirlineCodes?.[0]] || "Unknown",
        },
        totalPrice: price.grandTotal,
        currency: price.currency,
        flights,
      };
    });
};

// Basic city to IATA mapping for demonstration
const cityToIATA = {
  // United States
  atlanta: "ATL",
  "los angeles": "LAX",
  dallas: "DFW",
  denver: "DEN",
  chicago: "ORD",
  "new york": "JFK",
  nyc: "JFK",
  orlando: "MCO",
  "las vegas": "LAS",
  charlotte: "CLT",
  miami: "MIA",
  seattle: "SEA",
  newark: "EWR",
  "san francisco": "SFO",
  phoenix: "PHX",
  houston: "IAH",
  boston: "BOS",
  minneapolis: "MSP",
  detroit: "DTW",
  philadelphia: "PHL",

  // International Major Cities
  london: "LHR",
  dubai: "DXB",
  istanbul: "IST",
  delhi: "DEL",
  paris: "CDG",
  amsterdam: "AMS",
  madrid: "MAD",
  tokyo: "HND",
  Dhaka: "DAC",
  frankfurt: "FRA",
  "mexico city": "MEX",
  bangkok: "BKK",
  singapore: "SIN",
  seoul: "ICN",
  beijing: "PEK",
  shanghai: "PVG",
  "hong kong": "HKG",
  toronto: "YYZ",
  sydney: "SYD",
  melbourne: "MEL",
  auckland: "AKL",

  // European Cities
  rome: "FCO",
  milan: "MXP",
  barcelona: "BCN",
  vienna: "VIE",
  munich: "MUC",
  zurich: "ZRH",
  copenhagen: "CPH",
  oslo: "OSL",
  stockholm: "ARN",
  brussels: "BRU",

  // Asian Cities
  mumbai: "BOM",
  bangalore: "BLR",
  guangzhou: "CAN",
  shenzhen: "SZX",
  taipei: "TPE",
  manila: "MNL",
  jakarta: "CGK",
  "kuala lumpur": "KUL",
  hanoi: "HAN",
  "ho chi minh": "SGN",

  // Middle Eastern Cities
  doha: "DOH",
  "abu dhabi": "AUH",
  riyadh: "RUH",
  jeddah: "JED",
  tehran: "IKA",
  "tel aviv": "TLV",
  cairo: "CAI",
  muscat: "MCT",
  kuwait: "KWI",
  bahrain: "BAH",

  // African Cities
  johannesburg: "JNB",
  "cape town": "CPT",
  nairobi: "NBO",
  "addis ababa": "ADD",
  casablanca: "CMN",
  lagos: "LOS",
  accra: "ACC",
  dakar: "DKR",
  tunis: "TUN",
  algiers: "ALG",

  // Latin American Cities
  "sao paulo": "GRU",
  "rio de janeiro": "GIG",
  "buenos aires": "EZE",
  lima: "LIM",
  bogota: "BOG",
  santiago: "SCL",
  "panama city": "PTY",
  "san jose": "SJO",
  quito: "UIO",
  caracas: "CCS",

  // Canadian Cities
  vancouver: "YVR",
  montreal: "YUL",
  calgary: "YYC",
  ottawa: "YOW",
  edmonton: "YEG",
  halifax: "YHZ",
  "quebec city": "YQB",
  winnipeg: "YWG",
  saskatoon: "YXE",
  regina: "YQR",

  // Oceania Cities
  brisbane: "BNE",
  perth: "PER",
  adelaide: "ADL",
  "gold coast": "OOL",
  christchurch: "CHC",
  wellington: "WLG",
  cairns: "CNS",
  darwin: "DRW",
  hobart: "HBA",
  nadi: "NAN",
};

// Helper function to parse relative dates
function parseDateFromText(text) {
  const lower = text.toLowerCase();
  let targetDate;

  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (lower.includes("today")) {
    targetDate = today;
  } else if (lower.includes("tomorrow")) {
    targetDate = tomorrow;
  } else {
    const dateMatch = text.match(/\b(20\d{2}-\d{2}-\d{2})\b/);
    if (dateMatch) {
      targetDate = new Date(dateMatch[1]);
    } else {
      return null;
    }
  }

  return targetDate.toISOString().split("T")[0];
}



// Helper to guess IATA from city/country mention
function getIATACode(location) {
  if (!location) return null;
  const lower = location.toLowerCase().trim();
  return cityToIATA[lower] || null;
}

async function callGroqLLM(query, systemPrompt = "You are a helpful assistant.") {

  let prompt2 = `You are an advanced flight search parser API endpoint. Your role is to parse natural language flight queries and return strictly formatted JSON responses. You must follow exact specifications and validation rules.

  INPUT PROCESSING:
  The user will provide a natural language flight request. You must extract and validate all relevant information.
  
  OUTPUT SPECIFICATION:
  Return ONLY a valid JSON object with the following schema:
  {
    "success": boolean,         // Required: Indicates if parsing was successful
    "message": string,         // Required: Success confirmation or error details
    "data": {
      "origin": string,        // Required: Valid IATA airport code (3 letters)
      "destination": string,   // Required: Valid IATA airport code (3 letters)
      "departureDate": string, // Required: Format YYYY-MM-DD
      "returnDate": string,    // Optional: Format YYYY-MM-DD or empty string
      "adults": integer,       // Required: Range 1-9, default 1
      "children": integer,     // Required: Range 0-9, default 0
      "infants": integer,      // Required: Range 0-9, default 0
      "travelClass": string,   // Required: Enum ["ECONOMY", "BUSINESS"]
      "tripType": string      // Required: Always "one-way"
    }
  }
  
  VALIDATION RULES:
  1. Dates:
     - Derive dates from user input text if not explicitly mentioned, eg "tomorrow", thanksgiving day, christmas, etc.
     - current date is Dec 2024, so if any month other than dec is mentioned, assume it's for next year (2025)
     - Output departureDate must be:
       *  YYYY-MM-DD format
       * Not in the past
       * Within next 365 days
     - returnDate must be empty string (one-way trips only)
  
  2. Airports:
    - Extract airport codes from user input text, eg "Chicago", "New York", "LAX", to ORD, JFK, LAX
     - Output Must be valid IATA codes
     - Common city names must map to primary airports:
       * "Chicago" → "ORD"
       * "New York"/"NYC" → "JFK"
       * "Los Angeles"/"LA" → "LAX"
       * "San Francisco" → "SFO"
       * "Dallas" → "DFW"
       * Seattle, Miami, Orlando, Las Vegas, Charlotte, Phoenix, Houston, Boston, Minneapolis, Detroit, Philadelphia etc.
     - it is your responsibility to map the city names to the correct IATA codes from your knowledge base
  
  3. Passengers:
     - adults: Default 1 if not specified, max 9
     - children: Default 0 if not specified, max 9
     - infants: Default 0 if not specified, max 9
     - Total passengers (adults + children + infants) must not exceed 9
  
  4. Travel Class:
     - Default: "ECONOMY"
     - Valid values: ["ECONOMY", "BUSINESS"]
     - Case-insensitive input parsing
  
  ERROR HANDLING:
  Return success: false with appropriate message for:
  1. missing dates
  3. Invalid passenger counts
  4. Any other parsing failures
  
  The response must:
  1. Be valid JSON
  2. Include ALL required fields
  3. Use correct data types
  4. Follow exact format specifications
  5. Include appropriate error messages
  6. Not include any additional text or commentary
  
  Example Input: "I need a flight from London to New York on January 15th 2025"
  Example Output:
  {
    "success": true,
    "message": "Successfully parsed flight request",
    "data": {
      "origin": "LHR",
      "destination": "JFK",
      "departureDate": "2025-01-15",
      "returnDate": "",
      "adults": 1,
      "children": 0,
      "infants": 0,
      "travelClass": "ECONOMY",
      "tripType": "one-way"
    }
  }
  
  Example Input: "flight on christmas from nyc to dhaka"
  //defaults for adults, children, infants, travelClass, tripType will have to be used since they are not specified in the query
  Example Output:
  {
    "success": true,
    "message": "Successfully parsed flight request",
    "data": {
      "origin": "JFK",
      "destination": "DAC",
      "departureDate": "2024-12-25",
      "returnDate": "",
      "adults": 1,
      "children": 0,
      "infants": 0,
      "travelClass": "ECONOMY",
      "tripType": "one-way"
    }
  }
  
  Input: "${query}"
  
  Return ONLY the JSON response. No additional text or explanations.`;


  try {

    const params = {
      messages: [
        {
          role: "user",
          content: prompt2
        }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 1,
      max_tokens: 2048,
      top_p: 1,
      stream: false,
      response_format: {
        type: "json_object"
      },
      stop: null
    }
    // const params2 = {
    //   messages: [
    //     { role: 'system', content: systemPrompt },
    //     { role: 'user', content: prompt2 },
    //   ],
    //   model: 'llama3-8b-8192',
    // };

    const completion = await groqClient.chat.completions.create(params);
    
    if (completion.choices && completion.choices[0]) {
      return completion.choices[0].message.content;
    } else {
      throw new Error('No completion choices returned from Groq');
    }
  } catch (error) {
    console.error('Error calling Groq LLM:', error);
    throw error;
  }
}

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

  let prompt2 = `You are an advanced flight search parser API endpoint. Your role is to parse natural language flight queries and return strictly formatted JSON responses. You must follow exact specifications and validation rules.

INPUT PROCESSING:
The user will provide a natural language flight request. You must extract and validate all relevant information.

OUTPUT SPECIFICATION:
Return ONLY a valid JSON object with the following schema:
{
  "success": boolean,         // Required: Indicates if parsing was successful
  "message": string,         // Required: Success confirmation or error details
  "data": {
    "origin": string,        // Required: Valid IATA airport code (3 letters)
    "destination": string,   // Required: Valid IATA airport code (3 letters)
    "departureDate": string, // Required: Format YYYY-MM-DD
    "returnDate": string,    // Optional: Format YYYY-MM-DD or empty string
    "adults": integer,       // Required: Range 1-9, default 1
    "children": integer,     // Required: Range 0-9, default 0
    "infants": integer,      // Required: Range 0-9, default 0
    "travelClass": string,   // Required: Enum ["ECONOMY", "BUSINESS"]
    "tripType": string      // Required: Always "one-way"
  }
}

VALIDATION RULES:
1. Dates:
   - Derive dates from user input text if not explicitly mentioned, eg "tomorrow", thanksgiving day, christmas, etc.
   - current date is Dec 2024, so if any month other than dec is mentioned, assume it's for next year (2025)
   - Output departureDate must be:
     *  YYYY-MM-DD format
     * Not in the past
     * Within next 365 days
   - returnDate must be empty string (one-way trips only)

2. Airports:
  - Extract airport codes from user input text, eg "Chicago", "New York", "LAX", to ORD, JFK, LAX
   - Output Must be valid IATA codes
   - Common city names must map to primary airports:
     * "Chicago" → "ORD"
     * "New York"/"NYC" → "JFK"
     * "Los Angeles"/"LA" → "LAX"
     * "San Francisco" → "SFO"
     * "Dallas" → "DFW"
     * Seattle, Miami, Orlando, Las Vegas, Charlotte, Phoenix, Houston, Boston, Minneapolis, Detroit, Philadelphia etc.

3. Passengers:
   - adults: Default 1 if not specified, max 9
   - children: Default 0 if not specified, max 9
   - infants: Default 0 if not specified, max 9
   - Total passengers (adults + children + infants) must not exceed 9

4. Travel Class:
   - Default: "ECONOMY"
   - Valid values: ["ECONOMY", "BUSINESS"]
   - Case-insensitive input parsing

ERROR HANDLING:
Return success: false with appropriate message for:
1. missing dates
2. Unrecognized airports
3. Invalid passenger counts
4. Any other parsing failures

The response must:
1. Be valid JSON
2. Include ALL required fields
3. Use correct data types
4. Follow exact format specifications
5. Include appropriate error messages
6. Not include any additional text or commentary

Example Input: "I need a flight from Chicago to New York on January 15th 2025"
Example Output:
{
  "success": true,
  "message": "Successfully parsed flight request",
  "data": {
    "origin": "ORD",
    "destination": "JFK",
    "departureDate": "2025-01-15",
    "returnDate": "",
    "adults": 1,
    "children": 0,
    "infants": 0,
    "travelClass": "ECONOMY",
    "tripType": "one-way"
  }
}

Example Input: "flight on christmas from nyc to la"
//defaults for adults, children, infants, travelClass, tripType will have to be used since they are not specified in the query
Example Output:
{
  "success": true,
  "message": "Successfully parsed flight request",
  "data": {
    "origin": "JFK",
    "destination": "LAX",
    "departureDate": "2024-12-25",
    "returnDate": "",
    "adults": 1,
    "children": 0,
    "infants": 0,
    "travelClass": "ECONOMY",
    "tripType": "one-way"
  }
}

Input: "${query}"

Return ONLY the JSON response. No additional text or explanations.`;

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "meta-llama/llama-3.1-405b-instruct:free",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: prompt2 },
        ],
        temperature: 0.2,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log(response.data);

    if (!response.data.choices || !response.data.choices[0].message) {
      return {
        success: false,
        message: "No response from LLM",
      };
    }

    let llmContent = response.data.choices[0].message.content || "";
    console.log(llmContent);

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
        message: "Failed to parse LLM response: Invalid JSON",
      };
    }

    return result;
  } catch (error) {
    return {
      success: false,
      message:
        "LLM API error: " + (error.response?.data?.error || error.message),
    };
  }
}

async function parseNaturalLanguageQuery(query, tripId) {
  let resFirst = await callGroqLLM(query); //callLLM(query);

  let llmResponse = JSON.parse(resFirst);


  if (!llmResponse || typeof llmResponse !== "object") {
    return { success: false, message: "No response from LLM" };
  }

  if (llmResponse.success === false) {
    return llmResponse;
  }

  // Validate fields from LLM
  const {
    origin,
    destination,
    departureDate,
    returnDate,
    adults,
    children,
    infants,
    travelClass,
    tripType,
  } = llmResponse.data || {};

  // // Validate IATA codes
  // if (
  //   !origin ||
  //   (!getIATACode(origin) && !Object.values(cityToIATA).includes(origin))
  // ) {
  //   const fixedOrigin = getIATACode(origin);
  //   if (!fixedOrigin) {
  //     return { success: false, message: "Invalid origin" };
  //   } else {
  //     llmResponse.data.origin = fixedOrigin;
  //   }
  // }

  // if (
  //   !destination ||
  //   (!getIATACode(destination) &&
  //     !Object.values(cityToIATA).includes(destination))
  // ) {
  //   const fixedDest = getIATACode(destination);
  //   if (!fixedDest) {
  //     return { success: false, message: "Invalid destination" };
  //   } else {
  //     llmResponse.data.destination = fixedDest;
  //   }
  // }

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
  parseNaturalLanguageQuery,
};
