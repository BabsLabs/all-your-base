const dotenv = require('dotenv').config();
const Forecast = require('../../../pojos/forecast');

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
          const latAndLng = googleGeocodeResponse.results[0].geometry.location;
          const joinedLatAndLng = `${latAndLng.lat},${latAndLng.lng}`;

          // START OF DARKSKY API FETCHING
          const latAndLngFromGoogle = joinedLatAndLng;
          const darkSkyApiKey = process.env.DARKSKY_API_KEY;
          const darkSkyUrl = `https://api.darksky.net/forecast/${darkSkyApiKey}/${latAndLngFromGoogle}?exclude=minutely,flags&units=us`;
          fetch(darkSkyUrl, { method: 'GET'})
            .then((response) => {
               return response.json();
            })
            .then((json) => {
              // // RETURN CURRENT WEATHER INFO
              response.status(200).json(new Forecast(location, json));
            });
          // END OF DARSKY API FETCHING
        });

      } else {
        response.status(401).json({error: 'Unauthorized!'});
      }
    }).catch((error) => {
      response.status(500).json({error: error});
    });
  } else if ((!request.body.api_key) && (request.query.location)) {
    response.status(400).json({error: 'Bad Request! Did you send in an Api Key?'});
  } else if ((request.body.api_key) && (!request.query.location)) {
    response.status(400).json({error: 'Bad Request! Did you send in a location?'});
  }
});

module.exports = router;
