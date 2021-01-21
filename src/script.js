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
  let apiKey = "a2e5028c14210b1823ceb2133cbf4676";
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
  console.log(code);
  let iconCodes = ["01d", "01n", "02d", "02n", "03d", "03n", "04d", "04n", "09d", "09n", "10d", "10n", "11d", "11n", "13d", "13n", "50d", "50n"];
  let icons = ["<i class='fas fa-sun'></i>", "<i class='fas fa-moon'></i>", "<i class='fas fa-cloud-sun'></i>", "<i class='fas fa-cloud-moon'></i>", "<i class='fas fa-cloud'></i>", "<i class='fas fa-cloud'></i>", "<i class='fas fa-cloud'></i>", "<i class='fas fa-cloud'></i>", "<i class='fas fa-cloud-sun-rain'></i>", "<i class='fas fa-cloud-moon-rain'></i>", "<i class='fas fa-cloud-showers-heavy'></i>", "<i class='fas fa-cloud-showers-heavy'></i>", "<i class='fas fa-bolt'></i>", "<i class='fas fa-bolt'></i>", "<i class='fas fa-snowflake'></i>", "<i class='fas fa-snowflake'></i>", "<i class='fas fa-smog'></i>", "<i class='fas fa-smog'></i>"]
  let iconIndex = iconCodes.indexOf(code);
  document.querySelector("#main-weather-icon").innerHTML = icons[iconIndex];
  document.querySelector(".days-weather-img").innerHTML = icons[iconIndex];
}


function displayWeatherConditions(response){
  console.log(response);
  document.querySelector("#city-name").innerHTML = response.data.name;
  document.querySelector("#country-name").innerHTML = response.data.sys.country;
  mainTemp.innerHTML = Math.round(response.data.main.temp);
  document.querySelector("#weather-word").innerHTML = capitalise(response.data.weather[0].description);
  document.querySelector("#pressure").innerHTML = response.data.main.pressure;
  document.querySelector("#humidity").innerHTML = response.data.main.humidity;
  document.querySelector("#wind").innerHTML = Math.round(response.data.wind.speed);
  document.querySelector(".max-temp").innerHTML = Math.round(response.data.main.temp_max);
  document.querySelector(".min-temp").innerHTML = `${Math.round(response.data.main.temp_min)}`;
  displayWeatherIcon(response.data.weather[0].icon);
}

function searchCity(city) {
  let apiKey = "a2e5028c14210b1823ceb2133cbf4676";
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

  //Set date and time

let now = new Date();
let weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
let weekDay = weekDays[now.getDay()];
let hour = now.getHours();
let minute = now.getMinutes();
if (minute < 10){
  minute = "0" + minute;
}
let dayAndTime = document.querySelector("#day-and-time");
dayAndTime.innerHTML = `${weekDay}, ${hour}:${minute}`;
let bottomDays = document.querySelectorAll(".bottom-days");
bottomDays.forEach(changeBottomDays);

  //Set current temp

searchCity("London")

//Search form

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", handleSubmit);

//Current location

let currentLocationButton = document.querySelector("#current-location-btn");
currentLocationButton.addEventListener("click", getPosition);

//Change unit

let mainTemp = document.querySelector("#temp");
let mainUnit = document.querySelector("#unit");
let altUnit = document.querySelector("#alt-unit");
altUnit.addEventListener("click", changeUnit);

