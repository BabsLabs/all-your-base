let DailyForecast = require("./daily_forecast");

class Daily {
  constructor(data) {
    this.summary = data.daily.summary;
    this.icon = data.daily.icon;
    this.data = this.dailyForecast(data);
  }

  dailyForecast(data) {
    let sevenDaysOfForecastData = data.daily.data.slice(0, 7);

    let forecastArray = [];
    let x = sevenDaysOfForecastData.forEach(function (item, index) {
      let forecast = new DailyForecast(item);
      forecastArray.push(forecast);
    });
    return forecastArray;
  }
}

module.exports = Daily;