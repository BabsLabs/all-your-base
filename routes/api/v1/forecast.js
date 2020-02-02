const dotenv = require('dotenv').config();
const Forecast = require('../../../pojos/forecast');
const getLatAndLongFromGoogle = require('../../../services/google_service');


var express = require('express');
var router = express.Router();

const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../../knexfile')[environment];
const database = require('knex')(configuration);
const fetch = require('node-fetch');

router.get('/', (request, response) => {
  // CHECK THAT AN API KEY AND LOCATION WERE SENT WITH THE REQUEST
  if ((request.body.api_key) && (request.query.location)){
    // QUERY THE DATABASE TO CHECK FOR A USER WITH THE PASSED IN API KEY
    database('users').where('api_key', request.body.api_key).first()
      .then((user) => {
        if (user) {
        // GOOGLE HELPER METHOD TO GET THE LAT AND LONG OF THE LOCATION
        const googleResults = getLatAndLongFromGoogle(request.query.location);
        googleResults.then( (latAndLongGoogleResults) => {
        // DARK SKY METHOD GOES HERE
          const darkSkyApiKey = process.env.DARKSKY_API_KEY;
          const darkSkyUrl = `https://api.darksky.net/forecast/${darkSkyApiKey}/${latAndLongGoogleResults}?exclude=minutely,flags&units=us`;
          fetch(darkSkyUrl, { method: 'GET'})
            .then((forecastResponse) => {
               return forecastResponse.json();
            })
            .then((forecastJson) => {
              // // RETURN CURRENT WEATHER INFO
              response.status(200).json(new Forecast(request.query.location, forecastJson));
            }).catch(error => console.log(error.message));
          // END OF DARSKY API FETCHING
          });
        } else {
          response.status(401).json({error: 'Unauthorized!'});
        }
    }).catch((error) => {
      response.status(500).json({error: error.message});
    });
  } else if ((!request.body.api_key) && (request.query.location)) {
    response.status(400).json({error: 'Bad Request! Did you send in an Api Key?'});
  } else if ((request.body.api_key) && (!request.query.location)) {
    response.status(400).json({error: 'Bad Request! Did you send in a location?'});
  }
});

module.exports = router;
