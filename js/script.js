var searchInput = $('#search-input');
var searchButton = $('#search-button');
var currentWeather = $('#today');
var forecastWeather = $('#forecast');
var searchHistory = $('#history');
var locationHistory = $('.location-history');
var apiKey = '903bdd38e14db35f1d502c3f3db85a20';
var localStorageArray = [];


//Adding the option to clear search history from localStorage
function clearPreviousSearch() {
    localStorage.removeItem('location');
    searchHistory.empty();
}

//Grabbing the relevant API data for current weather based on user input
function displayCurrentWeather(currentData) {
    console.log(currentData);
    currentWeather.html('');

    var currentDay = moment().format('DD/MM/YYYY'); //Getting the current date using moment.js
    var weatherIcon = currentData.weather[0]; //Identifying the icon code from the array
    console.log(currentDay);

    //Adding the current weather data to display in html
    currentWeather.append(`
    <div class="mt-3 jumbotron jumbotron-fluid p-4">
        <div class="container">
        <h2 class="ml-2">${currentData.name} (${currentDay})<img class="ml-4"src="https://openweathermap.org/img/w/${weatherIcon.icon}.png" alt="${weatherIcon.description}"/></h2>
            <ul class="current-weather row ml-2">
                <li>Temp: ${Math.round(currentData.main.temp)} °C</li> 
                <li>Wind: ${Math.round(currentData.wind.speed)} M/S</li>
                <li>Humidity: ${currentData.main.humidity}%</li>
            </ul>
        </div>
    </div>
    `);
};

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
        var forecastDay = moment(forecast.dt * 1000).format('DD/MM/YYYY'); //Using moment.js to use just the date using the unix timestamp in the data array
        var weatherIcon = forecast.weather[0]; //Identifying the icon code from the array

        //Creating the html elements for the forecasted weather
        output += `
                <li class="shadow-lg p-3 rb-5 bg-white rounded">
                    <p class="text-center mb-4 font-weight-bold">${forecastDay}</p>
                    <img src="https://openweathermap.org/img/w/${weatherIcon.icon}.png" alt="${weatherIcon.description}"/>
                    <p class="mt-4">Temp: ${Math.round(forecast.main.temp)} °C</p>
                    <p>Wind: ${Math.round(forecast.wind.speed)} M/S</p>
                    <p>Humidity: ${forecast.main.humidity}%</p>
                </li>
        `};

    //Adding forecasted weather data to html
    forecastWeather.append(`
        <h3 class="d-flex flex-wrap">5 Day Forecast:</h3>
        <ul class="future-forecast">${output}</ul>
        `)
};

//Filtering the forecast weather data to only show data for the next 5 days instead of every 3hrs
function filterByDateTime(forecastDate) {
    return forecastDate.dt_txt.indexOf('12:00:00') > 0;
};

// Setting localStorage to save user search history and display below submit button
function addToSearchHistory() {
    var location = searchInput.val(); //Getting the searched location from the search input

    if (location == '') {
        return;
    }

    //Running if statement to see if the searched location is already stored in localStorage
    if (localStorage.getItem('location') == null) {
        localStorageArray.push(location); //Pushing searched term into an array if it doesn't exist
    } else {
        localStorageArray = JSON.parse(localStorage.getItem('location')); //Parsing array string back into array if it already exists

        //Checking if keyword doesn't already exist in array, if not then pushing it through
        if (localStorageArray.indexOf(location) === -1) {
            localStorageArray.push(location);
        }

        //Adding searched term as a button under the search history section
        searchHistory.append(`
            <button data-location="${location}" type="button" class="location-history btn btn-secondary btn-block m-1">${location}</button>
        `);
    }


    //Stringifying searched terms array into a string
    localStorage.setItem('location', JSON.stringify(localStorageArray));

    attachClickEventToPreviousSearchButtons();

};

function getPreviouslySearchedTermsFromLocalStorage() {
    //If statement to check whether array already exists in localStorage, if it does, then parse it back into an array
    if (localStorage.getItem('location') != null) {
        localStorageArray = JSON.parse(localStorage.getItem('location'));

        //Using a for loop to add all previous searched terms as buttons
        for (var i = 0; i < localStorageArray.length; i++) {
            var place = localStorageArray[i];

            searchHistory.append(`
                <button data-location="${place}" type="button" class="location-history btn btn-secondary btn-block m-1">${place}</button>
            `)
        }
    }
    attachClickEventToPreviousSearchButtons();
};

//Creating click event for all search history buttons inside #history div
function attachClickEventToPreviousSearchButtons() {
    $('#history button').on('click', function () {
        searchInput.val($(this).data('location')); //repopulating searchInput using data-location attribute

        //Removing and adding classes to change the highlighted button colours when selected
        $('#history button').removeClass('btn-info').addClass('btn-secondary');
        $(this).removeClass('btn-secondary').addClass('btn-info');
        getWeather();
    });
}


//Creating API requests to get current and forecasted weather
function getWeather(event) {

    //Adding if statement to check for blank inputs
    if (searchInput.val() == '' && !isNaN(searchInput.val())) {
        $('.modal-body').html('<p>Please enter a location.</p>');
        $('#alert-modal').modal('show');
        return;
    }

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
            
        }).fail(function (error) {
            //Checking for invalid locations due to spelling errors
            if (error.responseJSON.cod == '404') {
                $('.modal-body').html('<p>Location does not exist.</p>');
                $('#alert-modal').modal('show');
                searchInput.val('');
                return;
            };
        });
};

//Adding event listener on the submit button
function init() {
    getPreviouslySearchedTermsFromLocalStorage();

    searchButton.click(function (event) {
        event.preventDefault();
        getWeather();
    });

    //Adding event listener for enter key in the input section
    searchInput.keypress(function (event) {
        if (event.which == '13') {
            event.preventDefault();
            getWeather();
        }
    })
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