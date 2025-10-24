import React from 'react'

const WeatherBox = ({ weather }) => {
  return (
      <div className="weather-box">
      <div>{weather?.name}</div>
      <h2>{weather?.main.temp}°C /  {(weather?.main.temp * 9/5 + 32).toFixed(1)}°F</h2>
      <h2>{weather?.weather[0].description}</h2>
    </div>
  )
}

export default WeatherBox