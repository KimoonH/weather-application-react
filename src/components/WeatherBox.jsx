import React from 'react'

const WeatherBox = ({ weather }) => {
  if (!weather || !weather.main) {
    return null;
  }

  const tempCelsius = weather.main.temp;
  const tempFahrenheit = (tempCelsius * 9/5 + 32).toFixed(1);

  return (
      <div className="weather-box">
      <div>{weather.name}</div>
      <h2>{tempCelsius}°C / {tempFahrenheit}°F</h2>
      <h2>{weather.weather[0].description}</h2>
    </div>
  )
}

export default WeatherBox