const apiKey = "f33197905c81dac6a77adf3e9f76b62e";

// 🔊 TAM RAPOR SESLİ OKUMA (Hatalar giderildi)
function speakFullReport() {
    const city = document.getElementById('cityName').innerText;
    const temp = document.querySelector('.main-temp')?.innerText || "";
    const desc = document.getElementById('mainDesc')?.innerText || "";
    const advice = document.getElementById('adviceText').innerText;
    
    let text = `${city} için güncel durum: Hava ${desc} ve sıcaklık ${temp} derece. Tavsiyemiz: ${advice}. `;
    
    const forecasts = document.querySelectorAll('.f-card');
    text += "Önümüzdeki günlerde: ";
    forecasts.forEach((card, index) => {
        if(index < 3) {
            const day = card.querySelector('b').innerText;
            const fDesc = card.querySelector('.f-status').innerText;
            text += `${day} günü hava ${fDesc}. `;
        }
    });

    const msg = new SpeechSynthesisUtterance(text);
    msg.lang = 'tr-TR';
    window.speechSynthesis.speak(msg);
}

// 🛰️ VERİ MOTORU
async function updateWeather(city) {
    try {
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city},TR&appid=${apiKey}&units=metric&lang=tr`);
        const data = await res.json();

        document.getElementById('cityName').innerText = data.name;
        document.getElementById('windVal').innerText = data.wind.speed + " m/s";
        document.getElementById('humVal').innerText = "%" + data.main.humidity;
        document.getElementById('presVal').innerText = data.main.pressure + " hPa";
        document.getElementById('visVal').innerText = (data.visibility / 1000) + " km";
        document.getElementById('updateTime').innerText = "Güncellendi: " + new Date().toLocaleTimeString();

        // Kıyafet Önerisi
        let advice = "👕 Rahat bir tişört yeterli.";
        if(data.main.temp < 10) advice = "🧥 Hava soğuk, kalın mont giyin.";
        else if(data.main.temp < 20) advice = "🧥 Hafif bir ceket iyi olur.";
        document.getElementById('adviceText').innerText = advice;

        document.getElementById('weatherHero').innerHTML = `
            <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png">
            <h1 class="main-temp">${Math.round(data.main.temp)}°</h1>
            <p id="mainDesc" style="text-transform:capitalize; font-size:1.2rem; opacity:0.8">${data.weather[0].description}</p>
        `;

        updateForecast(city);
        localStorage.setItem('lastCity', city);
    } catch(e) { console.error("Hata!"); }
}

async function updateForecast(city) {
    const res = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city},TR&appid=${apiKey}&units=metric&lang=tr`);
    const data = await res.json();
    const row = document.getElementById('forecastRow');
    row.innerHTML = "";

    data.list.filter(f => f.dt_txt.includes("12:00:00")).forEach(day => {
        const dName = new Date(day.dt * 1000).toLocaleDateString('tr-TR', {weekday: 'long'});
        row.innerHTML += `
            <div class="f-card glass-inner">
                <p><b>${dName}</b></p>
                <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png">
                <strong>${Math.round(day.main.temp)}°</strong>
                <span class="f-status">${day.weather[0].description}</span>
            </div>
        `;
    });
}

const saved = localStorage.getItem('lastCity') || "Kütahya";
document.getElementById('districtSelect').value = saved;
document.getElementById('districtSelect').onchange = (e) => updateWeather(e.target.value);
updateWeather(saved);