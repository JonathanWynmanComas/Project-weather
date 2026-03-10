const apiKey = "ffd22d92a4e9a71cb36ce01768862405";

const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");
const currentWeather = document.getElementById("currentWeather");
const forecastEl = document.getElementById("forecast");
const historyEl = document.getElementById("history");

let searchHistory = JSON.parse(localStorage.getItem("cities")) || [];

function saveCity(city) {
if (!searchHistory.includes(city)) {
searchHistory.push(city);
localStorage.setItem("cities", JSON.stringify(searchHistory));
}
renderHistory();
}

function renderHistory() {
historyEl.innerHTML = "";

searchHistory.forEach(city => {
const btn = document.createElement("button");
btn.textContent = city;
btn.classList.add("btn","btn-secondary");

btn.addEventListener("click", () => {
getWeather(city);
});

historyEl.appendChild(btn);
});
}

async function getWeather(city) {

const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=imperial`;

const response = await fetch(url);
const data = await response.json();

displayCurrentWeather(data);
displayForecast(data);

saveCity(city);
}

function displayCurrentWeather(data) {

const city = data.city.name;
const weather = data.list[0];

currentWeather.innerHTML = `
<div class="card p-3">
<h3>${city}</h3>
<p>Temp: ${weather.main.temp} °F</p>
<p>Wind: ${weather.wind.speed} MPH</p>
<p>Humidity: ${weather.main.humidity}%</p>
</div>
`;
}

function displayForecast(data) {

forecastEl.innerHTML = "";

for (let i = 0; i < data.list.length; i += 8) {

const day = data.list[i];

const col = document.createElement("div");
col.classList.add("col-md-2");

col.innerHTML = `
<div class="card p-2 m-1">
<h6>${day.dt_txt.split(" ")[0]}</h6>
<p>Temp: ${day.main.temp}°F</p>
<p>Wind: ${day.wind.speed} MPH</p>
<p>Humidity: ${day.main.humidity}%</p>
</div>
`;

forecastEl.appendChild(col);
}
}

searchBtn.addEventListener("click", () => {

const city = cityInput.value.trim();

if (city === "") return;

getWeather(city);

cityInput.value = "";
});

renderHistory();
