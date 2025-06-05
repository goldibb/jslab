document.addEventListener('DOMContentLoaded', () => {
    const APIKEY = `a51d5d84f246d6615ecea2079759d048`
    const CityAPiUrl = `http://api.openweathermap.org/geo/1.0/direct?q=city&limit=5&appid=${APIKEY}`

    const cityInput = document.getElementById('cityInput')
    const weatherOverview = document.getElementById('weathercards')
    const AddButton = document.getElementById('add')

    function getWeatherCardsFromStorage() {
        const data = localStorage.getItem('weatherData')
        if (!data) return { cards: [], lastUpdate: null }
        
        try {
            return JSON.parse(data)
        } catch (error) {
            console.log('Błąd odczytu cache:', error)
            return { cards: [], lastUpdate: null }
        }
    }

    function saveWeatherCardsToStorage(cards) {
        const weatherData = {
            cards: cards,
            lastUpdate: Date.now()
        }
        localStorage.setItem('weatherData', JSON.stringify(weatherData))
        renderWeatherCards()
        updateLastUpdateInfo()
    }

    function isCacheExpired() {
        const data = getWeatherCardsFromStorage()
        if (!data.lastUpdate) return true
        
        const fiveMinutes = 5 * 60 * 1000 
        const timeSinceUpdate = Date.now() - data.lastUpdate
        
        return timeSinceUpdate > fiveMinutes
    }

    function getTimeSinceLastUpdate() {
        const data = getWeatherCardsFromStorage()
        if (!data.lastUpdate) return 'nigdy'
        
        const minutes = Math.floor((Date.now() - data.lastUpdate) / (1000 * 60))
        if (minutes < 1) return 'mniej niż minutę temu'
        if (minutes === 1) return '1 minutę temu'
        if (minutes < 5) return `${minutes} minuty temu`
        return `${minutes} minut temu`
    }

    function getWeatherData(city) {
        fetch(CityAPiUrl.replace('city', city))
            .then(response => {
                if (!response.ok) {
                    throw new Error('Nie znaleziono miasta')
                }
                return response.json()
            }).then(data => {
                const exclude = 'minutely'
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
                    weatherForNextDays: weatherData.daily ? weatherData.daily.map(day => {
                    return {
                          temp: day.temp.day,
                          weatherIcon: day.weather[0].icon,
                          date: new Date(day.dt * 1000).toLocaleDateString()
                        }
                    }) : []
                }
                const storageData = getWeatherCardsFromStorage()
                storageData.cards.push(weatherCard)
                saveWeatherCardsToStorage(storageData.cards)
            })
        })
    }
    function renderWeatherCards() {
        const data = getWeatherCardsFromStorage()
        const cards = data.cards
        weatherOverview.innerHTML = ''

        if (cards.length === 0) {
            weatherOverview.innerHTML = '<p style="text-align: center; color: #666; padding: 40px;">Brak zapisanych miast</p>'
            return
        }
        if (cards.length > 10) {
            weatherOverview.innerHTML = '<p style="text-align: center; color: #666; padding: 40px;">Maksymalnie 10 miast można zapisać</p>'
            return
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
                <div class="weather-forecast">
                    <h3>Pogoda na następne dni</h3>
                    <div class="weather-forecast-days">
                        ${(card.weatherForNextDays || []).map(day => `
                            <div class="weather-forecast-day">
                                <img src="https://openweathermap.org/img/wn/${day.weatherIcon}@2x.png" alt="Weather icon">
                                <p>${day.date}</p>
                                <p>${day.temp}°C</p>
                            </div>
                        `).join('')}
                    </div>
                </div> 
                <button class="btn btn-delete" onclick="deleteWeatherCard(${index})">🗑️ Usuń</button>
            `
            weatherOverview.appendChild(cardElement)
        })
        
        updateLastUpdateInfo()
    }

    function updateLastUpdateInfo() {
        const updateInfoElement = document.getElementById('updateInfo')
        if (updateInfoElement) {
            updateInfoElement.innerHTML = `📅 Ostatnia aktualizacja: ${getTimeSinceLastUpdate()}`
        }
    }

    cityInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            AddButton.click()
        }
    })
    AddButton.addEventListener('click', () => {
        const city = cityInput.value.trim()
        if (!city) {
            alert('Proszę wpisać nazwę miasta')
            return
        }
        getWeatherData(city)
        cityInput.value = ''
     })

    window.deleteWeatherCard = function(index) {
        const data = getWeatherCardsFromStorage()
        data.cards.splice(index, 1)
        saveWeatherCardsToStorage(data.cards)
    }

   
    function refreshWeatherData() {
        const storageData = getWeatherCardsFromStorage()
        const cards = storageData.cards
        if (cards.length === 0) return

        cards.forEach((card, index) => {
            fetch(CityAPiUrl.replace('city', card.city))
                .then(response => response.json())
                .then(geoData => {
                    const exclude = 'minutely'
                    const weatherApiUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${geoData[0].lat}&lon=${geoData[0].lon}&exclude=${exclude}&units=metric&appid=${APIKEY}`
                    return fetch(weatherApiUrl)
                })
                .then(response => response.json())
                .then(weatherData => {
                    const oldTemp = card.temperature
                    const newTemp = weatherData.current.temp
                    
                    
                    const hasChanged = Math.abs(oldTemp - newTemp) >= 0.5

                    
                    card.temperature = newTemp
                    card.feelsLike = weatherData.current.feels_like
                    card.humidity = weatherData.current.humidity
                    card.windSpeed = weatherData.current.wind_speed
                    card.sunrise = weatherData.current.sunrise
                    card.sunset = weatherData.current.sunset
                    card.pressure = weatherData.current.pressure
                    card.Icon = weatherData.current.weather[0].icon
                    card.weatherForNextDays = weatherData.daily ? weatherData.daily.map(day => {
                        return {
                            temp: day.temp.day,
                            weatherIcon: day.weather[0].icon,
                            date: new Date(day.dt * 1000).toLocaleDateString()
                        }
                    }) : []

                    
                    cards[index] = card
                    saveWeatherCardsToStorage(cards)

                    
                    if (hasChanged) {
                        showUpdateNotification(card.city, oldTemp, newTemp)
                    }
                })
                .catch(error => console.log('Błąd odświeżania:', error))
        })
    }

    
    function showUpdateNotification(city, oldTemp, newTemp) {
        const notification = document.createElement('div')
        notification.className = 'update-notification'
        notification.innerHTML = `
            <div class="notification-content">
                🌡️ Pogoda w ${city} się zmieniła!<br>
                ${oldTemp.toFixed(1)}°C → ${newTemp.toFixed(1)}°C
            </div>
        `
        document.body.appendChild(notification)

        
        setTimeout(() => {
            notification.remove()
        }, 4000)
    }


    setInterval(refreshWeatherData, 300000)
    
    window.manualRefresh = function() {
        refreshWeatherData()
        
        
        const notification = document.createElement('div')
        notification.className = 'update-notification'
        notification.style.background = 'linear-gradient(45deg, #ff6b6b, #ee5a52)'
        notification.innerHTML = `
            <div class="notification-content">
                🔄 Odświeżanie pogody...<br>
                Sprawdzam aktualne dane
            </div>
        `
        document.body.appendChild(notification)
        
        setTimeout(() => {
            notification.remove()
        }, 3000)
        
        console.log('Pogoda została odświeżona ręcznie')
    }

    function initializeApp() {
        const data = getWeatherCardsFromStorage()
        
        
        if (data.cards.length > 0 && isCacheExpired()) {
            console.log('Cache wygasł, odświeżam dane...')
            
            const notification = document.createElement('div')
            notification.className = 'update-notification'
            notification.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)'
            notification.innerHTML = `
                <div class="notification-content">
                    🔄 Aktualizuję dane pogodowe...<br>
                    Dane starsze niż 5 minut
                </div>
            `
            document.body.appendChild(notification)
            
            setTimeout(() => {
                notification.remove()
            }, 4000)
            
            
            refreshWeatherData()
        }
        
        
        renderWeatherCards()
    }

    
    initializeApp()
})
