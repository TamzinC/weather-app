var searchInput = $('#search-input');
var searchButton = $('#search-button');
var currentWeather = $('#today');
var forecastWeather = $('#forecast');
var searchHistory = $('#history');
var locationHistory = $('.location-history');
var apiKey = '903bdd38e14db35f1d502c3f3db85a20';


//Grabbing the relevant API data for current weather based on user input
function displayCurrentWeather(currentData) {
    console.log(currentData);
    currentWeather.html('');

    var currentDay = moment().format('DD/MM/YYYY');
    var weatherIcon = currentData.weather[0];
    console.log(currentDay);

    currentWeather.append(`
    <div class="mt-3 jumbotron jumbotron-fluid">
    <div class="container">
    <h2>${currentData.name} (${currentDay}) <img src="https://openweathermap.org/img/w/${weatherIcon.icon}.png" alt="${weatherIcon.description}"/></h1>
    <ul class="current-weather row">
    <li>Temp: ${Math.round(currentData.main.temp)} °C</li> 
    <li>Wind: ${currentData.wind.speed} M/S</li>
    <li>Humidity: ${currentData.main.humidity}%</li>
    </ul>
    </div>
    </div>
    `);

}

//Grabbing the relevant API data for 5-day forcasted data based on user input
function displayForecastWeather(forecastData) {
    console.log(forecastData);
    forecastWeather.html('');

    var forecastDays = forecastData.list.filter(filterByDateTime);
    console.log(forecastDays);

    //Running for loop through forecastData object to get the required info
    var output = '';
    for (let index = 0; index < forecastDays.length; index++) {
        var forecast = forecastDays[index];
        var weatherIcon = forecast.weather[0];
        output += `<li class="shadow-lg p-3 rb-5 bg-white rounded">
        <p>${moment().add(1, 'days').format('DD/MM/YYYY')}</p>
        <img src="https://openweathermap.org/img/w/${weatherIcon.icon}.png" alt="${weatherIcon.description}"/>
        <p>Temp: ${Math.round(forecast.main.temp)} °C</p>
        <p>Wind: ${forecast.wind.speed} M/S</p>
        <p>Humidity: ${forecast.main.humidity}%</p>
        </li>
        `};

    forecastWeather.append(`
        <h3>5-Day Forecast:</h1>
        <ul class="future-forecast">${output}</ul>
        `)
};

//<p>${forecast.dt_txt}</p>

//filtering the forecast weather data to only show data for the next 5 days instead of every 3hrs
function filterByDateTime(forecastDate) {
    return forecastDate.dt_txt.indexOf('12:00:00') > 0;
};

// Setting localStorage to save user search history and display below submit button
function addToSearchHistory() {
    localStorage.setItem('location', JSON.stringify(searchInput.val()));

    var location = JSON.parse(localStorage.getItem('location'));
    searchHistory.append(`
    <button data-location="${location}" type="button" class="location-history btn btn-secondary btn-block m-1">${location}</button>
    `);
    
    locationHistory.on('click', function() {
        searchInput = $(location);
        getWeather();
    })
}

// function addToSearchHistory () {
//     localStorage.setItem('location', JSON.stringify(searchInput.val()));

//     var location = JSON.parse(localStorage.getItem('location'));
//     searchHistory.append (`
//         <p data-location="${location}">${location}</p>
//     `);

//     $('#history p').click(function (event) {
//         console.log($(this).data('location')); // https://www.w3schools.com/js/js_this.asp
//         console.log(event);
//     });
// }


//Creating API requests to get current and forecasted weather
function getWeather(event) {
    event.preventDefault();
    
    //API request for getting current weather info for a location
    $.get(`https://api.openweathermap.org/data/2.5/weather?q=${searchInput.val()}&appid=${apiKey}&units=metric`)
    .then(function (currentData) {
        var lon = currentData.coord.lon;
        var lat = currentData.coord.lat;
        displayCurrentWeather(currentData);
        
        //API request for getting forecasted weather for a location
        $.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
        .then(function (forecastData) {
            displayForecastWeather(forecastData);
        });
        
        addToSearchHistory();
        searchInput.val('');
        
        
        });
}

//Adding event listener on the submit button
function init() {
    searchButton.click(getWeather);
}

init();




// https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}
// https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}
// NEED TO USE THIS TO ADD ICON TO REPRESENT WEATHER!! https://openweathermap.org/img/w/ + ICON_ID + .png

/*
  When Page Loads:

  1. Show user an input to allow them to search for a city
    - show a message on the page to point them, or guide them, to the input.
    - Once city has been inputted:
      a. Show Current Forecast
      b. Show 5 day Forecast
      c. Add city name to search history
        - Get previous searches from localStorage
        - If inputted city has not been stored to search history in localStorage, push the city name
        - Set the search history to localStorage
  2. Show search history
    - Pull search history from localStorage
    - If search history is not empty, output each city to the search history display in the DOM
*/





    //Getting users current location:
    // function getLocation() {
    //     navigator.getLocation.getCurrentPosition(function (a, b) {
    //         var lat = data.coords.latitude;
    //         var long = data.coords.longtitide;
    //         console.log(lat, lon);
    //     })
    // }

    // getLocation();