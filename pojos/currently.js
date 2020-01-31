class Currently {

  constructor(data) {
    this.summary = data.currently.summary;
    this.icon = data.currently.icon;
    this.precipIntensity = data.currently.precipIntensity;
    this.precipProbability = data.currently.precipProbability;
    this.temperature = data.currently.temperature;
    this.humidity = data.currently.humidity;
    this.pressure = data.currently.pressure;
    this.windSpeed = data.currently.windSpeed;
    this.windGust = data.currently.windGust;
    this.windBearing = data.currently.windBearing;
    this.cloudCover = data.currently.cloudCover;
    this.visibility = data.currently.visibility;
  }

}

module.exports = Currently;