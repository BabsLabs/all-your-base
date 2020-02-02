const fetch = require('node-fetch');

async function getForecasts(location, latAndLongGoogleResults) {
  const darkSkyApiKey = process.env.DARKSKY_API_KEY;
  const darkSkyUrl = `https://api.darksky.net/forecast/${darkSkyApiKey}/${latAndLongGoogleResults}?exclude=minutely,flags&units=us`;
  let response = await fetch(darkSkyUrl);
  let forecast = await response.json();
  let forecastForAFav = { location: location.location, current_weather: forecast.currently };
  return forecastForAFav; // object literal - not promise object
}

module.exports = getForecasts;