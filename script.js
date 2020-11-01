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
var searchHistory = JSON.parse(localStorage.getItem("search")) || [];

function getWeather(cityName) {
    var weatherURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + APIKey;
    fetch(weatherURL).then(function(response) {
        return response.json()
     })
     .then(function(data) {

        var currentDate = new Date(data.dt*1000);
        var day = currentDate.getDate();
        var month = currentDate.getMonth() + 1;
        var year = currentDate.getFullYear();
        var weatherPic = data.weather[0].icon;
        var lon = data.coord.lon;
        var lat = data.coord.lat;
        console.log("weather");

        weatherPicEl.setAttribute("src","https://openweathermap.org/img/wn/" + weatherPic + "@2x.png");
        weatherPicEl.setAttribute("alt",data.weather[0].description);
        cityNameEl.innerHTML = data.name + " (" + month + "/" + day + "/" + year + ") ";
        currentTemperatureEl.innerHTML = "Temperature: " + convertToFahrenheit(data.main.temp) + " &#176F"
        currentHumidityEl.innerHTML = "Humidity: " + data.main.humidity + "%";
        currentWindSpeedEl.innerHTML = "Wind Speed: " + data.wind.speed + "mph";

        var uvGetURL = "https://api.openweathermap.org/data/2.5/uvi/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey + "&cnt=1";
        fetch(uvGetURL)
        .then(function(response){
           return response.json()
        })
        .then(function(data){
           var UVIndex = document.createElement("span");
           UVIndex.innerHTML = data[0].value;
           let indexValue = data[0].value;
           currentUvEl.innerHTML = "UV Index: ";
           currentUvEl.append(UVIndex);
          
           if (0 < indexValue && indexValue < 3) {
              UVIndex.setAttribute("class", "badge badge-success");
              console.log("case 1 has activated");
           }
           if (3 < indexValue && indexValue < 7) {
              UVIndex.setAttribute("class", "badge badge-warning");
              console.log("case 2 has been activated");
           } 
           if (7 < indexValue && indexValue < 10) {
              UVIndex.setAttribute("class", "badge badge-danger");
              console.log("case 3 has been activated");
           }
           
        });
 
        var cityID = data.id;
        var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?id=" + cityID + "&appid=" + APIKey;
        fetch(forecastURL).then(function(response){
           return response.json()
        })
        .then(function(data){

         var fiveDayForecast = document.querySelectorAll(".forecast");
         for (i = 0; i < fiveDayForecast.length; i++) {

            fiveDayForecast[i].innerHTML = "";
            var fiveDayIndex = i*8 + 4;
            var fiveDayDate = new Date(data.list[fiveDayIndex].dt * 1000);
            var fiveDayYear = fiveDayDate.getFullYear();
            var fiveDayMonth = fiveDayDate.getMonth() + 1;
            var fiveDayDay = fiveDayDate.getDate();

            var fiveDayDateEl = document.createElement("p");
            fiveDayDateEl.setAttribute("class", "mt-3 mb-0 five-day-date");
            fiveDayDateEl.innerHTML = fiveDayMonth + "/" + fiveDayDay + "/" + fiveDayYear;
            fiveDayForecast[i].append(fiveDayDateEl);

            var forecastedWeatherEl = document.createElement("img");
            forecastedWeatherEl.setAttribute("src","https://openweathermap.org/img/wn/" + data.list[fiveDayIndex].weather[0].icon + "@2x.png");
            forecastedWeatherEl.setAttribute("alt", data.list[fiveDayIndex].weather[0].description);
            fiveDayForecast[i].append(forecastedWeatherEl);

            var forecastedTemperatureEl = document.createElement("p");
            forecastedTemperatureEl.innerHTML = "Temp: " + convertToFahrenheit(data.list[fiveDayIndex].main.temp) + "&#176F";
            fiveDayForecast[i].append(forecastedTemperatureEl);

            var forecastedHumidityEl = document.createElement("p");
            forecastedHumidityEl.innerHTML = "Humidity: " + data.list[fiveDayIndex].main.humidity + "%";
            fiveDayForecast[i].append(forecastedHumidityEl);

         }
        })
     })
}
searchCityEl.addEventListener("click", function(){
   var searchCity = cityEl.value;
   getWeather(searchCity);
   
   if (searchHistory.includes(searchCity) == false) {
      searchHistory.push(searchCity);
   }
   localStorage.setItem("search",JSON.stringify(searchHistory));
   displaySearchHistory();
   
})

clearHistoryEl.addEventListener("click",function() {
   searchHistory = [];
   localStorage.setItem("search",JSON.stringify(searchHistory));
   displaySearchHistory();
})

function displaySearchHistory() {
   historyEl.innerHTML = "";
   console.log(searchHistory);
   for (var i = 0; i < searchHistory.length; i++) {
      var pastCity = document.createElement("input");
      pastCity.setAttribute("type","text");
      pastCity.setAttribute("readonly",true);
      pastCity.setAttribute("class", "form-control d-block bg-white");
      pastCity.setAttribute("value", searchHistory[i]);
      let cityName = searchHistory[i];
      pastCity.addEventListener("click",function() {
         getWeather(cityName);  
      })
      historyEl.append(pastCity);
   }
}

displaySearchHistory();
if (searchHistory.length > 0) {
   getWeather(searchHistory[searchHistory.length - 1]);
}


function convertToFahrenheit(k) {
   return Math.floor((k - 273.15) * 1.8 + 32);
}
  