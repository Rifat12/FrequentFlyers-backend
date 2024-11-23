# Frequent Flyers

## Features

- User Authentication (Register/Login)
- Trip Management
- Flight Search (using Amadeus API)
- Event Planning
- Session-based Authentication
- PostgreSQL Database

## Prerequisites

- Node.js (v20 or higher)
- .env file
- Amadeus API credentials
- npm or yarn

## Environment Variables

Create a `.env` file in the root directory. 

## Installation & Database Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd travel
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
- Copy `.env.example` to `.env`
- Fill in your database and Amadeus API credentials


4. Start the server:
```bash
npm start
```

The server will start on http://localhost:4000

## Database Management



### Normal Operation
For normal application operation, just start the server:
```bash
npm start
```
The application will:
- Connect to the existing database
- Use existing tables
- Not modify the schema


## Development

### Running in Development Mode
```bash
npm run dev
```

## API Documentation

Detailed API documentation is available in [docs/api-guide.md](docs/api-guide.md)

## Frontend Integration

Frontend developers should:

1. Use the provided API documentation in docs/api-guide.md
2. Enable credentials in API requests:
```javascript
fetch(url, {
  credentials: 'include',
  // ... other options
})
```
