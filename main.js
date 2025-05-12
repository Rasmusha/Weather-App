const weatherForm = document.getElementById('weather-form');
const searchIcon = document.getElementById('search-icon');
const weatherInfo = document.getElementById('weather-info');
const currentWeather = document.getElementById('current-weather');

weatherForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    weatherInfo.innerHTML = '';
    currentWeather.innerHTML = '';

    const location = document.getElementById('location-input').value;
    try {
        const weatherData = await getWeather(location);
        console.log(weatherData);
        displayWeather(weatherData);
    } catch(error) {
        console.error('Error fetching weather data:', error);
    }
});

async function getWeather(location) {
    const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=metric&key=65JGDPY77JW96L9JU79758SQT&contentType=json`);
    const weatherData = await response.json();
    return processWeatherData(weatherData);
}

function processWeatherData(weatherData) {
    const { resolvedAddress, description, days } = weatherData;

    const today = new Date();
    const localDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().split('T')[0];

    const currentDay = days.find(day => day.datetime === localDate);

    console.log('Current Day:', currentDay);

    const processedCurrentDay = currentDay ? {
        date: currentDay.datetime,
        temp: currentDay.temp,
        tempmax: currentDay.tempmax,
        tempmin: currentDay.tempmin,
        conditions: currentDay.conditions,
        icon: currentDay.icon,
        humidity: currentDay.humidity,
        precip: currentDay.precip,
        windspeed: (currentDay.windspeed * 0.277778).toFixed(2)
    } : null;

    const processedFutureDays = days.filter(day => day.datetime !== localDate).map(day => ({
        date: day.datetime,
        temp: day.temp,
        tempmax: day.tempmax,
        tempmin: day.tempmin,
        icon: day.icon,
        precip: day.precip,
        windspeed: (day.windspeed * 0.277778).toFixed(2)
    }));

    return {
        location: resolvedAddress,
        description: description,
        currentDay: processedCurrentDay,
        forecast: processedFutureDays
    };
}


async function displayWeather(weatherData) {
    const { location, description, currentDay, forecast } = weatherData;

    console.log('Current Day Data:', currentDay); // Log currentDay to check its value

    if (currentDay) {
        const weatherCard = document.createElement('div');
        weatherCard.classList.add('todaysWeather-card');

        const iconContainer = document.createElement('div');
        weatherCard.id = 'iconContainer;'

        const iconDiv = document.createElement('div');
        iconDiv.classList.add('weather-icon');

        const iconImg = document.createElement('img');
        iconImg.src = `icons/${currentDay.icon}.svg`; // make sure these match the icon names from the API
        iconImg.alt = currentDay.conditions;
        iconImg.classList.add('weather-icon-img');

        const currentLocation = document.createElement('h2');
        currentLocation.textContent = `${location}`;

        const currentDate = document.createElement('h3');
        currentDate.textContent = `Today`;

        const currentTemp = document.createElement('p');
        currentTemp.textContent = `Temperature: ${currentDay.temp}°C`;

        const currentConditions = document.createElement('p');
        currentConditions.textContent = `Conditions: ${currentDay.conditions}`;

        const currentPrecip = document.createElement('p');
        currentPrecip.textContent = `Precipitation: ${currentDay.precip} mm`;

        const currentWindSpeed = document.createElement('p');
        currentWindSpeed.textContent = `Wind: ${currentDay.windspeed} m/s`;

        weatherCard.appendChild(iconImg);
        weatherCard.appendChild(currentLocation);
        weatherCard.appendChild(currentDate);
        weatherCard.appendChild(currentTemp);
        weatherCard.appendChild(currentConditions);
        weatherCard.appendChild(currentPrecip);
        weatherCard.appendChild(currentWindSpeed);
        


        
        currentWeather.appendChild(weatherCard);
    } else {
        currentWeather.innerHTML = '<p>No current weather data available.</p>';
    }

    forecast.forEach(day => {
        const weatherCard = document.createElement('div');
        weatherCard.classList.add('weather-card');

        const date = document.createElement('h3');
        date.textContent = `${day.date}`;

        const tempHigh = document.createElement('p');
        tempHigh.textContent = `High: ${day.tempmax}°C`;

        const tempLow = document.createElement('p');
        tempLow.textContent = `Low: ${day.tempmin}°C`

        const precip = document.createElement('p');
        precip.textContent = `Precipitation: ${day.precip} mm`;

        const windSpeed = document.createElement('p');
        windSpeed.textContent = `Wind: ${day.windspeed} m/s`;

        const iconImg = document.createElement('img');
        iconImg.src = `icons/${day.icon}.svg`;
        iconImg.alt = day.icon;
        iconImg.classList.add('forecast-icon');

        weatherCard.appendChild(iconImg);

        weatherCard.appendChild(date);
        weatherCard.appendChild(tempHigh);
        weatherCard.appendChild(tempLow);
        weatherCard.appendChild(precip);
        weatherCard.appendChild(windSpeed);

        weatherInfo.appendChild(weatherCard);
    });
}

getWeather("Muuruvesi").then(data => {
    console.log(data);
});
