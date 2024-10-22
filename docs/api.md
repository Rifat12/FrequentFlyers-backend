# letsfly API Documentation

## /flight/search (POST)

**Description:** Searches for flights using the Amadeus API.

**Request Body:**

```json
{
  "origin": "string (e.g., JFK)",
  "destination": "string (e.g., LHR)",
  "departureDate": "YYYY-MM-DD",
  "returnDate": "YYYY-MM-DD (optional for one-way trips)",
  "adults": "integer",
  "children": "integer",
  "infants": "integer",
  "travelClass": "string (e.g., ECONOMY, BUSINESS)"
}
```

**Response:**

```json
{
  "success": true/false,
  "responseType": "flight-search",
  "data": [
    // Array of flight offers (structure depends on Amadeus API response)
  ]
}
```

## /flight/book (POST)

**Description:** (Not yet implemented) Books a flight.

**Request Body:** (To be defined)

**Response:** (To be defined)

## Error Handling

Standard HTTP status codes are used to indicate errors.  Error details are included in the response body.
