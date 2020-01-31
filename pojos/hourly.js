let HourlyForecast = require("./hourly_forecast");

class Hourly {

  constructor(data) {
    this.summary = data.hourly.summary;
    this.icon = data.hourly.icon;
    this.data = this.hourlyForecast(data);
  }

  hourlyForecast(data) {
    let eightHoursOfForecastData = data.hourly.data.slice(0, 8);

    let forecastArray = [];
    let x = eightHoursOfForecastData.forEach(function (item, index) {
      let forecast = new HourlyForecast(item);
      forecastArray.push(forecast);
    });
    return forecastArray;
  }
}

module.exports = Hourly;