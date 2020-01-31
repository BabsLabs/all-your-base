class DailyForecast {

  constructor(data) {
    this.time = data.time;
    this.summary = data.summary;
    this.icon = data.icon;
    this.sunriseTime = data.sunriseTime;
    this.sunsetTime = data.sunsetTime;
    this.percipIntensity = data.percipIntensity;
    this.percipIntensityMax = data.percipIntensityMax;
    this.percipIntensityMaxTime = data.percipIntensityMaxTime;
    this.precipProbability = data.precipProbability;
    this.precipType = data.precipType;
    this.temperatureHigh = data.temperatureHigh;
    this.temperatureLow = data.temperatureLow;
    this.humidity = data.humidity;
    this.pressure = data.pressure;
    this.windSpeed = data.windSpeed;
    this.windGust = data.windGust;
    this.cloudCover = data.cloudCover;
    this.visibility = data.visibility;
    this.temperatureMin = data.temperatureMin;
    this.temperatureMax = data.temperatureMax;
  }

}

module.exports = DailyForecast;