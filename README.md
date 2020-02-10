# Sweater Weather Express

## Description

Sweater Weather Express is a backend API that provides weather data and user authentication for a fictional frontend user interface. Endpoints for the API use the Google Maps API to provide latitude and longitude of search locations and the DarkSky API to get weather information for the queried location. This information is all then packaged and returned as JSON for frontend consumption.

## Purpose

The purpose of this project was to build an API with JavaScript ES6, Node, Express, and Knex that could consume data from a number of various sources and then package it as JSON for a frontend application.

## Focus Areas

* Using JavaScript, Node, Express, and a Knex database
* Consuming a number of APIs
* Building Authenticated API calls

## How to Use / Endpoints

### Forecast Endpoint

#### 1) Get current and future weather forecast data for a destination

When a user sends a `GET` request to `api/v1/forecast` it returns forecast information for that location including the current forecast, eight hourly forecasts, and seven daily forecasts.

The user request payload will be sent in the request body and in the format:
```
{ api_key: <API_KEY>, location: “<LOCATION>“ }
```

The response body will look like:
```
{
    "location": "denver,co",
    "currently": {
        "summary": "Partly Cloudy",
        "icon": "partly-cloudy-night",
        "precipIntensity": 0,
        "precipProbability": 0,
        "temperature": 23.68,
        "humidity": 0.7,
        "pressure": 1024.3,
        "windSpeed": 3.99,
        "windGust": 6.16,
        "windBearing": 214,
        "cloudCover": 0.5,
        "visibility": 9.776
    },
    "hourly": {
        "summary": "Foggy tomorrow evening.",
        "icon": "fog",
        "data": [
            {
                "time": 1581303600,
                "summary": "Partly Cloudy",
                "icon": "partly-cloudy-night",
                "precipProbability": 0.02,
                "temperature": 23.97,
                "humidity": 0.7,
                "pressure": 1024.3,
                "windSpeed": 3.95,
                "windGust": 6.13,
                "windBearing": 209,
                "cloudCover": 0.51,
                "visibility": 9.691
            },
            …
        ]
    },
    "daily": {
        "summary": "Light snow today and tomorrow.",
        "icon": "snow",
        "data": [
            {
                "time": 1581231600,
                "summary": "Possible flurries in the morning.",
                "icon": "snow",
                "sunriseTime": 1581256860,
                "sunsetTime": 1581294600,
                "precipProbability": 0.68,
                "precipType": "snow",
                "temperatureHigh": 29.57,
                "temperatureLow": 13.09,
                "humidity": 0.8,
                "pressure": 1022.8,
                "windSpeed": 3.9,
                "windGust": 12.68,
                "cloudCover": 0.76,
                "visibility": 6.177,
                "temperatureMin": 13.09,
                "temperatureMax": 33.51
            },
            …
        ]
    }
}
```

### Favorites Endpoint

#### 1) Getting a list of all favorite destinations with their current weather

When a user sends a `GET` request to `api/v1/favorites` it returns all favorite destinations with their current weather.

The user request payload will be sent in the request body in the format:
```
{ api_key: <API_KEY>}
```

The response body will look like:
```
[
    {
        "location": "Denver,CO",
        "current_weather": {
            "summary": "Partly Cloudy",
            "icon": "partly-cloudy-night",
            "precipIntensity": 0,
            "precipProbability": 0,
            "temperature": 24.03,
            "humidity": 0.7,
            "pressure": 1024.3,
            "windSpeed": 3.94,
            "windGust": 6.12,
            "windBearing": 208,
            "cloudCover": 0.51,
            "visibility": 9.676
        }
    },
    {
        "location": "honolulu,hi",
        "current_weather": {
            "summary": "Clear",
            "icon": "clear-day",
            "precipIntensity": 0.002,
            "precipProbability": 0.01,
            "temperature": 74.29,
            "humidity": 0.6,
            "pressure": 1010,
            "windSpeed": 15.81,
            "windGust": 21.39,
            "windBearing": 282,
            "cloudCover": 0.17,
            "visibility": 10
        }
    }
]
```

#### 2) Adding a favorite destination

A user can send a `POST` request to `/api/v1/favorites` that allows them to add a favorite destination to the database.

The user request payload will be sent in the request body in the format:
```
{ api_key: <API_KEY>, location: “<LOCATION>“ }
```

The response body will be:
```
{
    "message": “<LOCATION> has been added to your favorites"
}
```

#### 3) Deleting a favorite destination

A user can send a `DELETE` request to `api/v1/favorites/:id` which deletes that favorite destination from the database.

The user request payload will be sent in the request body in the format:
```
{ api_key: <API_KEY>, location: “<LOCATION>“ }
```

The response will be a status `204` with no response body.

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
knex seed:run --env test
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
