const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.urlencoded({extended:true}));

app.get("/", function(req, res){

res.sendFile(__dirname + "/index.html");
});

app.post("/", function (req, res) {
  const query = req.body.cityName;
  const apiKey = "{{api-key}}"; // Insert your openweathermap api key here
  const unit = "metric";
  const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apiKey + "&units=" + unit;
  https.get(url, function(response){
    console.log(response.statusCode);

    response.on("data", function(data){
      const weatherData = JSON.parse(data);
      if (weatherData.cod === '404') {
        res.write("<p>This city is not found</p>");
        res.write("<p>Please <a href='/'>try again</a></p>");
      } else {
        console.log(weatherData);
        const temp = weatherData.main.temp
        const weatherDescription = weatherData.weather[0].description
        const icon = weatherData.weather[0].icon
        const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png"
        res.write("<p>The weather is currently "  + weatherDescription + "</p>");
        res.write("<h2>The temperature in  " + query + "  is " + temp + " degrees Celcius.</h2>");
        res.write("Try <a href='/'>another city</a>")
      }
      res.send();
    });

  });

});

app.listen(3000, function(){
	console.log("Server is running on port 3000.");
});
