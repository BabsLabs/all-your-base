const dotenv = require('dotenv').config();
var express = require('express');
var router = express.Router();

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
        if (user && request.body.location) {

          let favoriteLocation = request.body.location;

          database('favorites').where('user_id', user.id)
            .then(favoriteLocation => {
              
              let favoriteLocationArray = [];
              favoriteLocation.forEach((location, i) => {
                favoriteLocationArray.push(location.location);
              });
              console.log(favoriteLocationArray);


              response.status(200).json(favoriteLocation);
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

module.exports = router;