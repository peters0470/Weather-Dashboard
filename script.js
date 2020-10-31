var APIKey = "57ef72e4f3efee9ee21528ce834c61ef";
var cityEl = document.getElementById("city-input");
var searchCityEl = document.getElementById("search-button");
var clearHistoryEl = document.getElementById("clear-history");
var cityNameEl = document.getElementById("city-name");
var weatherPicEl = document.getElementById("current-pic");
var currentTemperatureEl = document.getElementById("temperature");
var currentHumidityEl = document.getElementById("humidity");
var currentWindSpeedEl = document.getElementById("wind-speed");
var currentUvEl = document.getElementById("UV-index");
var historyEl = document.getElementById("history");

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
        var lat = data.coord.lat;

        weatherPicEl.setAttribute("src","https://openweathermap.org/img/wn/" + weatherPic + "@2x.png");
        weatherPicEl.setAttribute("alt",data.weather[0].description);
        cityNameEl.innerHTML = data.name + " (" + month + "/" + day + "/" + year + ") ";
        currentHumidityEl.innerHTML = "Humidity: " + data.main.humidity + "%";
        currentWindSpeedEl.innerHTML = "Wind Speed: " + data.wind.speed + "mph";

        var uvGetURL = "https://api.openweathermap.org/data/2.5/uvi/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey + "&cnt=1";
        fetch(uvGetURL)
        .then(function(response){
           return response.json()
        })
        .then(function(data){
           var UVIndex = document.createElement("span");
           UVIndex.setAttribute("class", "badge badge-danger");
           UVIndex.innerHTML = data[0].value;
           currentUvEl.innerHTML = "UV Index: ";
           currentUvEl.append(UVIndex) ;
        });


     })

}
  