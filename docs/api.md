# letsfly API Documentation



## Flight Offer Model

Flight offers are always associated with a trip. The model includes:

```json
{
  "id": "integer (auto-generated)",
  "tripId": "integer (required)",
  "offerId": "string",
  "offer": "string",
  "extraParams": "string"
}
```

## Passenger Model

Passengers are associated with flight offers and users. The model includes:

```json
{
  "id": "integer (auto-generated)",
  "flightOfferId": "integer (required)",
  "userId": "integer (required)",
  "isUser": "boolean (indicates if passenger is the user)",
  "firstName": "string (required)",
  "lastName": "string (required)",
  "dateOfBirth": "date (required)",
  "gender": "string (required)",
  "email": "string (optional)",
  "phone": "string (optional)",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

## /flight/book (POST)

**Description:** (Not yet implemented) Books a flight.

**Request Body:** (To be defined)

**Response:** (To be defined)

## Error Handling

Standard HTTP status codes are used to indicate errors. Error details are included in the response body.

Common errors:
- 400: Missing or invalid tripId
- 400: Invalid passenger information
- 404: Trip not found
- 500: Internal server error
