const fetch = require('node-fetch');
const Currently = require('../pojos/currently');

async function getForecasts(location, latAndLongGoogleResults) {
  const darkSkyApiKey = process.env.DARKSKY_API_KEY;
  const darkSkyUrl = `https://api.darksky.net/forecast/${darkSkyApiKey}/${latAndLongGoogleResults}?exclude=minutely,flags&units=us`;
  let response = await fetch(darkSkyUrl);
  let forecast = await response.json();
  let forecastForAFav = { location: location.location, current_weather: new Currently(forecast) };
  return forecastForAFav; // object literal - not promise object
}

module.exports = getForecasts;