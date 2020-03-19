var citySearch;
var cityLat;
var cityLon;

//populate search history with last search when opening the page
if (localStorage.savedCity !== null) {
    var lastCity = $("<li>").text(localStorage.savedCity);
    lastCity.attr("class", "list-group-item");
    $("#city-list").append(lastCity);
}

//set citySearch to last searched city to populate data for ajax call when opening the page
if (citySearch === undefined) {
    citySearch = localStorage.savedCity;
}

$("button").on("click", function() {
    event.preventDefault();
    citySearch = $(this).prev().val();
    if (citySearch === "") {
        return;
    }
    if (citySearch === localStorage.savedCity) {
        makeAPICall();
        return;
    }
    localStorage.clear();
    var newCity = $("<li>").text(citySearch);
    newCity.attr("class", "list-group-item");
    $("#city-list").append(newCity);
    localStorage.setItem("savedCity", citySearch);
    // console.log(localStorage);
    makeAPICall();
});

$("li").on("click", function() {
    event.preventDefault();
    console.log(event.target);
});

function makeAPICall() {
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + citySearch + "&appid=46ef9cf3388c1ee5870a9fa681588d0f";

    $.ajax({
        url: queryURL,
        method: "GET"
    })
        .then(function(response) {
            populateData(response);
        });

    function populateData(response) {
        // console.log(queryURL);
        // console.log(response);
        var iconCode = "http://openweathermap.org/img/wn/" + response.weather[0].icon + ".png";
        cityLat = response.coord.lat;
        cityLon = response.coord.lon;
        $("#current-city").html(`${citySearch} (${moment().format("M/D/YYYY")})`);
        $("#weather-icon").attr("src", iconCode);
        $("#temperature").html(`Temperature: ${((response.main.temp - 273.15) * 1.8 + 32).toFixed(0)} &#8457`);
        $("#humidity").html(`Humidity: ${response.main.humidity}%`);
        $("#wind-speed").html(`Wind Speed: ${response.wind.speed} MPH`);

        $.ajax({
            url: "https://api.openweathermap.org/data/2.5/uvi?appid=46ef9cf3388c1ee5870a9fa681588d0f&lat=" + cityLat + "&lon=" + cityLon,
            method: "GET"
        })
            .then(function(response) {
                // console.log(response.value);
                $("#uv-index").html(`${response.value}`);
                if (response.value >= 11) {
                    $("#uv-index").css("background-color", "#ae739f");
                } else if (response.value >= 8) {
                    $("#uv-index").css("background-color", "#ed4950");
                } else if (response.value >= 6) {
                    $("#uv-index").css("background-color", "#f28a3e");
                } else if (response.value >= 3) {
                    $("#uv-index").css("background-color", "#f4d631");
                } else {
                    $("#uv-index").css("background-colr", "#78a234");
                }
            });
    }
    makeForecastAPICall();
}



function makeForecastAPICall() {
    var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + citySearch + "&appid=46ef9cf3388c1ee5870a9fa681588d0f";

    $.ajax({
        url: queryURL,
        method: "GET"
    })
        .then(function(response) {
            populateForecastData(response);
        });

    function populateForecastData(response) {
        console.log(response);
        //day 1
            $("#day-1-date").html(`${moment().add(1, "d").format("M/D/YYYY")}`);
            $("#day-1-icon").attr("src", "http://openweathermap.org/img/wn/" + response.list[9].weather[0].icon + ".png");
            $("#day-1-temp").html(`Temp: ${((response.list[9].main.temp - 273.15) * 1.8 + 32).toFixed(0)} &#8457`);
            $("#day-1-humidity").html(`Humidity: ${response.list[9].main.humidity}%`);

        //day 2
            $("#day-2-date").html(`${moment().add(2, "d").format("M/D/YYYY")}`);
            $("#day-2-icon").attr("src", "http://openweathermap.org/img/wn/" + response.list[17].weather[0].icon + ".png");
            $("#day-2-temp").html(`Temp: ${((response.list[17].main.temp - 273.15) * 1.8 + 32).toFixed(0)} &#8457`);
            $("#day-2-humidity").html(`Humidity: ${response.list[17].main.humidity}%`);
        
        //day 3
            $("#day-3-date").html(`${moment().add(3, "d").format("M/D/YYYY")}`);
            $("#day-3-icon").attr("src", "http://openweathermap.org/img/wn/" + response.list[25].weather[0].icon + ".png");
            $("#day-3-temp").html(`Temp: ${((response.list[25].main.temp - 273.15) * 1.8 + 32).toFixed(0)} &#8457`);
            $("#day-3-humidity").html(`Humidity: ${response.list[25].main.humidity}%`);

        //day 4
            $("#day-4-date").html(`${moment().add(4, "d").format("M/D/YYYY")}`);
            $("#day-4-icon").attr("src", "http://openweathermap.org/img/wn/" + response.list[33].weather[0].icon + ".png");
            $("#day-4-temp").html(`Temp: ${((response.list[33].main.temp - 273.15) * 1.8 + 32).toFixed(0)} &#8457`);
            $("#day-4-humidity").html(`Humidity: ${response.list[33].main.humidity}%`);
        
        //day 5
            $("#day-5-date").html(`${moment().add(5, "d").format("M/D/YYYY")}`);
            $("#day-5-icon").attr("src", "http://openweathermap.org/img/wn/" + response.list[39].weather[0].icon + ".png");
            $("#day-5-temp").html(`Temp: ${((response.list[39].main.temp - 273.15) * 1.8 + 32).toFixed(0)} &#8457`);
            $("#day-5-humidity").html(`Humidity: ${response.list[39].main.humidity}%`);    
    }
}

makeAPICall();