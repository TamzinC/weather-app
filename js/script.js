
// https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}
// https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}

var apiKey = '903bdd38e14db35f1d502c3f3db85a20';
var city = 'London'; //this needs to be changed to user input


//API for getting current weather info for a city
$.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
    .then(function(currentData) {
        var lon = currentData.coord.lon;
        var lat = currentData.coord.lat;

        console.log(currentData);
        console.log(`
        ____Current Conditions____
        Temp: ${Math.round(currentData.main.temp)} °C
        Wind: ${currentData.wind.speed} M/S
        Humidity: ${currentData.main.humidity}%
        `);

        //API for getting 5 day weather forecast for a city
        $.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
            .then(function(forecastData) {
                console.log(forecastData);
            });
    });


    //NEED TO USE THIS TO ADD ICON TO REPRESENT WEATHER!!
    //https://openweathermap.org/img/w/ + ICON_ID + .png


    //Getting users current location:
    // function getLocation() {
    //     navigator.getLocation.getCurrentPosition(function (a, b) {
    //         var lat = data.coords.latitude;
    //         var long = data.coords.longtitide;
    //         console.log(lat, lon);
    //     })
    // }

    // getLocation();