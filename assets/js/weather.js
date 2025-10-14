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
const error_api=document.querySelector(".error_api")
const hidden_layout=document.querySelector(".layout");
const content_form=document.querySelector(".content_form");
const error_api_btn=document.querySelector(".error_api_btn");
const loader=document.querySelector("#loader-overlay");
const content_city_date=document.querySelector(".content_city_date");
const content_info=document.querySelector(".content_info");
const daySelector = document.querySelector(".days_form");
const hourlyForecastContainer = document.querySelector(".hourly_forecast-body");

const weatherIcons = {
  0: "../assets/images/icon-overcast.webp",
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

let lastLatitude;
let lastLongitude;
let currentCity = {};

error_api.classList.add("hidden");
async function getWeather(latitude, longitude) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum&hourly=temperature_2m,weather_code&current=temperature_2m,wind_speed_10m,relative_humidity_2m,weather_code,apparent_temperature&timezone=auto&timeformat=unixtime`;
    lastLatitude = latitude;
    lastLongitude = longitude;
    loader.classList.remove("hidden");
    content_city_date.classList.add("hidden");
    content_info.classList.add("hidden");
    try {
        const meta = await fetch(url);
        const data = await meta.json();
        currentWeatherData = data;

        const locationToSave = {
            lat: latitude,
            lon: longitude,
            name: currentCity.name,
            country: currentCity.country
        };
        localStorage.setItem("lastLocation", JSON.stringify(locationToSave));
        console.log(data)
        processApiData(data);

        renderWeather(data);

        populateDaySelector();

        updateUIDisplay();

        if (processedForecastData.length > 0) {
            renderHourlyForecast(processedForecastData[0]);
        }

        error_api.classList.add("hidden");
        loader.classList.add("hidden");
        content_city_date.classList.remove("hidden");
        content_info.classList.remove("hidden");
        renderWeather(data);
    } catch (error) {
        content_form.classList.add("hidden");
            hidden_layout.classList.add("hidden");
        error_api.classList.remove("hidden");
        loader.classList.add("hidden");
        console.error("Помилка getWeather: "+error);
    }
}


function loadLastLocation(){
    const savedLocationJSON=localStorage.getItem("lastLocation");
    if(savedLocationJSON){
        const savedLocation=JSON.parse(savedLocationJSON);

        currentCity={name:savedLocation.name, country:savedLocation.country}

        getWeather(savedLocation.lat, savedLocation.lon);
    }
}

loadLastLocation();
error_api_btn.addEventListener("click",async ()=>{
    if (lastLatitude && lastLongitude) {
        await getWeather(lastLatitude, lastLongitude);
    }
})

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

let processedForecastData =[];

function processApiData(apiData) {
    const hourlyTime = apiData.hourly.time;
    const hourlyTemp = apiData.hourly.temperature_2m;
    const hourlyWeatherCode = apiData.hourly.weather_code;

    const allDays = [];
    let currentDayData = [];

    for (let i = 0; i < hourlyTime.length; i++) {
        const date = new Date(hourlyTime[i] * 1000);
        const hourData = {
            time: `${date.getHours()}:00`,
            temp: Math.round(hourlyTemp[i]),
            weatherCode: hourlyWeatherCode[i]
        };

        currentDayData.push(hourData);

        if (date.getHours() === 23 || i === hourlyTime.length - 1) {
            allDays.push({
                dateString: date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }),
                hourly: currentDayData
            });
            currentDayData = [];
        }
    }
    processedForecastData = allDays;
    console.log("Оброблений прогноз:", processedForecastData);
}

function populateDaySelector() {
    daySelector.innerHTML = '';

    processedForecastData.forEach((dayData, index) => {
        const option = document.createElement('option');

        option.textContent = dayData.dateString;

        option.style.fontWeight = 'bold';

        option.value = index;

        daySelector.appendChild(option);
    });
}

function renderHourlyForecast(dayData) {
    hourlyForecastContainer.innerHTML = '';

    dayData.hourly.forEach(hour => {

        const hourBlock = document.createElement('div');
        hourBlock.className = 'hourly_forecast-body-header';

        const imgHourDiv = document.createElement('div');
        imgHourDiv.className = 'pm_img_hour';

        const imgDiv = document.createElement('div');
        imgDiv.className = 'pm_img';

        imgDiv.style.backgroundImage = `url(${weatherIcons[hour.weatherCode]})`;

        const timeP = document.createElement('p');
        timeP.textContent = hour.time;

        const tempP = document.createElement('p');
        tempP.textContent = `${hour.temp}°`;

                let temp = hour.temp;
        if (currentUnits.temperature === 'fahrenheit') {
            temp = (temp * 9/5) + 32;
        }
        tempP.textContent = `${Math.round(temp)}°`;



        imgHourDiv.appendChild(imgDiv);
        imgHourDiv.appendChild(timeP);
        hourBlock.appendChild(imgHourDiv);
        hourBlock.appendChild(tempP);

        hourlyForecastContainer.appendChild(hourBlock);
    });
}

daySelector.addEventListener('change', (event) => {
    const selectedDayIndex = event.target.value;

    const selectedDayData = processedForecastData[selectedDayIndex];

    renderHourlyForecast(selectedDayData);
});




document.addEventListener('citySelected', (e) => {
    const cityData = e.detail;
     currentCity = {
        name: cityData.name,
        country: cityData.country
    };
    getWeather(cityData.latitude, cityData.longitude);
    city_country.innerText=`${cityData.name}, ${cityData.country}`

});

let currentUnits={
    temperature:"celsius",
    wind: 'kmh',
    precipitation: 'mm'
}

let currentWeatherData = null;

const buttonUnits=document.querySelector('.header_units')
const unitsBlock=document.querySelector('.units_block')
const units=document.querySelector('.units')
buttonUnits.addEventListener('click', ()=>{
    unitsBlock.classList.toggle('hidden');
})

document.addEventListener('click', (e)=>{
    if(!units.contains(e.target)) {
        unitsBlock.classList.add('hidden');
    }
})

unitsBlock.addEventListener('click', (event) => {

    const clickedOption = event.target.closest('.unit-option');
    if (!clickedOption) return;

    const unitType = clickedOption.dataset.unitType;
    const unitValue = clickedOption.dataset.unitValue;

    currentUnits[unitType] = unitValue;
    console.log('Нові одиниці:', currentUnits);

    const optionsInGroup = clickedOption.parentElement.querySelectorAll('.unit-option');
    optionsInGroup.forEach(option => option.classList.remove('active'));

    clickedOption.classList.add('active');

    updateUIDisplay();
});

function updateUIDisplay() {

    if (!currentWeatherData) {
        console.log("Дані про погоду ще не завантажені.");
        return;
    }

    let temp = currentWeatherData.current.temperature_2m;
    let feels = currentWeatherData.current.apparent_temperature;

    if (currentUnits.temperature === 'fahrenheit') {
        temp = (temp * 9/5) + 32;
        feels = (feels * 9/5) + 32;
    }

    mainTemperature.innerText = `${Math.round(temp)}°`;
    feelsLike.innerText = `${Math.round(feels)}°`;

    mainTemperature.innerText = `${Math.round(temp)}°`;

currentWeatherData.daily.temperature_2m_min.forEach((tempC, i) => {
    let temp = tempC;
    if (currentUnits.temperature === 'fahrenheit') {
        temp = (temp * 9/5) + 32;
    }
    if (min_days_temp[i]) {
        min_days_temp[i].innerText = `${Math.round(temp)}°`;
    }
});

currentWeatherData.daily.temperature_2m_max.forEach((tempC, i) => {
    let temp = tempC;
    if (currentUnits.temperature === 'fahrenheit') {
        temp = (temp * 9/5) + 32;
    }
    if (max_days_temp[i]) {
        max_days_temp[i].innerText = `${Math.round(temp)}°`;
    }
});

let currentlyDisplayedDayIndex = 0;

daySelector.addEventListener('change', (event) => {
    const selectedDayIndex = event.target.value;
    currentlyDisplayedDayIndex = selectedDayIndex;

    const selectedDayData = processedForecastData[selectedDayIndex];
    renderHourlyForecast(selectedDayData);
});

if (processedForecastData.length > 0) {
    renderHourlyForecast(processedForecastData[currentlyDisplayedDayIndex]);
}

    let windSpeed = currentWeatherData.current.wind_speed_10m;
    let windUnit = 'km/h';
    if (currentUnits.wind === 'mph') {
        windSpeed = windSpeed / 1.609;
        windUnit = 'mph';
    }
    wind.innerText = `${windSpeed.toFixed(1)} ${windUnit}`;

    let precipitationValue = currentWeatherData.daily.precipitation_sum[0];
    let precipUnit = 'mm';
    if (currentUnits.precipitation === 'in') {
        precipitationValue = precipitationValue / 25.4;
        precipUnit = 'in';
    }
    precipitation.innerText = `${precipitationValue.toFixed(1)} ${precipUnit}`;

}
const switchButton = document.querySelector('.units_button-switch');

function updateActiveButtons() {
    const allOptions = document.querySelectorAll('.unit-option');

    allOptions.forEach(option => {
        const unitType = option.dataset.unitType;
        const unitValue = option.dataset.unitValue;

        if (currentUnits[unitType] === unitValue) {
            option.classList.add('active');
        } else {
            option.classList.remove('active');
        }
    });
}

switchButton.addEventListener('click', () => {
    const isCurrentlyMetric = currentUnits.temperature === 'celsius';

    if (isCurrentlyMetric) {
        currentUnits.temperature = 'fahrenheit';
        currentUnits.wind = 'mph';
        currentUnits.precipitation = 'in';

        switchButton.innerText = 'Switch to Metric';
    } else {
        currentUnits.temperature = 'celsius';
        currentUnits.wind = 'kmh';
        currentUnits.precipitation = 'mm';

        switchButton.innerText = 'Switch to Imperial';
    }

    updateActiveButtons();

    updateUIDisplay();
});