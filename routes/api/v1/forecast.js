const dotenv = require('dotenv').config();
// let googleService = require("../../../services/google_service");

var express = require('express');
var router = express.Router();

const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../../knexfile')[environment];
const database = require('knex')(configuration);
const fetch = require('node-fetch');

router.get('/', (request, response) => {
  if ((request.body.api_key) && (request.query.location)){

    database('users').where('api_key', request.body.api_key).first()
      .then((user) => {

        if (user) {
        // CHANGE THE BELOW FUNCTIONS TO HELPER FUNCTIONS IF REFACTORING
        // START OF THE GOOGLE API SERVICE FUNCTION
        const location  = request.query.location;
        const googleApiKey = process.env.GOOGLE_API_KEY;

        const googleApiUrl =`https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=${googleApiKey}`;
        fetch(googleApiUrl, { method: 'GET'})
          .then((response) => {
             return response.json();
        })
        .then((json) => {
          const googleGeocodeResponse = json;
          const latAndLng = Object.values(googleGeocodeResponse.results[0].geometry.location);

          // START OF DARKSKY API FETCHING
          const latAndLngFromGoogle = latAndLng;
          const darkSkyApiKey = process.env.DARKSKY_API_KEY;
          const darkSkyUrl = `https://api.darksky.net/forecast/${darkSkyApiKey}/${latAndLngFromGoogle}?exclude=minutely,flags&units=us`;
          fetch(darkSkyUrl, { method: 'GET'})
            .then((response) => {
               return response.json();
            })
            .then((json) => {

              //

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
              // CLEAN UP THE EIGHT HOUR FORECAST INFO
              eightHourForecast.forEach((day, index) => {
                delete day.precipType;
                delete day.precipAccumulation;
                delete day.apparentTemperature;
                delete day.dewPoint;
                delete day.uvIndex;
                delete day.ozone;
                return eightHourForecast;
              });

              // DAILY WEATHER INFO
              let dailyWeather = json.daily;
              let dailyWeatherSumamry = json.daily.summary;
              let dailyWeatherIcon = json.daily.icon;
              let sevenDayForecast = dailyWeather.data.slice(0, 7);
              // CLEAN UP THE SEVEN DAY FORECAST WEATHER INFO
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
                return sevenDayForecast;
              });
              response.status(200).json({currently: currentWeather, hourly: {summary: hourlyWeatherSumamry, icon: hourlyWeatherIcon, data: eightHourForecast}, daily: {summary: dailyWeatherSumamry, icon: dailyWeatherIcon, data: sevenDayForecast}});
            });
          // END OF DARSKY API FETCHING
        });

      } else {
        response.status(401).json({error: 'Unauthorized!'});
      }
    }).catch(error => console.log(error));
  } else if ((!request.body.api_key) && (request.query.location)) {
    response.status(400).json({error: 'Bad Request! Did you send in an Api Key?'});
  } else if ((request.body.api_key) && (!request.query.location)) {
    response.status(400).json({error: 'Bad Request! Did you send in a location?'});
  }
});

module.exports = router;
