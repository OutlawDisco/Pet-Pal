$(function () {
  //get the data from the local storage
  var city = localStorage.getItem("city");
  if (city) {
    $("#city-input").val(city);
    getWeatherData(city);
  }
  $("#dog-breed").text("Search for a dog breed!");
  $("#dog-temperament").text("");
  $("#dog-life-span").text("");
  $("#dog-img").attr("alt", "");

  //create get weather data function and pass in the city
  function getWeatherData(city) {
    var weatherApiKey = "c0c121fba052263fed9243172c4438c8";

    $.ajax({
      url: `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${weatherApiKey}`,
      type: "GET",
      dataType: "json",
      success: function (data) {
        $("#weather-title").text(`${data.name} - ${data.weather[0].main}`);
        $("#weather-temp").text(`Temperature: ${data.main.temp}°F`);
        $("#weather-date").text();
        $("#weather-icon").attr(
          "src",
          `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`
        );
        //declare the weather condition, temp and dom references for message title and text elements
        var weatherCondition = data.weather[0].main.toLowerCase();
        var temperature = data.main.temp;
        var dogDayTitle = $("#dog-day-title");
        var dogDayText = $("#dog-day-text");

        // if statement for different weather conditions using https://openweathermap.org/weather-conditions
        if (weatherCondition === "rain") {
          dogDayTitle.text("Rain Alert!");
          dogDayText.text("Stay in and cuddle up with your dog!");
        } else if (weatherCondition === "snow") {
          dogDayTitle.text("Snow Alert!");
          dogDayText.text(
            "Be sure to bundle up if you take your dog for a walk!"
          );
        } else if (weatherCondition === "clear") {
          dogDayTitle.text("Nice Day Alert!");
          if (temperature > 85) {
            dogDayText.text(
              "It's hot! Test the cement with your hand. If you can hold it for 7 seconds, it's pawsitively safe for a walk!"
            );
          } else if (temperature < 30) {
            dogDayText.text(
              "Brrr! Put on a few extra layers for you and your dog !"
            );
          } else {
            dogDayText.text("It's a beautiful day! Take your dog for a walk.");
          }
        } else if (weatherCondition === "clouds") {
          dogDayTitle.text("Cloudy Day Alert!");
          if (temperature > 85) {
            dogDayText.text(
              "It's hot! Test the cement with your hand. If you can hold it for 7 seconds, it's pawsitively safe for a walk!"
            );
          } else {
            dogDayText.text("It's a nice day, your dog might enjoy a walk!");
          }
        } else if (weatherCondition === "drizzle") {
          dogDayTitle.text("Drizzle Alert!");
          dogDayText.text("Don't forget a raincoat for you and your dog!");
        } else if (weatherCondition === "thunderstorm") {
          dogDayTitle.text("Thunderstorm Alert!");
          dogDayText.text(
            "Sit, Stay-In! Make sure your dog has a calm and quiet space in your home to ride out the storm."
          );
        } else {
          dogDayTitle.text("Be Cautious!");
          dogDayText.text(
            `It looks like ${weatherCondition} is in the air. Be cautious if you're taking your dog on a walk!`
          );
        }
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
        if (data.length > 0) {
          //dynamically update dog card text with searched breed
          $("#dog-breed").text(`Breed: ${data[0].name}`);
          $("#dog-temperament").text(`Temperament: ${data[0].temperament}`);
          $("#dog-life-span").text(`Life span: ${data[0].life_span}`);
          // call function to get the dog image
          var breedId = data[0].id;
          getDogImage(breedId);
        } else {
          $("#dog-breed").text(`No data found for breed: ${breed}`);
          $("#dog-temperament").text("");
          $("#dog-life-span").text("");
          $("#dog-img").attr("src", "");
        }
      },
    });
  }
  // fetch the dog breed images using the breedid
  function getDogImage(breedId) {
    var url = `https://api.thedogapi.com/v1/images/search?breed_ids=${breedId}&size=small&include_breeds=true`;

    $.ajax({
      url: url,
      type: "GET",
      dataType: "json",
      success: function (data) {
        if (data.length > 0 && data[0].url) {
          $("#dog-img").attr("src", data[0].url);
        } else {
          $("#dog-img").attr("src", "");
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
  });

  //event listener for dog breed
  $("#dog-form").on("submit", function (event) {
    event.preventDefault();
    var breed = $("#breed-input").val();
    getDogData(breed);
    // remove spaces and add hypens and make the characters lower case for the url link
    var urlBreed = breed.replace(/\s+/g, "-").toLowerCase();

    $("#adopt-btn").click(function () {
      window.location.href = `https://www.petfinder.com/dogs-and-puppies/breeds/${urlBreed}/`;
    });
    $(".adopt-section").show();
    $("#dog-img").show();
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
  return (canAmount / (wetCup * 6)).toFixed(1);
}

// bag amount per pounds
function servingPerBag(dryCup, bagAmount) {
  return (bagAmount * 4) / dryCup;
}

// To Do: store user input for #'s
var pantry = {
  wetFood: {
    qty: 1, //cans
    oz: 12.2, //oz per can
  },
  dryFood: {
    qty: 0.5, // bags
    lbs: 5, //lbs per bag
  },
};

// Function steps for "servings left" on wet food
function servingsLeftWet(mealPerDay, amountOfFood) {
  // convert can oz # to wet-cups #
  var canOnHand = pantry.wetFood;
  // divide wet-cups # by food-per-serving# = servings total
  var SPC = parseFloat(servingsPerCan(amountOfFood, canOnHand.oz));
  // divide servings total by days in the week = servings left
  var servingsRemaining = SPC * canOnHand.qty - mealPerDay;
  console.log(SPC);
  console.log(servingsRemaining / SPC); //% of the can left
  // display servings left in wet food
  return servingsRemaining;
}

// Function steps for "servings left" on dry food
function servingsLeftDry() {}

var PetPalPet = {
  dayMade: 0,
  pet: {
    name: "",
    type: "dog",
  },
  dryFood: {
    meals: 0,
    lbsPerServing: 0,
    bags: 0,
    lbsPerBag: 0,
    servingsLeft: function () {
      var totalLbs = this.bags * this.lbsPerBag;
      var foodPerDay = this.meals * this.lbsPerServing;
      var servingsLeft = totalLbs / foodPerDay;
      return servingsLeft;
    },
  },
  wetFood: {
    meals: 0,
    ozPerServing: 0,
    cans: 0,
    ozPerCan: 0,
    servingsLeft: function () {
      var totalOzs = this.cans * this.ozPerCan;
      var foodPerDay = this.meals * this.ozPerServing;
      var servingsLeft = totalOzs / foodPerDay;
      return servingsLeft;
    },
  },
  grooming: {
    skin: "",
    coat: "",
    length: "",
    shedding: false,
  },
  subtractFood: function () {
    var numDaysPassed = daysSince2000(dayjs().format("DDMMYY")) - this.dayMade;
    // add math to multiply the number of days by the amount of food per day
  },
  initializeDay: function () {
    this.dayMade = daysSince2000(dayjs().format("DDMMYY"));
  },
};

// Converts DDMMYY format into the amount of days since year 2000
function daysSince2000(day) {
  var year = parseInt(day.substr(4, 2));
  var dayCounter = (year - 1) * 365;

  var daysInMonth = [31, 28, 31, 30, 31, 30, 31, 30, 31, 30, 31, 30];
  if (year % 4 === 0) {
    daysInMonth[1] = 29;
  }
  var month = parseInt(day.substr(2, 2));
  for (var i = 0; i < month - 1; i++) {
    dayCounter += daysInMonth[i];
  }
  dayCounter += parseInt(day.substr(0, 2));
  return dayCounter;
}

// Pulls 'name' from localStorage and returns it
function pullFromLocal(name) {
  var stored = JSON.parse(localStorage.getItem(name));
  if (stored !== null) {
    return stored;
  } else {
    return PetPalPet;
  }
}

// Saves 'toPush' in local storage as 'name'
function pushToLocal(name, toPush) {
  localStorage.setItem(name, JSON.stringify(toPush));
}

// Call for testing
grabPetInfo();

// Function for "save changes" event handler
function grabPetInfo() {
  PetPalPet.dayMade = daysSince2000(dayjs().format("DDMMYY"));
  PetPalPet.pet.name = $("#pet-name-input").val();
  // Not sure how this input type works yet

<<<<<<< HEAD
  // PetPalPet.pet.type =
  if (/* Dry food checkbox is checked */ true) {
    PetPalPet.dryFood.meals = $("#meals-select").val();
    PetPalPet.dryFood.cupsPerServing = $("#dry-food-meal-input").val();
    PetPalPet.dryFood.bags = $("#dry-inventory").children("input").eq(0).val();
    PetPalPet.dryFood.lbsPerBag = $("#dry-inventory")
      .children("input")
      .eq(1)
      .val();
=======
  // PetPalPet.pet.type = 
  if(/* Dry food checkbox is checked */ true){
    PetPalPet.dryFood.meals = $('#meals-select').val();
    PetPalPet.dryFood.cupsPerServing = $('#dry-food-meal-input').val();
    PetPalPet.dryFood.bags = $('#dry-inventory').children('input').eq(0).val();
    PetPalPet.dryFood.lbsPerBag = $('#dry-inventory').children('input').eq(1).val();
>>>>>>> main
  }
  if (/* Wet food checkbox is checked */ true) {
    PetPalPet.wetFood.meals = $("#meals-select").val();
    PetPalPet.wetFood.cupsPerServing = $("#wet-food-meal-input").val();
    PetPalPet.wetFood.cans = $("#wet-inventory").children("input").eq(0).val();
    PetPalPet.wetFood.ozPerCan = $("#wet-inventory")
      .children("input")
      .eq(1)
      .val();
  }

  // add stuff for grooming tab

  console.log(PetPalPet);
  console.log($("#dry-food-check-input"));
}
