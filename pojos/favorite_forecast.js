class FavoriteForecast {

  constructor(location, data) {
    this.location = location.location;
    this.current_weather = data.currently;
  }

}

module.exports = FavoriteForecast;