const apiKey = "f33197905c81dac6a77adf3e9f76b62e";
const weatherDetails = document.getElementById("weatherDetails");
const forecastContainer = document.getElementById("forecastContainer");
const districtSelect = document.getElementById("districtSelect");

async function getWeather(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city},TR&appid=${apiKey}&units=metric&lang=tr`;
  const res = await fetch(url);
  const data = await res.json();

  weatherDetails.innerHTML = `
    <h3>${data.name}</h3>
    <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png">
    <p><b>${data.weather[0].description.toUpperCase()}</b></p>
    <p>🌡️ Sıcaklık: ${data.main.temp}°C</p>
    <p>🤔 Hissedilen: ${data.main.feels_like}°C</p>
    <p>💧 Nem: ${data.main.humidity}%</p>
    <p>🌬️ Rüzgar: ${data.wind.speed} m/s</p>
  `;
}

async function getForecast(city) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city},TR&appid=${apiKey}&units=metric&lang=tr`;
  const res = await fetch(url);
  const data = await res.json();

  forecastContainer.innerHTML = "";
  const daily = {};

  data.list.forEach(item => {
    const date = item.dt_txt.split(" ")[0];
    if (!daily[date]) {
      daily[date] = item;
    }
  });

  Object.keys(daily).slice(0, 5).forEach(date => {
    const item = daily[date];
    forecastContainer.innerHTML += `
      <div class="forecast-card">
        <h4>${new Date(date).toLocaleDateString("tr-TR", { weekday: "long" })}</h4>
        <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}.png">
        <p>${item.weather[0].description}</p>
        <p>🌡️ ${item.main.temp_min.toFixed(0)}° / ${item.main.temp_max.toFixed(0)}°</p>
      </div>
    `;
  });
}

districtSelect.addEventListener("change", () => {
  const city = districtSelect.value;
  getWeather(city);
  getForecast(city);
});

getWeather("Kütahya");
getForecast("Kütahya");
