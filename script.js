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
    console.log(localStorage);
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
        console.log(queryURL);
        console.log(response);
        var iconCode = "http://openweathermap.org/img/wn/" + response.weather[0].icon + ".png"
        cityLat = response.coord.lat;
        cityLon = response.coord.lon;
        $("#current-city").html(`${citySearch} (${moment().format("M/D/YYYY")})`);
        $("#weather-icon").attr("src", iconCode);
        $("#temperature").html(`Temperature: ${((response.main.temp - 273.15) * 1.8 + 32).toFixed(1)} &#8457`);
        $("#humidity").html(`Humidity: ${response.main.humidity}%`);
        $("#wind-speed").html(`Wind Speed: ${response.wind.speed} MPH`);

        $.ajax({
            url: "https://api.openweathermap.org/data/2.5/uvi?appid=46ef9cf3388c1ee5870a9fa681588d0f&lat=" + cityLat + "&lon=" + cityLon,
            method: "GET"
        })
            .then(function(response) {
                console.log(response.value);
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
}









makeAPICall();
