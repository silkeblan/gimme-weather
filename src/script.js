function changeDayUnits(temp) {
  let rawFahrenheit = (temp.innerHTML * 9/5) + 32;
  if (mainUnit.innerHTML === "°F") {
    temp.innerHTML = Math.round(rawFahrenheit);
  } else {
    let rawCelsius = (temp.innerHTML - 32) * 5/9
    temp.innerHTML = Math.round(rawCelsius);
  }
}

function changeUnit(event) {
  event.preventDefault();
    let rawFahrenheit = (mainTemp.innerHTML * 9/5) + 32;
  if (altUnit.innerHTML === "°F") {
    mainUnit.innerHTML = "°F";
    altUnit.innerHTML = "°C";
    mainTemp.innerHTML = Math.round(rawFahrenheit);
  } else {
    let rawCelsius = (mainTemp.innerHTML - 32) * 5/9
    mainUnit.innerHTML = "°C";
    altUnit.innerHTML = "°F";
    mainTemp.innerHTML = (Math.round(rawCelsius));
  }
  document.querySelectorAll(".max-temp").forEach(changeDayUnits);
  document.querySelectorAll(".min-temp").forEach(changeDayUnits);
}

function calculateCoords(position) {
  let lat = position.coords.latitude;
  let long = position.coords.longitude;
  let units = "metric";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${apiKey}&units=${units}`
  axios.get(apiUrl).then(displayWeatherConditions);
}

function getPosition(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(calculateCoords)
}

function capitalise(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function displayWeatherIcon(code) {
  let iconIndex = iconCodes.indexOf(code);
  document.querySelector("#main-weather-icon").innerHTML = icons[iconIndex];
}

function setTime(timestamp) {
  let lastUpdateTime = new Date(timestamp);
  let weekDay = weekDays[lastUpdateTime.getDay()];
  let hour = lastUpdateTime.getHours();
  let minute = lastUpdateTime.getMinutes();
  if (minute < 10){
  minute = `0${minute}`;
}
  document.querySelector("#day-and-time").innerHTML = `${weekDay}, ${hour}:${minute}`;
}

function displayWeatherConditions(response) {
  document.querySelector("#city-name").innerHTML = response.data.name;
  document.querySelector("#country-name").innerHTML = response.data.sys.country;
  let timestamp = response.data.dt * 1000;
  setTime(timestamp);
  mainTemp.innerHTML = Math.round(response.data.main.temp);
  document.querySelector("#weather-word").innerHTML = capitalise(response.data.weather[0].description);
  document.querySelector("#pressure").innerHTML = response.data.main.pressure;
  document.querySelector("#humidity").innerHTML = response.data.main.humidity;
  document.querySelector("#wind").innerHTML = Math.round(response.data.wind.speed);
  displayWeatherIcon(response.data.weather[0].icon);
  let lat = response.data.coord.lat;
  let lon = response.data.coord.lon;
  getForecast(lat, lon);
}

function getForecast(lat, lon) {
  apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function displayForecast(response) {
let minTemps = Array.from(document.querySelectorAll(".min-temp"));
let maxTemps = Array.from(document.querySelectorAll(".max-temp"));
let weatherImgs = Array.from(document.querySelectorAll(".days-weather-img"));
for (let index = 0; index < 6; index++) {
  let maxTemp = Math.round(response.data.daily[index].temp.max);
  let minTemp = Math.round(response.data.daily[index].temp.min);
  let imgCode = response.data.daily[index].weather[0].icon;
  let iconIndex = iconCodes.indexOf(imgCode);
  minTemps[index].innerHTML = minTemp;
  maxTemps[index].innerHTML = maxTemp;
  weatherImgs[index].innerHTML = icons[iconIndex];
  if (8 < iconIndex && iconIndex <= 13) {
    weatherImgs[index].style.color = "rgb(190, 35, 68)";
  } else if (2 < iconIndex && iconIndex < 7 || iconIndex > 13) {
    weatherImgs[index].style.color = "#eb9635";
  } else { weatherImgs[index].style.color = "rgb(49, 175, 97)";

  }
}
}

function searchCity(city) {
  let units = "metric"
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;
  document.querySelector("#location-input").value = null;
  axios.get(apiUrl).then(displayWeatherConditions);
}

function handleSubmit(event) {
  event.preventDefault();
  let cityName = document.querySelector("#location-input").value.trim().toLowerCase();
  searchCity(cityName);
}

function changeBottomDays(day) {
  let todayIndex = now.getDay()
  let bottomDaysArray = Array.from(bottomDays);
  let dayIndex = bottomDaysArray.indexOf(day);
  if (todayIndex + dayIndex <= 6) {
    day.innerHTML = weekDays[todayIndex + dayIndex];
  } else {
    let newIndex = todayIndex + dayIndex - 7;
    day.innerHTML = weekDays[newIndex];
  }
}

let apiKey = "a2e5028c14210b1823ceb2133cbf4676";
searchCity("London")

let iconCodes = ["01d", "01n", "02d", "02n", "03d", "03n", "04d", "04n", "09d", "09n", "10d", "10n", "11d", "11n", "13d", "13n", "50d", "50n"];
let icons = ["<i class='fas fa-sun'></i>", "<i class='fas fa-moon'></i>", "<i class='fas fa-cloud-sun'></i>", "<i class='fas fa-cloud-moon'></i>", "<i class='fas fa-cloud'></i>", "<i class='fas fa-cloud'></i>", "<i class='fas fa-cloud'></i>", "<i class='fas fa-cloud'></i>", "<i class='fas fa-cloud-sun-rain'></i>", "<i class='fas fa-cloud-moon-rain'></i>", "<i class='fas fa-cloud-showers-heavy'></i>", "<i class='fas fa-cloud-showers-heavy'></i>", "<i class='fas fa-bolt'></i>", "<i class='fas fa-bolt'></i>", "<i class='fas fa-snowflake'></i>", "<i class='fas fa-snowflake'></i>", "<i class='fas fa-smog'></i>", "<i class='fas fa-smog'></i>"]

let now = new Date();
let weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
let bottomDays = document.querySelectorAll(".bottom-days");
bottomDays.forEach(changeBottomDays);

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", handleSubmit);

let currentLocationButton = document.querySelector("#current-location-btn");
currentLocationButton.addEventListener("click", getPosition);

let mainTemp = document.querySelector("#temp");
let mainUnit = document.querySelector("#unit");
let altUnit = document.querySelector("#alt-unit");
altUnit.addEventListener("click", changeUnit);