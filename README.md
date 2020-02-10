# Sweater Weather

## Description

Sweater Weather is a backend API that provides weather data and user authentication for a fictional frontend user interface. Endpoints for the API use the Google Maps API to provide latitude and longitude of search locations and the Dark Sky API to get current and forecast weather information for the queried location. This information is all then packaged and returned as JSON for frontend consumption.

## Purpose

The purpose of this project was to build an API with JavaScript ES6, Node, Express, and Knex that could consume data from a number of various sources and then package as a JSON package for a frontend to present to users.

## Focus Areas

* Using JavaScript paired with Expresss and a Knex database
* Consuming a number of APIs
* Building Authenticated API calls

## APIs Used
* [Google Maps API](https://developers.google.com/maps/documentation)
* [Dark Sky Weather API](https://darksky.net/dev)

## Tech/Framework Used

Sweater Weather Express is written in JavaScript ES6, Node, and Express, and uses a Knex connected Postgresql database.

### Node Packages
The following Node packages are used in this project:

* [express](https://expressjs.com/)
* [knex](http://knexjs.org/)
* [postgresql](https://www.postgresql.org/)
* [dotenv](https://www.npmjs.com/package/dotenv)

## Database

### Database Setup

1. Install necessary dependencies with `npm install`
1. Set up your local development database with the following commands - replacing the `PUT_DATABASE_NAME_HERE` with your desired database name:
```
psql
CREATE DATABASE PUT_DATABASE_NAME_HERE_dev;
\q
```

1. Set up your local test database with the following commands - replacing the `PUT_DATABASE_NAME_HERE` with your desired database name:
```
sql
CREATE DATABASE PUT_DATABASE_NAME_HERE_test;
\q
```
1. Run Migrations using:
```
knex migrate:latest`
knex migrate:latest` --env test
```
1. Seed the database with: 
```
knex seed:run
knex seed:run —env test
```

### Using doting in development and testing
Keep environment variables secure by using dotenv. Make a `.env` file il your root directory and put your environment variables inside. See more information about using the dotenv Node package at https://www.npmjs.com/package/dotenv.

### Required Environment Variables
Environment variables and required API keys/tokens (in Figaro format) :
1. Google Geocode API key defined as `GOOGLE_API_KEY`
1. DarkSky API key defined as `DARKSKY_API_KEY`

## Versions
- JavaScript ES6
- Node v13.3.0
