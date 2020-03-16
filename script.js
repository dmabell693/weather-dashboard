var citySearch;

if (localStorage.savedCity !== null) {
    var lastCity = $("<li>").text(localStorage.savedCity);
    lastCity.attr("class", "list-group-item");
    $("#city-list").append(lastCity);
}

$("button").on("click", function() {
    event.preventDefault();
    citySearch = $(this).prev().val();
    if (citySearch === "") {
        return;
    }
    localStorage.clear();
    var newCity = $("<li>").text(citySearch);
    newCity.attr("class", "list-group-item");
    $("#city-list").append(newCity);
    localStorage.setItem("savedCity", citySearch);
    console.log(localStorage);
});

$("li").on("click", function() {
    event.preventDefault();
    console.log(event.target);
});

$("#current-city").html(`Atlanta (8/15/2019)`);
$("#temperature").html(`Temperature: `);
$("#humidity").html(`Humidity: `);
$("#wind-speed").html(`Wind Speed: `);
$("#uv-index").html(`UV Index: `);