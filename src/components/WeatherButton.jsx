import React from 'react'
import { Button } from "react-bootstrap"

const WeatherButton = ({ cities, setCity, city }) => {
  return (
    <div className="weather-button-container">
      <Button
        variant={city === '' ? "warning" : "outline-warning"}
        onClick={() => setCity('')}>
        Current Location
      </Button>
      {cities.map((item, index) => (
        <Button
          variant={city === item ? "warning" : "outline-warning"}
          key={index}
          onClick={() => setCity(item)}>
          {item}
        </Button>
      ))}
    </div>
  )
}

export default WeatherButton