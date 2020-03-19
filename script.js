var citySearch;

//populate search history with last search when the page is opened
if (localStorage.savedCity !== null) {
    var lastCity = $("<li>").text(localStorage.savedCity);
    lastCity.attr("class", "list-group-item");
    $("#city-list").append(lastCity);
}

//make ajax call with last search when page is opened
if (citySearch === undefined) {
    function init() {
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + localStorage.savedCity + "&appid=46ef9cf3388c1ee5870a9fa681588d0f";
    
        $.ajax({
            url: queryURL,
            method: "GET"
        })
            .then(function(response) {
                initPopulateData(response);
            });
    
        function initPopulateData(response) {
            console.log(queryURL);
            console.log(response);
            $("#current-city").html(`${localStorage.savedCity} (${moment().format("M/D/YYYY")})`);
            $("#temperature").html(`Temperature: ${response.main.temp}`);
            $("#humidity").html(`Humidity: `);
            $("#wind-speed").html(`Wind Speed: `);
            $("#uv-index").html(`UV Index: `);
        }
    }
    init();
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
        $("#current-city").html(`${citySearch} (${moment().format("M/D/YYYY")})`);
        $("#temperature").html(`Temperature: ${response.main.temp}`);
        $("#humidity").html(`Humidity: `);
        $("#wind-speed").html(`Wind Speed: `);
        $("#uv-index").html(`UV Index: `);
    }
}