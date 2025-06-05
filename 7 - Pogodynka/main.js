document.addEventListener('DOMContentLoaded', () => {
    const APIKEY = `a51d5d84f246d6615ecea2079759d048`
    const CityAPiUrl = `http://api.openweathermap.org/geo/1.0/direct?q=city&limit=5&appid=${APIKEY}`

    const cityInput = document.getElementById('cityInput');
    const weatherOverview = document.getElementById('weathercards');
    const AddButton = document.getElementById('add')

    function getWeatherCardsFromStorage() {
        return JSON.parse(localStorage.getItem('weatherCards')) || [];
    }

    function saveWeatherCardsToStorage(cards) {
        localStorage.setItem('weatherCards', JSON.stringify(cards));
        renderWeatherCards();
    }

    function getWeatherData(city) {
        fetch(CityAPiUrl.replace('city', city))
            .then(response => {
                if (!response.ok) {
                    throw new Error('Nie znaleziono miasta')
                }
                return response.json()
            }).then(data => {
                const exclude = 'minutely,hourly'
                //const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${data[0].lat}&lon=${data[0].lon}&units=metric&appid=${APIKEY}`
                const weatherApiUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${data[0].lat}&lon=${data[0].lon}&exclude=${exclude}&units=metric&appid=${APIKEY}`
                fetch(weatherApiUrl)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Błąd podczas pobierania danych pogodowych')
                    }
                    return response.json()
                }).then(weatherData => {
                    if (weatherData.length === 0) {
                        throw new Error('Nie znaleziono danych pogodowych dla tego miasta')
                    }
                    const weatherCard = {
                    city: data[0].name,
                    temperature: weatherData.current.temp,
                    feelsLike: weatherData.current.feels_like,
                    humidity: weatherData.current.humidity,
                    windSpeed: weatherData.current.wind_speed,  
                    sunrise: weatherData.current.sunrise,
                    sunset: weatherData.current.sunset,
                    pressure: weatherData.current.pressure,
                    Icon: weatherData.current.weather[0].icon,

                }
                const cards = getWeatherCardsFromStorage()
                cards.push(weatherCard)
                saveWeatherCardsToStorage(cards)
            })
        })
    }
    function renderWeatherCards() {
        const cards = getWeatherCardsFromStorage()
        weatherOverview.innerHTML = ''

        if (cards.length === 0) {
            weatherOverview.innerHTML = '<p style="text-align: center; color: #666; padding: 40px;">Brak zapisanych miast</p>';
            return;
        }

        cards.forEach((card, index) => {
            const cardElement = document.createElement('div')
            cardElement.classList.add('weather-card')
            cardElement.innerHTML = `
                <img src="https://openweathermap.org/img/wn/${card.Icon}@2x.png" alt="Weather icon">
                <h2>${card.city}</h2>
                <p>Temperatura: ${card.temperature}°C</p>
                <p>Odczuwalna: ${card.feelsLike}°C</p>
                <p>Wiatr: ${card.windSpeed} m/s</p>
                <p>Wschód słońca: ${new Date(card.sunrise * 1000).toLocaleTimeString()}</p>
                <p>Zachód słońca: ${new Date(card.sunset * 1000).toLocaleTimeString()}</p>
                <p>Wilgotność: ${card.humidity}%</p>
                <p>Ciśnienie: ${card.pressure} hPa</p>
                <button class="btn btn-delete" onclick="deleteWeatherCard(${index})">🗑️ Usuń</button>
            `;
            weatherOverview.appendChild(cardElement);
        })
    }

    AddButton.addEventListener('click', () => {
        const city = cityInput.value.trim();
        if (!city) {
            alert('Proszę wpisać nazwę miasta');
            return;
        }
        getWeatherData(city);
        cityInput.value = '';

     })
    renderWeatherCards()
})
