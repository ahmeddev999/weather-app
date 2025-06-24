import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';


const apiKey = process.env.OPENWEATHER_API_KEY;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = 3033;
dotenv.config();

// view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


// statics
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/src', express.static(path.join(__dirname, 'src')));
app.use('/images', express.static(path.join(__dirname, 'images')));

// Routes
app.get('/', (req, res) => {
  res.render('index');
});


app.post("/weather", async (req, res) => {
  try {
    // we get user request
    const city = req.body["city"];
    // we get city lat/lon 
    const latlonResponse = await axios.get(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`);
    const lat = latlonResponse.data.lat;
    const lon = latlonResponse.data.lon;
    
    // get the weather here and send it back
    const weatherResponse = await axios.get(`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude={minutely}&appid=${apiKey}`);
    res.redirect("index.ejs", {})
  } catch (erorr) {
    console.log(error.response?.data || error.message);
    res.status(500).send("Error fetching weather data");
  }
});


app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
