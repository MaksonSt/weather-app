// логіка API, показ погоди
const mainTemperature = document.querySelector(".content_info-temperature");
const feelsLike = document.querySelector(".feels_like");
const humidity = document.querySelector(".humidity");
const wind = document.querySelector(".wind");
const precipitation = document.querySelector(".precipitation");
const min_days_temp = document.querySelectorAll(".min_day");
const max_days_temp = document.querySelectorAll(".max_day");
const city_country=document.querySelector(".content_city")
async function getWeather(latitude, longitude) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum&hourly=temperature_2m,weather_code&current=temperature_2m,wind_speed_10m,relative_humidity_2m,weather_code,apparent_temperature&timezone=auto&timeformat=unixtime`;
    try {
        const meta = await fetch(url);
        const data = await meta.json();
        console.log(data)
        renderWeather(data);
    } catch (error) {
        console.error("Помилка getWeather: "+error);
    }
}

function renderWeather(data) {

    mainTemperature.innerText = `${Math.round(data.current.temperature_2m)}°`;
    feelsLike.innerText = `${Math.round(data.current.apparent_temperature)}°`;
    humidity.innerText = `${Math.round(data.current.relative_humidity_2m)}%`;
    wind.innerText = `${data.current.wind_speed_10m} km/h`;
    precipitation.innerText = `${data.daily.precipitation_sum[0]} mm`;

    data.daily.temperature_2m_min.forEach((temp, i) => {
        if (min_days_temp[i]) {
            min_days_temp[i].innerText = `${Math.round(temp)}°`;
        }
    });

    data.daily.temperature_2m_max.forEach((temp, i) => {
        if (max_days_temp[i]) {
            max_days_temp[i].innerText = `${Math.round(temp)}°`;
        }
    });
}

document.addEventListener('citySelected', (e) => {
    const cityData = e.detail;
    getWeather(cityData.latitude, cityData.longitude);
    city_country.innerText=`${cityData.name}, ${cityData.country}`
});
