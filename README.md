# letsfly: Flight Booking Application

## Overview

letsfly is a Node.js based flight booking application that uses the Amadeus API to search for and (eventually) book flights.  It uses Express.js for the server, Sequelize for database interaction (SQLite), and Axios for making API calls.

## Installation

1.  Clone the repository: `git clone [repository_url]`
2.  Install dependencies: `npm install`
3.  Set up environment variables (see `.env.example`):  `CLIENT_ID`, `CLIENT_SECRET`, `API_URL`
4.  Run database migrations (if necessary).

## Usage

Start the server: `npm start`

**API Endpoints:**

*   `/flight/search` (POST): Search for flights.  Requires a JSON payload with search parameters (origin, destination, dates, passengers, etc.).
*   `/flight/book` (POST):  (Not yet implemented) Book a flight.

**Example Search Request:**

```json
{
  "origin": "JFK",
  "destination": "LHR",
  "departureDate": "2024-03-15",
  "returnDate": "2024-03-22",
  "adults": 2,
  "children": 0,
  "infants": 0,
  "travelClass": "ECONOMY"
}
```

## API Documentation

See `docs/api.md` for detailed API documentation.

## Database Schema

The application uses a SQLite database with the following tables:

*   **Airport:** Stores airport information.
*   **auth:** Stores Amadeus OAuth 2.0 access tokens.
*   **flight_offer:** Stores flight offers retrieved from the Amadeus API.
*   **travellers:** Stores passenger information for bookings.



## License

MIT License

Copyright (c) [year] [fullname]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
