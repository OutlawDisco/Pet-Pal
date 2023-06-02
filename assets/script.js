$(function () {
  //get the data from the local storage
  var city = localStorage.getItem("city");
  if (city) {
    $("#city-input").val(city);
    getWeatherData(city);
  }

  //create get weather data function and pass in the city
  function getWeatherData(city) {
    var weatherApiKey = "c0c121fba052263fed9243172c4438c8";

    $.ajax({
      url: `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherApiKey}`,
      type: "GET",
      dataType: "json",
      success: function (data) {
        $("#weather-title").text(`${data.name} - ${data.weather[0].main}`);
        $("#weather-temp").text(
          `Temperature: ${((data.main.temp * 9) / 5 - 459.67).toFixed(2)}°F`
        );
        $("#weather-date").text();
        $("#weather-icon").attr(
          "src",
          `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`
        );
        //declare the weather condition
        var weatherCondition = data.weather[0].main.toLowerCase();
        // if statment for if its raining, sunny, cloudy, snowing
        if (weatherCondition === "rain" || weatherCondition === "snow") {
          $("#dog-day-title").text("Stay In Alert!");
          $("#dog-day-text").text(
            "It's raining or snowing. Stay in and cuddle with your dog."
          );
        } else {
          $("#dog-day-title").text("Nice Day Alert!");
          $("#dog-day-text").text(
            "It's a beautiful day! Take your dog for a walk."
          );
        }
      },
    });
  }

  //create get national park data function
  function getNationalParkData() {
    var parkApiKey = "RDipcBT0gYwC0hhJZAqjkTs1r9urfPxu4MDAPYUz";

    $.ajax({
      url: `https://developer.nps.gov/api/v1/campgrounds?api_key=${parkApiKey}`,
      type: "GET",
      dataType: "json",
      success: function (data) {
        console.log(data);
      },
    });
  }
  function getDogData(breed) {
    var url = `https://api.thedogapi.com/v1/breeds/search?q=${breed}`;

    $.ajax({
      url: url,
      type: "GET",
      dataType: "json",
      success: function (data) {
        console.log(data);
        if (data.length > 0) {
          //dynamically update dog card text with searched breed
          $("#dog-breed").text(`Breed: ${data[0].name}`);
          $("#dog-temperament").text(`Temperament: ${data[0].temperament}`);
          $("#dog-life-span").text(`Life span: ${data[0].life_span}`);
        } else {
          $("#dog-breed").text(`No data found for breed: ${breed}`);
          $("#dog-temperament").text("");
          $("#dog-life-span").text("");
        }
      },
    });
  }

  //autocomplete- create an empty array for fetched dog breeds
  var breeds = [];

  // fetch all breeds for autocomplete functionality
  $.ajax({
    url: "https://api.thedogapi.com/v1/breeds",
    type: "GET",
    dataType: "json",
    success: function (data) {
      //loop through fetched data and push breed names to the breeds array
      for (var i = 0; i < data.length; i++) {
        breeds.push(data[i].name);
      }
      $("#breed-input").autocomplete({
        source: breeds,
      });
    },
  });
  //event listener on city search button
  $("#search-btn").on("click", function () {
    //grab city input value
    var city = $("#city-input").val();
    localStorage.setItem("city", city);
    //call the weather data function
    getWeatherData(city);
    //call national park data function
    getNationalParkData();
  });
  //event listener for dog breed
  $("#dog-form").on("submit", function (event) {
    event.preventDefault();
    var breed = $("#breed-input").val();
    getDogData(breed);
  });
});

// The PANTRY

// converts ounces of wet food to cups
function toWetCups(wetOz) {
  return wetOz / 6;
}

//  converts ounces of dry food to cups
function toDryCups(dryOz) {
  return dryOz / 3;
}
//can ammount is in ounces
function servingsPerCan(wetCup, canAmount) {
  return canAmount / (wetCup * 6);
}

// bag amount per pounds
function servingPerBag(dryCup, bagAmount) {
  return (bagAmount * 4) / dryCup;
}

// TO DO:
//  Make "cans on hand" option on tab(oz per can, number of cans)
// Create a Variables for Wet Food Cans in pantry

// Make a "bags on hand" Option on tab (pounds per bag, number of bags)
// Create Variables for Dry food Bags in pantry

//Create function that tracks servings per can on Wet food then store data
//Create function that tracks servings per can on Dry food then store data

//create function that subtracts # servings-per-day from Pantry every 24hrs

// Function steps for "servings left" on wet food

// convert can oz # to wet-cups #
// divide wet-cups # by food-per-serving# = servings total
// divide servings total by days in the week = servings left
// display servings left in wet food

// Function steps for "servings left" on dry food

// convert bags on hand to pounds
// convert pounds to dry-cups
// divide dry-cups # by food-per-servings# = servings total
// divide servings total by days in a week = servings left
// display servings left of dry food
