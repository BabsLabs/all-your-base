const fetch = require('node-fetch');

async function getLatAndLongFromGoogle(location) {
  const googleApiKey = process.env.GOOGLE_API_KEY;
  const googleApiUrl =`https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=${googleApiKey}`;

  let response = await fetch(googleApiUrl);
  let googleGeocodeResponse = await response.json();
  const latAndLng = googleGeocodeResponse.results[0].geometry.location;
  const joinedLatAndLng = `${latAndLng.lat},${latAndLng.lng}`;
  return joinedLatAndLng;
}

module.exports = getLatAndLongFromGoogle;