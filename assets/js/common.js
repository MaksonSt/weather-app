// спільні функції
export const form = document.querySelector(".search_city");
const hidden_layout=document.querySelector(".layout");
const error_found_text=document.querySelector(".error_found");
const search_suggestions=document.querySelector(".search_suggestions");
const search_input=document.querySelector(".content_search-input");

error_found_text.classList.add("hidden")
export async function getCity(cityName) {
    const urlCity = `https://geocoding-api.open-meteo.com/v1/search?name=${cityName}&count=5&language=en&format=json`;
    try {
        const memo = await fetch(urlCity);
        const dataPlace = await memo.json();

        console.log("Дані міста:", dataPlace);

        if (dataPlace.results && dataPlace.results.length > 0) {
            console.log("Координати:", dataPlace.results[0].latitude, dataPlace.results[0].longitude);
            error_found_text.style.display="block";
            hidden_layout.classList.remove("hidden");
            error_found_text.classList.add("hidden")
            return dataPlace.results[0];
        } else {
            console.error("Місто не знайдено");
            hidden_layout.classList.add("hidden");
            error_found_text.classList.remove("hidden")
            return null;
        }
    } catch (error) {
        console.error("Помилка getCity: "+error);
        return null;
    }

}
async function getCitySuggestions(cityName) {
    if (!cityName) return []; // Повертаємо пустий масив, якщо запит порожній

    const urlCity = `https://geocoding-api.open-meteo.com/v1/search?name=${cityName}&count=5&language=en&format=json`;
    try {
        const memo = await fetch(urlCity);
        const dataPlace = await memo.json();
        return dataPlace.results || []; // Повертаємо весь масив або пустий масив
    } catch (error) {
        console.error("Помилка getCitySuggestions: " + error);
        return [];
    }
}
function renderSuggestions(cities) {
    search_suggestions.innerHTML = '';

    if (cities.length === 0) {
        search_suggestions.classList.add('hidden');
        return;
    }

    cities.forEach(city => {
        const suggestionItem = document.createElement('div');
        suggestionItem.className = 'suggestion_city';
        suggestionItem.innerText = `${city.name},${city.admin2 || ""}, ${city.country}`;

        suggestionItem.dataset.latitude = city.latitude;
        suggestionItem.dataset.longitude = city.longitude;
        suggestionItem.dataset.name = city.name;
        suggestionItem.dataset.admin2 = city.admin2;
        suggestionItem.dataset.country = city.country;

        suggestionItem.addEventListener('click', handleSuggestionClick);

        search_suggestions.appendChild(suggestionItem);
    });

    search_suggestions.classList.remove('hidden');
}

function handleSuggestionClick(event) {
    const clickedItem = event.currentTarget;
    const { latitude, longitude, name,admin2, country } = clickedItem.dataset;

    search_input.value = `${name}, ${admin2 || ""}, ${country}`;

    search_suggestions.classList.add('hidden');
    search_suggestions.innerHTML = '';

    const citySelectedEvent = new CustomEvent('citySelected', {
        detail: {
            latitude,
            longitude,
            name,
            admin2,
            country
        }
    });
    document.dispatchEvent(citySelectedEvent);
}

let debounceTimer;

search_input.addEventListener('input', () => {
    clearTimeout(debounceTimer);

    debounceTimer = setTimeout(async () => {
        const cityName = search_input.value.trim();
        const cities = await getCitySuggestions(cityName);
        renderSuggestions(cities);
    }, 300);
});

document.addEventListener('click', (event) => {
    if (!search_input.contains(event.target)) {
        search_suggestions.classList.add('hidden');
    }
});


    form.addEventListener("submit", async function (e) {
        e.preventDefault();
        const city = form.querySelector("[name='input_city']");
        const cityName = city.value.trim();
        const cityData = await getCity(cityName);

        if (cityData) {
            const event = new CustomEvent('citySelected', {
                detail: cityData
            });
            document.dispatchEvent(event);
        } else {
        }
    });

const day_week=document.querySelectorAll(".day")
const day=new Date()

export function setTime(){
    const week_short=["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const week_full=["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months=["January","February","March","April","May","June","July","August","September","October","November","December"];
    const todayIndex=new Date().getDay()

    day_week.forEach((day,i) => {
        const nextDay = (todayIndex + i) % 7;
        day.innerText=week_short[nextDay]
    })

const hourlyData = [];
    const dates=document.querySelector(".content_date")
    const month=months[day.getMonth()]
    const day_week_full=week_full[day.getDay()]
    dates.innerText=`${day_week_full}, ${month} ${day.getDate()}, ${day.getFullYear()}`

const hourly_forecast_div=document.querySelector(".hourly_forecast-body")

        for (let i=0; i <= 24; i++) {
  const hourBlock = document.createElement("div");
  hourBlock.classList.add("hourly_forecast-body-header");

  const imgHourDiv = document.createElement("div");
  imgHourDiv.classList.add("pm_img_hour");

 const imgDiv = document.createElement("div");
  imgDiv.classList.add("pm_img");
  imgDiv.style.backgroundImage = "url(../assets/images/icon-sunny.webp)";

  const timeP = document.createElement("p");
  timeP.textContent = `${i}:00`;

  imgHourDiv.appendChild(imgDiv);
  imgHourDiv.appendChild(timeP);

  const tempP = document.createElement("p");
  tempP.textContent = `${Math.round(Math.random() * 10 + 10)}°`;

  hourBlock.appendChild(imgHourDiv);
  hourBlock.appendChild(tempP);

  hourly_forecast_div.appendChild(hourBlock);

  hourlyData.push({ hour: `${i}:00`, tempP, imgDiv });
    }
        return hourlyData;
}


