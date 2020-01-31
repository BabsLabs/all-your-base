const Currently = require('./currently');
const Hourly = require('./hourly');
const Daily = require('./daily');

class Forecast {

  constructor(location, data) {
    this.location = location;
    this.currently = new Currently(data);
    this.hourly = new Hourly(data);
    this.daily = new Daily(data);
  }

}

module.exports = Forecast;