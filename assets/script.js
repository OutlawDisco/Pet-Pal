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
          console.log(`Breed: ${data[0].name}`);
          console.log(`Temperament: ${data[0].temperament}`);
          console.log(`Life span: ${data[0].life_span}`);
        } else {
          console.log(`No data found for breed: ${breed}`);
        }
      },
    });
  }
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
