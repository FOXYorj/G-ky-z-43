const apiKey = "f33197905c81dac6a77adf3e9f76b62e";

document.getElementById("getWeather").addEventListener("click", async () => {
  const district = document.getElementById("districtSelect").value;
  getWeather(district);
});

async function getWeather(city) {
  const currentURL = `https://api.openweathermap.org/data/2.5/weather?q=${city},TR&units=metric&lang=tr&appid=${apiKey}`;
  const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city},TR&units=metric&lang=tr&appid=${apiKey}`;

  const currentWeatherDiv = document.getElementById("currentWeather");
  const forecastContainer = document.getElementById("forecastContainer");

  currentWeatherDiv.innerHTML = "<p>Yükleniyor...</p>";
  forecastContainer.innerHTML = "";

  try {
    // Anlık hava durumu
    const currentRes = await fetch(currentURL);
    const currentData = await currentRes.json();

    const icon = `https://openweathermap.org/img/wn/${currentData.weather[0].icon}@2x.png`;
    currentWeatherDiv.innerHTML = `
      <h2>${city}</h2>
      <img src="${icon}" alt="Hava">
      <h3>${currentData.weather[0].description}</h3>
      <p>🌡️ Sıcaklık: ${currentData.main.temp}°C</p>
      <p>🤔 Hissedilen: ${currentData.main.feels_like}°C</p>
      <p>💧 Nem: ${currentData.main.humidity}%</p>
      <p>💨 Rüzgar: ${currentData.wind.speed} m/s</p>
    `;

    // Saatlik tahmin
    const forecastRes = await fetch(forecastURL);
    const forecastData = await forecastRes.json();

    const nextHours = forecastData.list.slice(0, 8); // 24 saatlik (3 saat aralıklarla)
    nextHours.forEach(item => {
      const date = new Date(item.dt * 1000);
      const hour = date.getHours().toString().padStart(2, "0");
      const icon = `https://openweathermap.org/img/wn/${item.weather[0].icon}.png`;

      const div = document.createElement("div");
      div.className = "forecast";
      div.innerHTML = `
        <strong>${hour}:00</strong>
        <img src="${icon}" alt="hava">
        <p>${item.main.temp}°C</p>
      `;
      forecastContainer.appendChild(div);
    });

  } catch (error) {
    currentWeatherDiv.innerHTML = "<p>Veri alınamadı 😔</p>";
    console.error(error);
  }
}

// Sayfa açılınca Kütahya Merkez gösterilsin
getWeather("Kutahya");
