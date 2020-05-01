//ExpressJS is required as the governing app server
const express = require('express');
const request = require('request');
//Enter your API Key Here (from openweathermap)
const apiKey = '##########################';
const port =  3000;
//Middleware of expressjs
const bodyParser = require('body-parser');
const app =  express()
//Using Embedded JavaScript as HTML Renderer
//This line will provideed to use template engine in ExpressJS for EJS
app.set('view engine', 'ejs');

//allows us to access all of the static files within the ‘public’ folder.
app.use(express.static('public'));

//By the use of it, we can  make use of req.body object
app.use(bodyParser.urlencoded({ extended: true }));

//Boilerplate code can be found on https://expressjs.com/en/starter/hello-world.html
app.get('/', function (req, res) {
  res.render("index", { weather: null, error: null });
});


app.post('/', function (req,res) { 
     let city = req.body.city;
     let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`

  request(url, function (err, response, body) {
		if(err){
		  res.render('index', {weather: null, error: 'Error, please try again. Either the City doesn\'t valid or the API is down'});
		} else {
		  let weather = JSON.parse(body);
		  //console.log(weather);
		  if(weather.main == undefined){
			res.render('index', {weather: null, error: 'Error, please try again. <br/>Either the City doesn\'t valid or the API is down'});
		  } else {
			let atmPre = 0.00131579*`${weather.main.pressure}`;
			let urlOfIcon = `http://openweathermap.org/img/w/${weather.weather[0].icon}.png`;
			let addInfo = `This city is located in <span style="color:red;text-shadow:0 0 12px rgba(230, 26, 25, 0.2)">${weather.sys.country}</span> <br/>Wind speed is ${weather.wind.speed} km/h, at a degree of ${weather.wind.deg}.<br/>
			    The Humidity is <span style="color:red;text-shadow:0 0 12px rgba(230, 26, 25, 0.2)">${weather.main.humidity}%</span> while the pressure is <span style="color:red;text-shadow:0 0 12px rgba(230, 26, 25, 0.2)">${atmPre}</span> atm`;	
			let weatherText = `It's ${weather.main.temp} °C in <span style="color:red;text-shadow:0 0 12px rgba(230, 26, 25, 0.2)">${weather.name}!</span> and It feels like ${weather.main.feels_like} °C .  <br/> The outside condition is <span style="color:red;text-shadow:0 0 12px rgba(230, 26, 25, 0.2)">${weather.weather[0].main}</span>`;
			
			res.render('index', {weather: weatherText, error: null,urlOfIcon:urlOfIcon,addInfo:addInfo});
		  }
		}
  });
}) //old code was res.send('Hello World')


app.listen(port,() => console.log(`The App is listning at the port: ${port}`));



