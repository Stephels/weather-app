// Import the React library and the useState hook
import React, { useState } from "react";
// Import bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";

// Functional component for the weather app
const WeatherApp = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);

  // Environment variable for the API key
  const apiKey = process.env.REACT_APP_WEATHER_API_KEY;

  // A function to handle changes in the user input field
  const handleInputChange = (e) => {
    setCity(e.target.value);
  };

  // Async function to fetch weather data by city name
  const fetchWeather = async () => {
    setError(null); // Clear previous error data
    setWeather(null); // Clear previous weather data

    if (!city) {
      setError("Please enter a valid city name.");
      return;
    }

    try {
      const response = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`,
      );

      if (!response.ok) {
        throw new Error("City not found. Please try again.");
      }

      const data = await response.json();
      setWeather(data);
    } catch (error) {
      setError(error.message);
    }
  };

  // Function to fetch weather data using geolocation
  const fetchWeatherByGeolocation = async (lat, lon) => {
    try {
      setError(null);
      setWeather(null);

      const response = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${lat},${lon}`,
      );

      if (!response.ok) {
        throw new Error("Request failed. Please try again.");
      }

      const data = await response.json();
      setWeather(data);
    } catch (err) {
      setError(err.message);
    }
  };

  // Function to get geolocation-based weather data
  const getGeolocationWeather = () => {
    if (!navigator.geolocation) {
      setError("Your browser does not support geolocation.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        fetchWeatherByGeolocation(latitude, longitude);
      },
      (err) => {
        setError("Unable to fetch your location. Please try again.");
      },
    );
  };

  return (
    <>
      <div className="container">
        <h1 className="mt-4 text-center">Weather App</h1>
        <p className="mt-4 text-center">
          Enter a city name to get the current weather information.
        </p>
        {/* Button: user input field */}
        <div className="d-flex justify-content-center mt-4">
          <input
            type="text"
            className="form-control w-50"
            placeholder="City name"
            value={city}
            onChange={handleInputChange}
          />
          {/* Button: city weather */}
          <button className="btn btn-primary ms-3" onClick={fetchWeather}>
            Get Weather
          </button>
          {/* Button: geolocation weather */}
          <button
            className="btn btn-secondary ms-3"
            onClick={getGeolocationWeather}
          >
            My Location
          </button>
        </div>

        {/* Display Weather Information or errors */}
        <div className="mt-4 text-center">
          {error && <p className="text-danger">{error}</p>}
          {weather && (
            <>
              <h2>
                {weather.location.name}, {weather.location.country}
              </h2>
              <p>
                <strong>Temperature:</strong> {weather.current.temp_c} °C
              </p>
              <p>
                <strong>Condition:</strong> {weather.current.condition.text}
              </p>
              <img
                src={weather.current.condition.icon}
                alt={weather.current.condition.text}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default WeatherApp;
