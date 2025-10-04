// спільні функції
export const form = document.querySelector(".search_city");

export async function getCity(cityName) {
    const urlCity = `https://geocoding-api.open-meteo.com/v1/search?name=${cityName}&count=1&language=en&format=json`;
    try {
        const memo = await fetch(urlCity);
        const data = await memo.json();

        console.log("Дані міста:", data);

        if (data.results && data.results.length > 0) {
            console.log("Координати:", data.results[0].latitude, data.results[0].longitude);
            return data.results[0];
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
