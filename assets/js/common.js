// спільні функції
export const form = document.querySelector(".search_city");

export async function getCity(cityName) {
    const urlCity = `https://geocoding-api.open-meteo.com/v1/search?name=${cityName}&count=1&language=en&format=json`;
    try {
        const memo = await fetch(urlCity);
        const dataPlace = await memo.json();

        console.log("Дані міста:", dataPlace);

        if (dataPlace.results && dataPlace.results.length > 0) {
            console.log("Координати:", dataPlace.results[0].latitude, dataPlace.results[0].longitude);
            return dataPlace.results[0];
        } else {
            console.error("Місто не знайдено");
            return null;
        }
    } catch (error) {
        console.error("Помилка getCity: "+error);
        return null;
    }
}
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

function setDate(){
    const week_short=["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const week_full=["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months=["January","February","March","April","May","June","July","August","September","October","November","December"];
    const todayIndex=new Date().getDay()

    day_week.forEach((day,i) => {
        const nextDay = (todayIndex + i) % 7;
        day.innerText=week_short[nextDay]
    })

    const dates=document.querySelector(".content_date")
    const mnth=months[day.getMonth()]
    const day_week_full=week_full[day.getDay()]
    dates.innerText=`${day_week_full}, ${mnth} ${day.getDate()}, ${day.getFullYear()}`
}
setDate();