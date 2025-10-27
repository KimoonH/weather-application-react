import React from 'react'
import { Button } from "react-bootstrap"

const WeatherButton = ({ cities, setCity, city }) => {
  // 도시 이름의 각 단어 첫 글자를 대문자로 변환
  const capitalizeCity = (cityName) => {
    return cityName
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

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
          {capitalizeCity(item)}
        </Button>
      ))}
    </div>
  )
}

export default WeatherButton