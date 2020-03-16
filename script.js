var citySearch;

$("button").on("click", function() {
    event.preventDefault();
    citySearch = $(this).prev().val();
    var newCity = $("<li>").text(citySearch);
    newCity.attr("class", "list-group-item");
    $("#city-list").append(newCity);
    localStorage.setItem("citySearches", citySearch);
    console.log(localStorage);
})

$("#current-city").html(`Atlanta (8/15/2019)`);
$("#temperature").html(`Temperature: `);
$("#humidity").html(`Humidity: `);
$("#wind-speed").html(`Wind Speed: `);
$("#uv-index").html(`UV Index: `);