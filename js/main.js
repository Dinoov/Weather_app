const ApiKey = "4d24d68a27f64dbdba18df0504ad9c56";
const ApiUrl = `https://api.openweathermap.org/data/2.5/weather?units=metric&q=`;
const forecastApiUrl = `https://api.openweathermap.org/data/2.5/forecast?units=metric&q=`;

const SearchInput = document.querySelector(".search_city input");
const SearchButton = document.querySelector(".search_city button");

async function checkWeather(city) {
    const response = await fetch(ApiUrl + city + `&appid=${ApiKey}`);
    const data = await response.json();
    console.log(data, "data");

    document.querySelector(".city").innerHTML = data.name;
    document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "&#8451;";
    document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
    document.querySelector(".wind").innerHTML = data.wind.speed + " km/h";

    const forecastResponse = await fetch(forecastApiUrl + city + `&appid=${ApiKey}`);
    const forecastData = await forecastResponse.json();
    console.log(forecastData, "forecastData");

    const tomorrow = forecastData.list[8];
    document.querySelector(".day_temp_tomorrow").innerHTML = Math.round(tomorrow.main.temp) + "&#8451;";
    document.querySelector(".day_desc_tomorrow").innerHTML = tomorrow.weather[0].description;

    const dayAfterTomorrow = forecastData.list[16];
    document.querySelector(".day_temp_after_tomorrow").innerHTML = Math.round(dayAfterTomorrow.main.temp) + "&#8451;";
    document.querySelector(".day_desc_after_tomorrow").innerHTML = dayAfterTomorrow.weather[0].description;
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            getCityByCoordinates(lat, lon);
        }, error => {
            console.error(error);
            // Если отказ в доступе к геопозиции или ошибка, город по умолчанию - Нью-Йорк
            checkWeather("New York");
        });
    } else {
        console.error("Geolocation is not supported by this browser.");
        checkWeather("New York");
    }
}

async function getCityByCoordinates(lat, lon) {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${ApiKey}`);
    const data = await response.json();
    const city = data.name;
    checkWeather(city);
}

SearchButton.addEventListener("click", () => {
    checkWeather(SearchInput.value);
    SearchInput.value = "";
});

getLocation();
