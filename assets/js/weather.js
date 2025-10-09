// логіка API, показ погоди

import {setTime} from "./common.js"

const mainTemperature = document.querySelector(".content_info-temperature");
const feelsLike = document.querySelector(".feels_like");
const humidity = document.querySelector(".humidity");
const wind = document.querySelector(".wind");
const precipitation = document.querySelector(".precipitation");
const min_days_temp = document.querySelectorAll(".min_day");
const max_days_temp = document.querySelectorAll(".max_day");
const city_country=document.querySelector(".content_city")
const main_icon=document.querySelector(".content_info-img");
const day_week_img=document.querySelectorAll(".content_daily_forecast-grid-img")
const hourly_div=document.querySelectorAll(".hourly_forecast-body-header");
const hourly_img=document.querySelector(".pm_img")

const weatherIcons = {
  0: "../assets/images/icon-loading.svg",
  1: "../assets/images/icon-sunny.webp",
  2: "../assets/images/icon-partly-cloudy.webp",
  3: "../assets/images/icon-partly-cloudy.webp",
  45: "../assets/images/icon-fog.webp",
  48: "../assets/images/icon-fog.webp",
  51: "../assets/images/icon-drizzle.webp",
  53: "../assets/images/icon-drizzle.webp",
  55: "../assets/images/icon-drizzle.webp",
  61: "../assets/images/icon-rain.webp",
  63: "../assets/images/icon-rain.webp",
  65: "../assets/images/icon-rain.webp",
  71: "../assets/images/icon-snow.webp",
  73: "../assets/images/icon-snow.webp",
  75: "../assets/images/icon-snow.webp",
  80: "../assets/images/icon-rain.webp",
  81: "../assets/images/icon-rain.webp",
  82: "../assets/images/icon-rain.webp",
  85: "../assets/images/icon-snow.webp",
  86: "../assets/images/icon-snow.webp",
  95: "../assets/images/icon-storm.webp",
  96: "../assets/images/icon-storm.webp",
  99: "../assets/images/icon-storm.webp"
};

const hourlyBlocks = setTime();

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

    data.daily.weather_code.forEach((img, i) => {
        const code_img=weatherIcons[img];
        day_week_img[i].style.backgroundImage = `url(${code_img})`;
    })

   for (let i = 0; i < 24 && i < data.hourly.temperature_2m.length; i++) {
        const temp = data.hourly.temperature_2m[i];
        const code = data.hourly.weather_code[i];
        const icon = weatherIcons[code] || weatherIcons[0];

        if (hourlyBlocks[i]) {
            hourlyBlocks[i].tempP.textContent = `${Math.round(temp)}°`;
            hourlyBlocks[i].imgDiv.style.backgroundImage = `url(${icon})`;
        }
    }
   main_icon.style.backgroundImage = `url(${weatherIcons[data.current.weather_code]})`;
}



document.addEventListener('citySelected', (e) => {
    const cityData = e.detail;
    getWeather(cityData.latitude, cityData.longitude);
    city_country.innerText=`${cityData.name}, ${cityData.country}`

});
