class HourlyForecast {

  constructor(data) {
    this.time = data.time;
    this.summary = data.summary;
    this.icon = data.icon;
    this.percipIntensity = data.percipIntensity;
    this.precipProbability = data.precipProbability;
    this.temperature = data.temperature;
    this.humidity = data.humidity;
    this.pressure = data.pressure;
    this.windSpeed = data.windSpeed;
    this.windGust = data.windGust;
    this.windBearing = data.windBearing;
    this.cloudCover = data.cloudCover;
    this.visibility = data.visibility;
  }

}

module.exports = HourlyForecast;