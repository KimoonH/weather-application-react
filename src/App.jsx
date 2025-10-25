import { useEffect, useCallback, useState } from "react";
import './App.css'
import WeatherBox from "./components/WeatherBox";
import 'bootstrap/dist/css/bootstrap.min.css';
import WeatherButton from "./components/WeatherButton";
import { ClipLoader } from "react-spinners";

// 1. 앱이 실행되자마자 현재 위치 기반의 날씨가 보인다.
// 2. 현날씨정보에는 도시, 섭씨 화씨, 날씨 상태 정보가 들어온다.
// 3. 5개의 버튼이 있다.(1개는 현재위치, 4개는 다른 도시)
// 4. 도시 버튼을 클릭할 때 마다 도시별 날씨가 나온다.
// 5. 현재 위치 버튼을 누르면 다시 현재위치 기반의 날씨가 나온다.
// 6. 데이터를 들고오는 동안 로딩 시피너가 돈다.
function App() {

  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const cities = ['paris', 'new york', 'tokyo', 'seoul']
  
  const getWeatherByCurrentLocation = useCallback(async (lat, lon) => {
    setLoading(true);
    setError(null);
    try {
      let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=726d97ec75de043571f7cdbe861a3956&units=metric`;
      let response = await fetch(url);
      let data = await response.json();
      setWeather(data);
    } catch (err) {
      setError('현재 위치의 날씨 정보를 가져올 수 없습니다.');
    } finally {
      setLoading(false);
    }
  }, []);

  const getWeatherByCity = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=726d97ec75de043571f7cdbe861a3956&units=metric`;
      let response = await fetch(url);
      let data = await response.json();
      setWeather(data);
    } catch (err) {
      setError(`${city}의 날씨 정보를 가져올 수 없습니다.`);
    } finally {
      setLoading(false);
    }
  }, [city]);

  const getCurrentLocation = useCallback(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      let lat = position.coords.latitude
      let lon = position.coords.longitude
      getWeatherByCurrentLocation(lat, lon);
    });
  }, [getWeatherByCurrentLocation]);

  useEffect(() => {
    if (city === '') {
      getCurrentLocation();
    } else {
      getWeatherByCity();
    }
  }, [city, getCurrentLocation, getWeatherByCity]);
  
  return (
    <div>
      {loading ? (
        <ClipLoader
          color="#c27862"
          loading={loading}
          size={100}
        />
      ) : error ? (
        <>
          <div className="error-message">{error}</div>
          <WeatherButton cities={cities} setCity={setCity} city={city} />
        </>
      ) : (
        <>
          <WeatherBox weather={weather} />
          <WeatherButton cities={cities} setCity={setCity} city={city} />
        </>
      )}
    </div>
  )
}

export default App
