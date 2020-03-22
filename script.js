//set global variables for city to be searched along w/ lat/long
var citySearch;
var cityLat;
var cityLon;

//when the page is opened, check for city in local storage. if yes, display city in sidebar
if (localStorage.savedCity !== undefined) {
    var lastCity = $("<li>").text(localStorage.savedCity).attr({"class": "list-group-item text-truncate", "id": localStorage.savedCity});
    $("#city-list").append(lastCity);
}

//when the page is opened, check to see if citySearch has been defined. if no, set citySearch to city in local storage. set citySearch for ajax call w/o event listener
if (citySearch === undefined) {
    citySearch = localStorage.savedCity;
}

$("#search-button").on("click", function(event) {
    event.preventDefault();
    citySearch = $(this).prev().val();
    if (citySearch === "") {
        return;
    }
    //check to see if citySearch has been defined. if yes, make api call w/ existing data. return so the sidebar won't be prepended with redundant info
    if (citySearch === localStorage.savedCity) {
        makeAPICall();
        return;
    }
    //clear local storage to make room for new city
    localStorage.clear();
    //set "id" attribute to newCity element for easy access on future event listener
    var newCity = $("<li>").text(citySearch).attr({"class": "list-group-item text-truncate", "id": citySearch});
    $("#city-list").prepend(newCity);
    //set new citySearch to local storage
    localStorage.setItem("savedCity", citySearch);
    //clear user input
    $("#city-search").val("");
    makeAPICall();
});

//target any li in the sidebar
$("ul").on("click", function(event) {
    event.preventDefault();
    //grab "id" from newCity on line 32
    citySearch = event.target.id;
    makeAPICall();
});

//code to populate current weather forecast
function makeAPICall() {
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + citySearch + "&appid=46ef9cf3388c1ee5870a9fa681588d0f";
//current weather ajax call
    $.ajax({
        url: queryURL,
        method: "GET"
    })
        .then(function(response) {
            populateData(response);
            console.log(response);
        });

    function populateData(response) {
        var iconCode = "http://openweathermap.org/img/wn/" + response.weather[0].icon + ".png";
        cityLat = response.coord.lat;
        cityLon = response.coord.lon;
        $("#current-city").html(`${citySearch} (${moment().format("M/D/YYYY")})`);
        $("#weather-icon").attr("src", iconCode).height(50);
        $("#temperature").html(`Temperature: ${((response.main.temp - 273.15) * 1.8 + 32).toFixed(0)} &#8457`);
        $("#humidity").html(`Humidity: ${response.main.humidity}%`);
        $("#wind-speed").html(`Wind Speed: ${response.wind.speed} MPH`);
//uv index ajax call
        $.ajax({
            url: "https://api.openweathermap.org/data/2.5/uvi?appid=46ef9cf3388c1ee5870a9fa681588d0f&lat=" + cityLat + "&lon=" + cityLon,
            method: "GET"
        })
            .then(function(response) {
                $("#uv-index").html(`UV Index: `);
                $("#uv-index-value").html(`${response.value}`);
                //conditionals to set correlating background with uv index
                if (response.value >= 11) {
                    $("#uv-index-value").css("background-color", "#ae739f");
                } else if (response.value >= 8) {
                    $("#uv-index-value").css("background-color", "#ed4950");
                } else if (response.value >= 6) {
                    $("#uv-index-value").css("background-color", "#f28a3e");
                } else if (response.value >= 3) {
                    $("#uv-index-value").css("background-color", "#f4d631");
                } else {
                    $("#uv-index-value").css("background-colr", "#78a234");
                }
            });
    }
    makeForecastAPICall();
}

function makeForecastAPICall() {
    var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + citySearch + "&appid=46ef9cf3388c1ee5870a9fa681588d0f";
//ajax call for extended forecast
    $.ajax({
        url: queryURL,
        method: "GET"
    })
        .then(function(response) {
            console.log(response);
            populateForecastData(response);
        });

    function populateForecastData(response) {
        //variables holding element id's to iterate through for loop
        var dayDate = [$("#day-1-date"), $("#day-2-date"), $("#day-3-date"), $("#day-4-date"), $("#day-5-date")];
        var dayIcon = [$("#day-1-icon"), $("#day-2-icon"), $("#day-3-icon"), $("#day-4-icon"), $("#day-5-icon")];
        var dayTemp = [$("#day-1-temp"), $("#day-2-temp"), $("#day-3-temp"), $("#day-4-temp"), $("#day-5-temp")];
        var dayHumidity = [$("#day-1-humidity"), $("#day-2-humidity"), $("#day-3-humidity"), $("#day-4-humidity"), $("#day-5-humidity")];
        //index numbers of targeted response.list array. will not consistently render forecast at 1200
        var listNumbers = [3, 11, 19, 27, 35];

        for (var i = 0; i < dayDate.length; i++) {
            dayDate[i].html(`${moment().add((i + 1), "d").format("M/D/YYYY")}`);
            dayIcon[i].attr("src", "https://openweathermap.org/img/wn/" + response.list[listNumbers[i]].weather[0].icon + ".png");
            dayTemp[i].html(`Temp: ${((response.list[listNumbers[i]].main.temp - 273.15) * 1.8 + 32).toFixed(0)} &#8457`);
            dayHumidity[i].html(`Humidity: ${response.list[listNumbers[i]].main.humidity}%`);
        }
    }
}

makeAPICall();