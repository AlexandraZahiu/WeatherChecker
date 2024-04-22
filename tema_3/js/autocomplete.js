const apiKey = "dc92a8e49ff9d106ca6f6c7fbb24511a";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";
const pexelsApiKey = "jMkb4cRPgkDSCZ3nvqT1JHwfI4b07FdroKAX2Bj9eH4pHYSiDS8CSNJR"; 
const pexelsApiUrl = "https://api.pexels.com/v1/search";
const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");
const autocompleteInput = document.getElementById('autocompleteInput');

const citySuggestions = [
    'Alba Iulia', 'Alexandria', 'Amsterdam', 'Arad', 'Athens', 'Auckland',
    'Bacău', 'Bangkok', 'Barcelona', 'Beijing', 'Berlin', 'Bistrița',
    'Botosani', 'Brașov', 'Brăila', 'Bucharest', 'Buenos Aires', 'Buftea',
    'Buzau', 'Cairo', 'Cape Town', 'Carei', 'Casablanca', 'Cernavodă',
    'Cluj-Napoca', 'Cologne', 'Constanța', 'Copenhagen', 'Craiova', 'Cugir',
    'Câmpina', 'Câmpina', 'Delhi', 'Deva', 'Dhaka', 'Drobeta-Turnu Severin',
    'Dubai', 'Dublin', 'Edinburgh', 'Fetești', 'Focșani', 'Făgăraș',
    'Fălticeni', 'Galați', 'Glasgow', 'Gherla', 'Giurgiu', 'Hanoi',
    'Hârlău', 'Hunedoara', 'Iași', 'Istanbul', 'Istanbul', 'Istanbul',
    'Jakarta', 'Karachi', 'Kuala Lumpur', 'Lima', 'Londra', 'Los Angeles',
    'Ludus', 'Lugoj', 'Lupeni', 'Mangalia', 'Manila', 'Marrakech',
    'Medgidia', 'Mexico City', 'Miercurea Ciuc', 'Mioveni', 'Montreal', 'Moscow',
    'Mumbai', 'Nairobi', 'Nairobi', 'New York', 'Năvodari', 'Odorheiu Secuiesc',
    'Oltenița', 'Oradea', 'Oslo', 'Panciu', 'Paris', 'Pașcani',
    'Petrila', 'Petroșani', 'Piatra Neamț', 'Pitești', 'Ploiești', 'Prague',
    'Râmnicu Vâlcea', 'Reșița', 'Rio de Janeiro', 'Roman', 'Roșiorii de Vede',
    'Salo', 'Salonta', 'Satu Mare', 'Sebeș', 'Seoul', 'Shanghai',
    'Sibiu', 'Sighetu Marmației', 'Singapore', 'Slatina', 'Slobozia', 'Suceava',
    'São Paulo', 'Stockholm', 'Săcele', 'Săcele', 'Sydney', 'São Paulo',
    'Tel Aviv', 'Tg Mureș', 'Târgu Jiu', 'Târgu Mureș', 'Târgu Secuiesc',
    'Târgoviște', 'Timișoara', 'Tokyo', 'Toronto', 'Turnu Măgurele', 'Vienna',
    'Vulcan', 'Vancouver', 'Vaslui', 'Warsaw', 'Zalău', 'Zurich'
  ];
  

function initAutocomplete() {
    autocompleteInput.addEventListener('input', function() {
        const inputValue = this.value.toLowerCase();
        const filteredSuggestions = citySuggestions.filter(city => city.toLowerCase().includes(inputValue));
        displayAutocompleteSuggestions(filteredSuggestions);
    });

    autocompleteInput.addEventListener('focus', function() {
        const inputValue = this.value.toLowerCase();
        const filteredSuggestions = citySuggestions.filter(city => city.toLowerCase().includes(inputValue));
        displayAutocompleteSuggestions(filteredSuggestions);
    });

    autocompleteInput.addEventListener('blur', function() {
        setTimeout(() => {
            clearAutocompleteSuggestions();
        }, 200);
    });

    autocompleteInput.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            const selectedCity = document.querySelector('.autocomplete-suggestion.active');
            if (selectedCity) {
                autocompleteInput.value = selectedCity.textContent;
                clearAutocompleteSuggestions();
                checkWeather(selectedCity.textContent);
            }
        } else if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
            handleArrowNavigation(event.key);
        }
    });
}

function displayAutocompleteSuggestions(suggestions) {
    clearAutocompleteSuggestions();
    const autocompleteList = document.createElement('ul');
    autocompleteList.classList.add('autocomplete-list');

    suggestions.forEach((suggestion, index) => {
        const suggestionItem = document.createElement('li');
        suggestionItem.textContent = suggestion;
        suggestionItem.classList.add('autocomplete-suggestion');
        suggestionItem.addEventListener('click', function() {
            autocompleteInput.value = this.textContent;
            clearAutocompleteSuggestions();
            checkWeather(this.textContent);
        });
        autocompleteList.appendChild(suggestionItem);
        if (index === 0) {
            suggestionItem.classList.add('active');
        }
    });

    autocompleteInput.parentNode.appendChild(autocompleteList);
}

