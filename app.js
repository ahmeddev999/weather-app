import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
dotenv.config();


const apiKey = process.env.OPENWEATHER_API_KEY;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = 3033;

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
    // we getting user request
    const city = req.body["city"];
    
    // we getting city lat/lon 
    const geoResponse = await axios.get(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`)
    const geoData = geoResponse.data[0];
    const { lat, lon } = geoData;

    // getting the weather here and sending it back to user
    const weatherResponse = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
    res.render("index", { weather: weatherResponse.data, city });
    console.log(geoData);
  } catch (erorr) {
    console.log(erorr.response?.data || erorr.message);
    res.status(500).send("Error fetching weather data");
  }
});

app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});