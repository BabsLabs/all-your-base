const dotenv = require('dotenv').config();
var express = require('express');
var router = express.Router();

const getLatAndLongFromGoogle = require('../../../services/google_service');
const Forecast = require('../../../pojos/forecast');

const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../../knexfile')[environment];
const database = require('knex')(configuration);
const fetch = require('node-fetch');

router.post('/', (request, response) => {
    if (request.body.api_key) {
    database('users').where('api_key', request.body.api_key).first()
      .then((user) => {
        if (user && request.body.location) {

          let favoriteLocation = request.body.location;

          database('favorites').insert([
            { location: favoriteLocation, user_id: user.id },
          ])
            .then(favoriteLocation => {
              console.log(favoriteLocation);
              response.status(201).json({ "message": `${request.body.location} has been added to your favorites` });
            })
            .catch(error => {
              response.status(500).json({ error: `There was the following error: ${error.message}` });
            });


        } else if (!request.body.location && user ){
          response.status(400).json({error: 'Bad Request! Are you missing a location?'});
        } else if (!user) {
          response.status(401).json({error: 'Unauthorized!'});
        }
      }).catch(error => console.log(error));
    } else {
      response.status(400).json({error: 'Bad Request! Did you send an Api Key?'});
    }
});

router.delete('/', (request, response) => {
    if (request.body.api_key) {
    database('users').where('api_key', request.body.api_key).first()
      .then((user) => {
        if (user && request.body.location) {

          let favoriteLocation = request.body.location;

          database('favorites').del().where(
            { location: favoriteLocation, user_id: user.id }
          )
            .then(favoriteLocation => {
              response.status(204).send();
            })
            .catch(error => {
              response.status(500).json({ error });
            });


        } else if (!request.body.location && user ){
          response.status(400).json({error: 'Bad Request! Are you missing a location?'});
        } else if (!user) {
          response.status(401).json({error: 'Unauthorized!'});
        }
      }).catch(error => console.log(error));
    } else {
      response.status(400).json({error: 'Bad Request! Did you send an Api Key?'});
    }
});

router.get('/', (request, response) => {
    if (request.body.api_key) {
    database('users').where('api_key', request.body.api_key).first()
      .then((user) => {
        if (user) {

          database('favorites').where('user_id', user.id)
            .then(favoriteLocations => {
              if (favoriteLocations.length) {

                const results = favoriteLocations.map( async (location) => {
                    const forecastResults = await getForecasts(location, await getLatAndLongFromGoogle(location.location));
                    return forecastResults;
                });

                Promise.all(results)
                  .then(data => {
                    response.status(200).json(data);
                  });

          } else {
                response.status(200).json({ message: 'No favorites found.' });
              }
            })
            .catch(error => {
              console.log(error.message)
              response.status(500).json({error: `There was the following error: ${error.message}`});
            });
        } else if (!user) {
          response.status(401).json({error: 'Unauthorized!'});
        }
      }).catch(error => {
        console.log(error.message);
        response.status(500).json({error: `There was the following error: ${error.message}`});
      });
    } else {
      response.status(400).json({error: 'Bad Request! Did you send an Api Key?'});
    }
});


async function getForecasts(location, latAndLongGoogleResults) {
  const darkSkyApiKey = process.env.DARKSKY_API_KEY;
  const darkSkyUrl = `https://api.darksky.net/forecast/${darkSkyApiKey}/${latAndLongGoogleResults}?exclude=minutely,flags&units=us`;
  let response = await fetch(darkSkyUrl);
  let forecast = await response.json();
  let forecastForAFav = { location: location.location, current_weather: forecast.currently };
  return forecastForAFav; // object literal - not promise object
}

module.exports = router;