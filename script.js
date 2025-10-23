// ⚠️ REPLACE 'YOUR_API_KEY_HERE' WITH YOUR ACTUAL OPENWEATHERMAP API KEY
const API_KEY = 'd87754bf3576a2e7ea8e41cdb6bbf795';

// Display current date
function displayCurrentDate() {
    const dateElement = document.getElementById('currentDate');
    const now = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    dateElement.textContent = now.toLocaleDateString('en-US', options);
}

// Call the function when page loads
window.addEventListener('load', displayCurrentDate);
function handleKeyPress(event) {
    if (event.key === 'Enter') {
        searchWeather();
    }
}

async function searchWeather() {
    const city = document.getElementById('cityInput').value.trim();
    
    if (!city) {
        showMessage('Please enter a city name', 'error');
        return;
    }

    if (API_KEY === 'YOUR_API_KEY_HERE') {
        showMessage('Please add your API key in the script.js file first!', 'error');
        return;
    }

    document.getElementById('loading').style.display = 'block';
    document.getElementById('error').style.display = 'none';

    try {
        // Fetch current weather
        const currentResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );

        if (!currentResponse.ok) {
            throw new Error('City not found');
        }

        const currentData = await currentResponse.json();

        // Fetch 5-day forecast
        const forecastResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
        );

        const forecastData = await forecastResponse.json();

        displayWeather(currentData, forecastData);
    } catch (error) {
        showMessage('Error: ' + error.message, 'error');
    } finally {
        document.getElementById('loading').style.display = 'none';
    }
}

function displayWeather(current, forecast) {
    // Display current weather
    document.getElementById('location').textContent = `${current.name}, ${current.sys.country}`;
    document.getElementById('weatherIcon').textContent = getWeatherEmoji(current.weather[0].main);
    document.getElementById('temperature').textContent = `${Math.round(current.main.temp)}°C`;
    document.getElementById('description').textContent = current.weather[0].description;
    document.getElementById('feelsLike').textContent = `${Math.round(current.main.feels_like)}°C`;
    document.getElementById('humidity').textContent = `${current.main.humidity}%`;
    document.getElementById('windSpeed').textContent = `${current.wind.speed} m/s`;
    document.getElementById('pressure').textContent = `${current.main.pressure} hPa`;

    // Display forecast
    const forecastContainer = document.getElementById('forecast');
    forecastContainer.innerHTML = '';

    // Get one forecast per day (at 12:00)
    const dailyForecasts = forecast.list.filter(item => item.dt_txt.includes('12:00:00'));

    dailyForecasts.slice(0, 5).forEach(day => {
        const date = new Date(day.dt * 1000);
        const card = document.createElement('div');
        card.className = 'forecast-card';
        card.innerHTML = `
            <div class="forecast-date">${date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</div>
            <div class="forecast-icon">${getWeatherEmoji(day.weather[0].main)}</div>
            <div class="forecast-temp">${Math.round(day.main.temp)}°C</div>
            <div class="forecast-desc">${day.weather[0].description}</div>
        `;
        forecastContainer.appendChild(card);
    });

    document.getElementById('weatherDisplay').style.display = 'block';
}

function getWeatherEmoji(condition) {
    const emojis = {
        'Clear': '☀️',
        'Clouds': '☁️',
        'Rain': '🌧️',
        'Drizzle': '🌦️',
        'Thunderstorm': '⛈️',
        'Snow': '❄️',
        'Mist': '🌫️',
        'Fog': '🌫️',
        'Haze': '🌫️'
    };
    return emojis[condition] || '🌤️';
}

function showMessage(message, type) {
    const errorDiv = document.getElementById('error');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    errorDiv.style.background = type === 'error' ? '#ff5252' : '#4caf50';
    
    setTimeout(() => {
        errorDiv.style.display = 'none';
    }, 3000);
}