function clearAutocompleteSuggestions() {
    const autocompleteList = document.querySelector('.autocomplete-list');
    if (autocompleteList) {
        autocompleteList.parentNode.removeChild(autocompleteList);
    }
}

function handleArrowNavigation(key) {
    const suggestions = document.querySelectorAll('.autocomplete-suggestion');
    let activeIndex = Array.from(suggestions).findIndex(suggestion => suggestion.classList.contains('active'));

    if (key === 'ArrowUp') {
        activeIndex = activeIndex > 0 ? activeIndex - 1 : suggestions.length - 1;
    } else if (key === 'ArrowDown') {
        activeIndex = activeIndex < suggestions.length - 1 ? activeIndex + 1 : 0;
    }

    suggestions.forEach((suggestion, index) => {
        suggestion.classList.toggle('active', index === activeIndex);
    });
}
initAutocomplete();
async function fetchCityImage(city) {
    try {
        const response = await fetch(`${pexelsApiUrl}?query=${city}`, {
            headers: {
                Authorization: pexelsApiKey,
            },
        });
        const data = await response.json();

        console.log('Pexels API Response:', data);

        if (data.photos && data.photos.length > 0) {
            const imageUrl = data.photos[0].src.large;
            console.log('Image URL:', imageUrl);

            // Update the image source below the city name
            const cityImage = document.querySelector('.city-image');
            cityImage.src = imageUrl;
            cityImage.style.display = 'block';
        }
    } catch (error) {
        console.error('Error fetching city image from Pexels API', error);
    }
}

async function checkWeather(city) {
    try {
        const response = await fetch(`${apiUrl}${city}&appid=${apiKey}`);
        const data = await response.json();

        document.querySelector(".city").innerHTML = data.name;
        document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°C";
        document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
        document.querySelector(".wind").innerHTML = data.wind.speed + " km/h";

        const currentTemperature = Math.round(data.main.temp);
        updateCardBackground(currentTemperature);
        if (Array.isArray(data.daily)) {
            const otherDayForecast = data.daily.slice(1).map(day => `
                <div class="weather-forecast-item">
                    <div class="day">${window.moment(day.dt * 1000).format('ddd')}</div>
                    <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather icon" class="w-icon">
                    <div class="temp">Night - ${day.temp.night}&#176;C</div>
                    <div class="temp">Day - ${day.temp.day}&#176;C</div>
                </div>
            `).join('');

            document.getElementById('weather-forecast').innerHTML = otherDayForecast;
        }

        fetchCityImage(city);
    } catch (error) {
        console.error('Error fetching weather data', error);
    }
}

searchBtn.addEventListener("click", () => {
    checkWeather(searchBox.value);
});

const favoritesList = document.querySelector(".favorites-list");

function addToFavorites(city) {
    const listItem = document.createElement("li");
    listItem.textContent = city;
    listItem.addEventListener("click", () => {
        checkWeather(city);
    });
    favoritesList.appendChild(listItem);
}

document.querySelector(".favorite-btn").addEventListener("click", () => {
    const cityName = document.querySelector(".city").textContent;
    addToFavorites(cityName);

});

function showFiveDayForecast() {
    const fiveDayContainer = document.getElementById('five-day-forecast');

    if (fiveDayContainer.style.display === 'block') {
        fiveDayContainer.style.display = 'none';
    } else {
        const city = document.querySelector(".city").textContent;
        fetchFiveDayForecast(city);
        fiveDayContainer.style.display = 'block';
    }
}

async function fetchFiveDayForecast(city) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?units=metric&q=${city}&appid=${apiKey}`);
        const data = await response.json();

        const today = new Date(); 
        const nextFiveDays = new Set(); 

        const forecastItems = data.list
            .filter(day => {
                const dayDate = new Date(day.dt * 1000);
                const isNextDay = dayDate > today && !nextFiveDays.has(dayDate.getDate());

                if (isNextDay) {
                    nextFiveDays.add(dayDate.getDate()); 
                }
                return isNextDay;
            })
            .map(day => `
                <div class="weather-forecast-item">
                    <div class="day">${window.moment(day.dt * 1000).format('ddd')}</div>
                    <div class="temp">Day - ${Math.round(day.main.temp_max)}&#176;C</div>
                    <div class="temp">Night - ${Math.round(day.main.temp_min)}&#176;C</div>
                </div>
            `)
            .join('');

        document.getElementById('five-day-forecast').innerHTML = forecastItems;
    } catch (error) {
        console.error('Error fetching five-day forecast data', error);
    }
}


function updateCardBackground(temperature) {
    const card = document.querySelector('.card');

    if (temperature < 15) {
        card.style.background = 'linear-gradient(145deg,#6f9cbb, #28609f,#6f9cbb)';
    } else if (temperature >= 15 && temperature < 25) {
        card.style.background = 'linear-gradient(145deg,#e2b66b, #c8940e, #e2b66b)';
    } else {
        card.style.background = 'linear-gradient(145deg,#df6d54, #da3913, #df6d54)';
    }
}
