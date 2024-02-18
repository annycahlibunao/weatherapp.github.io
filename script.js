const weatherForm = document.querySelector(".weather-form");
const cityInput = document.querySelector(".dynamic-input");
const card = document.querySelector(".card");
const footer = document.querySelector(".credit-footer");
const errorMsg = document.querySelector(".error-msg");
const apiKey = "56e264e1a4c88fb5df472ef08c19f42f";

const tempDisplay = document.querySelector(".temp-display");
const feelsLikeDisplay = document.querySelector(".feels-like-display");
const humidityDisplay = document.querySelector(".humidity-display");
const windDisplay = document.querySelector(".wind-display");
const maxTempDisplay = document.querySelector(".max-temp-display");
const minTempDisplay = document.querySelector(".min-temp-display");
const weatherImgDisplay = document.querySelector(".weather-img");
let weatherText = document.getElementById("desc-display")

function adjustInputSize(input) {
    var inputLength = input.value.length;
    input.style.width = (inputLength + 1) * 10 + 'px'; 
}

weatherForm.addEventListener("submit", async event => {
    event.preventDefault();
    const city = cityInput.value; 

    if (city) {
        try {
            clearError();
            const weatherData = await getWeatherData(city);
            displayWeatherInfo(weatherData);
            console.log(weatherData);
        }
        catch(error){
            console.error(error);
            displayError(error);
        }
    } 
    else {
        displayError("Please enter a city.");
    }
    
});

async function getWeatherData(city){
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    const response = await fetch(apiUrl);
    if(!response){
        throw new Error("Sorry, could not fetch weather data.");
    }

    return await response.json();
}

function displayWeatherInfo(data){
    const weatherTemp = ((data.main.temp) - 273.15).toFixed(1);
    const feelTemp = ((data.main.feels_like) - 273.15).toFixed(1);
    const humidity = data.main.humidity;
    const windSpeed = data.wind.speed;
    const maxTemp = ((data.main.temp_max) - 273.15).toFixed(1);
    const minTemp = ((data.main.temp_min) - 273.15).toFixed(1);

    tempDisplay.textContent = `${weatherTemp}°C`;
    feelsLikeDisplay.textContent = `Feels like ${feelTemp}°C`;
    humidityDisplay.textContent = `${humidity}%`;
    windDisplay.textContent = `${windSpeed}km/hr`;
    maxTempDisplay.textContent = `${maxTemp}°C`;
    minTempDisplay.textContent = `${minTemp}°C`;

    let weatherInfo = getWeatherEmoji(data.weather[0].id);
    weatherImgDisplay.src = `gifs/${weatherInfo.img}`;

    weatherText.textContent = weatherInfo.text;

    card.style.display = "flex";
}

function getWeatherEmoji(weatherId){
    switch(true){
        case(weatherId >= 200 && weatherId < 300):
            text = "is currently stormy.";
            img = "storm.gif";
            break;
        case(weatherId >= 300 && weatherId < 400):
            text = "is currently showery."
            img = "drizzle.gif";
            break;
        case(weatherId >= 500 && weatherId < 600):
            text = "is currently raining.";
            img = "rain.gif";
            break;
        case(weatherId >= 600 && weatherId < 700):
            text = "is currently snowing.";
            img = "snow.gif";
            break;
        case(weatherId === 741 || weatherId === 701):
            text = "is currently foggy.";
            img = "fog.gif";
            break;
        case(weatherId === 800):
            text = "is currently sunny.";
            img = "sun.gif";
            break;
        case(weatherId > 800 && weatherId <= 802):
            text = "is currently cloudy with sun.";
            img = "cloudsun.gif";
            break;
        case(weatherId > 802 && weatherId < 900):
            text = "is currently cloudy.";
            img = "clouds.gif";
            break;
        default:
            text = "is currently unknown."
            img = "questiongif.gif";
    }
    return {text, img};
}

function displayError(message){
    console.log("Display error function triggered.");
    const errorDisplay = document.createElement("p");
    errorDisplay.textContent = message;
    errorDisplay.classList.add("error-display");

    card.style.display = "flex";
    
    errorMsg.append(errorDisplay);
}

function clearError() {
    const errorNoCity = document.querySelector(".error-display");
    if (errorNoCity) {
        errorNoCity.remove();
    }
}