const dotenv = require('dotenv').config();

var express = require('express');
var router = express.Router();

const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../../knexfile')[environment];
const database = require('knex')(configuration);
const fetch = require('node-fetch');

router.get('/', (request, response) => {

  if (request.body.api_key) {

  // UNCOMMENT THE BELOW LINE OF CODE WHEN THE HELPER METHOD IS WORKING AGAIN
    // let searchedLatAndLong = getLatAndLng(request);

    // REMOVE THIS CODE WHEN THE HELPER METHOD IS WORKING
    console.log(request.query.location);
    let location  = request.query.location;
    let googleApiKey = process.env.GOOGLE_API_KEY;

    let googleApiUrl =`https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=${googleApiKey}`;
    fetch(googleApiUrl, { method: 'GET'})
      .then((response) => {
         return response.json();
    })
    .then((json) => {
      let googleGeocodeResponse = json;
      let latAndLng = Object.values(googleGeocodeResponse.results[0].geometry.location);
      console.log(`the lat and long of the searched for location are ${latAndLng}`);
      // RETURN THE LAT AND LONG DATA

      // START OF DARKSKY API FETCHING
      let latAndLngFromGoogle = latAndLng;
      let darkSkyApiKey = process.env.DARKSKY_API_KEY;
      let darkSkyUrl = `https://api.darksky.net/forecast/${darkSkyApiKey}/${latAndLngFromGoogle}?exclude=minutely,flags&units=us`;
      fetch(darkSkyUrl, { method: 'GET'})
        .then((response) => {
           return response.json();
        })
        .then((json) => {

          // FORECAST RESULTS
          let forecastData = json;

          // CURRENT WEATHER INFO
          let currentWeather = json.currently;
          // CLEAN UP THE CURRENT WEATHER INFO
          delete currentWeather.time;
          delete currentWeather.nearestStormDistance;
          delete currentWeather.nearestStormBearing;
          delete currentWeather.apparentTemperature;
          delete currentWeather.dewPoint;
          delete currentWeather.uvIndex;
          delete currentWeather.ozone;

          // HOURLY WEATHER INFO
          let hourlyWeather = json.hourly;
          let hourlyWeatherSumamry = json.hourly.summary;
          let hourlyWeatherIcon = json.hourly.icon;
          let eightHourForecast = hourlyWeather.data.slice(0, 8);
          eightHourForecast.forEach((day, index) => {
            delete day.precipType;
            delete day.precipAccumulation;
            delete day.apparentTemperature;
            delete day.dewPoint;
            delete day.uvIndex;
            delete day.ozone;
          });

          // DAILY WEATHER INFO
          let dailyWeather = json.daily;
          let dailyWeatherSumamry = json.daily.summary;
          let dailyWeatherIcon = json.daily.icon;
          let sevenDayForecast = dailyWeather.data.slice(0, 7);

          sevenDayForecast.forEach((day, index) => {
            delete day.moonPhase;
            delete day.precipAccumulation;
            delete day.temperatureHighTime;
            delete day.temperatureLowTime;
            delete day.apparentTemperatureHigh;
            delete day.apparentTemperatureHighTime;
            delete day.apparentTemperatureLow;
            delete day.apparentTemperatureLowTime;
            delete day.dewPoint;
            delete day.windGustTime;
            delete day.windBearing;
            delete day.uvIndex;
            delete day.uvIndexTime;
            delete day.ozone;
            delete day.temperatureMinTime;
            delete day.temperatureMaxTime;
            delete day.apparentTemperatureMin;
            delete day.apparentTemperatureMinTime;
            delete day.apparentTemperatureMax;
            delete day.apparentTemperatureMaxTime;
          });

        // MAKE A FORECAST OBJECT TO BE RETURNED AND NOT LIKE YOU SEE BELOW
        let forecastObject = `${currentWeather} ${hourlyWeatherSumamry} ${hourlyWeatherIcon} ${dailyWeatherSumamry} ${dailyWeatherIcon} ${dailyWeather}`;
        console.log(forecastObject);
        // let forecastJSON = forecastObject;
          response.status(200).send("forecastJSON");
        });
      // END OF DARSKY API FETCHING

    });
    // END OF getLatAndLng HELPER METHOD

  } else {
    response.status(401).send('Unauthorized!');
  }


});

// function getLatAndLng(request) {
//   console.log(request.query.location);
//   let location  = request.query.location;
//   let googleApiKey = process.env.GOOGLE_API_KEY;
//
//   let url =`https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=${googleApiKey}`;
//   fetch(url, { method: 'GET'})
//     .then((response) => {
//        return response.json();
//   })
//   .then((json) => {
//     let googleGeocodeResponse = json;
//     let latAndLng = Object.values(googleGeocodeResponse.results[0].geometry.location);
//     console.log(`the lat and long of the searched for location are ${latAndLng}`);
//     return latAndLng;
//   })
//   .catch((error) => {
//      response.status(500).json({ error });
//    });
// }


module.exports = router;
