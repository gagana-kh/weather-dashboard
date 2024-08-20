const cityInput = document.querySelector(".city-input");
const searchButton = document.querySelector(".search-btn");
const locationButton = document.querySelector(".location-btn");
const currentWeatherDiv = document.querySelector(".current-weather");
const weatherCardsDiv = document.querySelector(".weather-cards");

const API_KEY = "3938cfab1832f1f5adc4a5fd55442e1d";
const createWeatherCard = (cityName, weatherItem, index) =>{
    if(index === 0)
{
    return `<div class="details">
                <h2>${cityName} (${weatherItem.dt_txt.split("")[0]})</h2>
                <h4>Temperature: ${(weatherItem.main.temp- 273.15).toFixed(2)}C</h4>
                <h4>Wind: ${weatherItem.wind.speed} M/S</h4>
                <h4>Humidity:${weatherItem.main.humidity}%</h4>
            </div>
            <div class="icon">
                <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="wether-icon">
                <h4>${weatherItem.weather[0].description}</h4>
            </div>`;
} else {    return `<li class="card">
            <h3>(${weatherItem.dt_txt.split("")[0]})</h3>
            <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" alt="wether-icon">
            <h4>Temp: ${(weatherItem.main.temp- 273.15).toFixed(2)}C</h4>
            <h4>Wind: ${weatherItem.wind.speed} M/S</h4>
            <h4>Humidity:${weatherItem.main.humidity}%</h4>
        </li>`;
    }
};

const getWeatherDetails = (cityName, lat, lon) =>{
    const WEATHER_API_URL =`http://api.openweathermap.org/data/2.5/forecast/daily?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

    fetch(WEATHER_API_URL).then(res => res.json()).then(data => {
        const uniqueForecastDays = [];
        console.log(data);

        const fiveDaysForecast = data.list.filter(forecast =>{
            const forecastDate = new Date(forecast.dt_txt).getDate();
            if(!uniqueForecastDays.includes(forecastDate)){
                return uniqueForecastDays.push(forecastDate);
            }
        });

        cityInput.value = "";
        weatherCardsDiv.innerHTML = "";

        console.log(fiveDaysForecast);
        fiveDaysForecast.forEach((weatherItem, index) =>{
            if(index === 0){
                weatherCardsDiv.insertAdjacentHTML("beforeend", createWeatherCard(cityName, weatherItem, index));
            } else{
             weatherCardsDiv.insertAdjacentHTML("beforeend", createWeatherCard(cityName, weatherItem, index));
            }
        });
    }).catch(()=>
        {
            alert("An error occurred while fetching the weather forecast");
        });
}

const getCityCoordinates = () =>{
    const cityName = cityInput.value.trim();
    if(!cityName)return;
    const GEOCODING_API_URL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;
    
    fetch(GEOCODING_API_URL).then(res=>res.json()).then(data=>{
       if(!data.length) return alert(`No coordinates found for ${cityName}`);
       const{ name, lat, lon } = data[0];
       getWeatherDetails(name, lat, lon );
    }).catch(()=>
    {
        alert("An error occurred while fetching the coordinates");
    });
}
const getUserCoordinates = () => {
    navigator.geolocation.getCurrentPosition(
        position =>{
            const {latitude, longitude} = position.coords;
            const REVERSE_GEOCODING_URL =`http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`; 
            fetch(REVERSE_GEOCODING_URL).then(res=>res.json()).then(data=>{
                const{ name } = data[0];
                getWeatherDetails(name, latitude, longitude);
             }).catch(()=> {
                 alert("An error occurred while fetching the city");
             });
         
        },
        error => {
            if(error.code === error.PERMISSION_DENIED){
                alert("Geolocation request denied. Please reset location permission");
            }
        }
    );
}
locationButton.addEventListener("click",getUserCoordinates);
searchButton.addEventListener("click",getCityCoordinates);
cityInput.addEventListener("keyup", e => e.key === "Enter" && getCityCoordinates());