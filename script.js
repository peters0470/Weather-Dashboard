var APIKey = "57ef72e4f3efee9ee21528ce834c61ef";

function getWeather(cityName) {
    var weatherURL = "https://api.openweathermap.org/data/2.5.weather?q=" + cityName + "&appid=" + APIKey;
    fetch(weatherURL).then(function(response) {
        return response.json()
     })
     .then(function(data) {

        var currentDate = new Date(data.dt*1000);
        var day = currentDate.getDate();
        var month = currentDate.getMonth();
        var year = currentDate.getFullYear();
        var weatherPic = data.weather[0].icon;
        var lon = data.coord.lon;
        var lat = data.coord.lon;


     })

}
  