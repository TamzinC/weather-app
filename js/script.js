var searchInput = $('#search-input');
var searchButton = $('#search-button');
var currentWeather = $('#today');
var forecastWeather = $('#forecast');
var apiKey = '903bdd38e14db35f1d502c3f3db85a20';


function displayCurrentWeather(currentData) {
    console.log(currentData);
    currentWeather.html('');
    currentWeather.append(`
    <h1>${currentData.name}</h1>
    <ul class="current-weather row">
    <li>Temp: ${Math.round(currentData.main.temp)} °C</li> 
    <li>Humidity: ${currentData.main.humidity}%</li>
    <li>Wind Speed: ${currentData.wind.speed} M/S</li>
    </ul>
    `);
    
    //need to grab relevant data for forecasted weather like above
    
}

function displayForecastWeather(forecastData) {
    console.log(forecastData);
    forecastWeather.html('');
    forecastWeather.append(`
    <h1>${forecastData.city.name}</h1>
    ${JSON.stringify(forecastData, null, 2)}
    `)

    for (var forecastDay = 0; forecastData.list < 6; forecastDay++) {

    };
};


function getWeather(event) {
    event.preventDefault();

    //API for getting current weather info for a city
    $.get(`https://api.openweathermap.org/data/2.5/weather?q=${searchInput.val()}&appid=${apiKey}&units=metric`)
        .then(function (currentData) {
            var lon = currentData.coord.lon;
            var lat = currentData.coord.lat;

            // console.log(currentData);
            // console.log(`
            // ____Current Conditions____
            // Temp: ${Math.round(currentData.main.temp)} °C
            // Wind: ${currentData.wind.speed} M/S
            // Humidity: ${currentData.main.humidity}%
            // `);

            displayCurrentWeather(currentData);

            $.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
                .then(function (forecastData) {
                    // console.log(forecastData);

                    displayForecastWeather(forecastData);
                });

                searchInput.val('');
        });
}


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

//Add event listener for input (show weather + add to search history if not already there)

// currentDayString = moment().format('dddd, MMMM Do');
// currentDay.text(currentDayString);

// console.log(currentDay);

// $('#search-button').click(function(event) {
//     event.preventDefault();

//     var apiKey = '903bdd38e14db35f1d502c3f3db85a20';
//     var city = $('input').val(); //this needs to be changed to user input


//     //API for getting current weather info for a city
//     $.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
//         .then(function (currentData) {
//             var lon = currentData.coord.lon;
//             var lat = currentData.coord.lat;

//             console.log(currentData);
//             console.log(`
//             ____Current Conditions____
//             Temp: ${Math.round(currentData.main.temp)} °C
//             Wind: ${currentData.wind.speed} M/S
//             Humidity: ${currentData.main.humidity}%
//             `);

//             $('#today').append(`
//                 <ul class="current-weather row">
//                     <li>Temp: ${Math.round(currentData.main.temp)} °C</li> 
//                     <li>Humidity: ${currentData.main.humidity}%</li>
//                     <li>Wind Speed: ${currentData.wind.speed} M/S</li>
//                 </ul>
//             `);

//             //API for getting 5 day weather forecast for a city
//             $.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
//                 .then(function (forecastData) {
//                     console.log(forecastData);

//                     $('#forecast').append(forecastData);
//                 });
//         });
// });






    //Getting users current location:
    // function getLocation() {
    //     navigator.getLocation.getCurrentPosition(function (a, b) {
    //         var lat = data.coords.latitude;
    //         var long = data.coords.longtitide;
    //         console.log(lat, lon);
    //     })
    // }

    // getLocation();