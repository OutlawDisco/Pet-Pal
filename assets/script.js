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
        console.log(data);
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
  return (canAmount / (wetCup * 6)).toFixed(1);
}

// bag amount per pounds
function servingPerBag(dryCup, bagAmount) {
  return (bagAmount * 4) / dryCup;
}

// TO DO:
//  Make "cans on hand" option on tab(oz per can & number of cans)

// Make a "bags on hand" option on tab (pounds per bag & number of bags)

//Store servings remaining for servingsLeftWet, and servingsLeftDry in Pantry

//create function that subtracts # servings-per-day from Pantry (servings left wet/dry) every 24hrs

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
function servingsLeftDry(mealsPerDay, amountOfFood) {
  // convert bags on hand to pounds
  var bagOnHand = pantry.dryFood;
  // convert pounds to dry-cups
  var BOH = parseFloat(servingsPerBag(amountOfFood, bagOnHand.lbs));
  // divide dry-cups # by food-per-servings# = servings total
  // divide servings total by days in a week = servings left
  var servingsRemaining = BOH * bagOnHand.qty - mealsPerDay;
  console.log(BOH);
  console.log(servingsRemaining / BOH);
  // display servings left of dry food
  return servingsRemaining;
}

var petPalPet = {
  dayMade: '',
  pet: {
    name: "",
    type: "",
  },
  pantry: {
    meals: "",
    type: "",
    oz: "",
    lbs: "",
    serving: "",
    date: "",
  },
  grooming: {
    skin: "",
    coat: "",
    length: "",
    shedding: false,
  },
  subtractFood: function (){
    var currDate = dayjs.format('MM-DD-YY');
  }
};

// Pulls 'name' from localStorage and returns it
function pullFromLocal(name){
  var stored = JSON.parse(localStorage.getItem(name));
  if(stored !== null){
    return stored;
  }else{
    return [];
  }
}

// Saves 'toPush' in local storage as 'name'
function pushToLocal(name, toPush){
  localStorage.setItem(name, JSON.stringify(toPush));
}