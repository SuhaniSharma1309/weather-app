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

    document.getElementById('loading').style.display = 'block';
    document.getElementById('error').style.display = 'none';

    try {
        // backend call via Netlify function
        const response = await fetch(`/.netlify/functions/weather?city=${city}`);
        const data = await response.json();

        // 👇 New fix — show error without crashing
        if (data.error) {
            showMessage(data.error, 'error');
            return;
        }

        displayWeather(data.current, data.forecast);

    } catch (error) {
        showMessage('Error: ' + error.message, 'error');
    } finally {
        document.getElementById('loading').style.display = 'none';
    }
}

function displayWeather(current, forecast) {
    document.getElementById('location').textContent = `${current.name}, ${current.sys.country}`;
    document.getElementById('weatherIcon').textContent = getWeatherEmoji(current.weather[0].main);
    document.getElementById('temperature').textContent = `${Math.round(current.main.temp)}°C`;
    document.getElementById('description').textContent = current.weather[0].description;
    document.getElementById('feelsLike').textContent = `${Math.round(current.main.feels_like)}°C`;
    document.getElementById('humidity').textContent = `${current.main.humidity}%`;
    document.getElementById('windSpeed').textContent = `${current.wind.speed} m/s`;
    document.getElementById('pressure').textContent = `${current.main.pressure} hPa`;

    const forecastContainer = document.getElementById('forecast');
    forecastContainer.innerHTML = '';

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
