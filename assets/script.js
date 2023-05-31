$(function () {
  //enevt listener on search button
  $("#search-btn").on("click", function () {
    //grab city input value
    var city = $("#city-input").val();
    localStorage.setItem("city", city);
    //call the weather data function
    getWeatherData(city);
  });
  //create get weather data function and pass in the city
  function getWeatherData(city) {
    var apiKey = "c0c121fba052263fed9243172c4438c8";

    $.ajax({
      url: `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`,
      type: "GET",
      dataType: "json",
      success: function (data) {
        console.log(data);
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

  $(function () {
    //get the data from the local storage
    var city = localStorage.getItem("city");
    if (city) {
      $("#city-input").val(city);
      getWeatherData(city);
    }
  });
});
