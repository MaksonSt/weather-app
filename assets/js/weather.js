// логіка API, показ погоди
const mainTemperature=document.querySelector(".content_info-temperature")
const feelsLike=document.querySelector(".feels_like")
const humidity=document.querySelector(".humidity")
const wind=document.querySelector(".wind")
const precipitation=document.querySelector(".precipitation")

    fetch(`https://api.open-meteo.com/v1/forecast?latitude=50.4547&longitude=30.5238&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum&hourly=temperature_2m,weather_code&current=temperature_2m,wind_speed_10m,relative_humidity_2m,weather_code,apparent_temperature&timezone=Europe%2FBerlin`).
    then((response) => {
        return response.json();
        })
        .then((data) => {
            console.log(data);
            mainTemperature.innerText = `${Math.floor(data.current.temperature_2m)}°`;
            feelsLike.innerText=`${Math.floor(data.current.apparent_temperature)}°`;
            humidity.innerText=`${Math.floor(data.current.relative_humidity_2m)}%`
            wind.innerText=`${data.current.wind_speed_10m} km/h`
            precipitation.innerText=`${data.daily.precipitation_sum[0]} mm`
        })

