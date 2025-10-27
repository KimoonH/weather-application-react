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

      // OpenWeatherMap API는 에러 시 cod 필드에 에러 코드를 반환합니다
      if (data.cod && data.cod !== 200) {
        throw new Error(data.message || '날씨 정보를 가져올 수 없습니다.');
      }

      // HTTP 상태 코드 체크
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      setWeather(data);
    } catch (err) {
      if (err.message.includes('401')) {
        setError('API 키가 유효하지 않습니다.');
      } else if (err.message.includes('404')) {
        setError('해당 위치의 날씨 정보를 찾을 수 없습니다.');
      } else if (err.message.includes('Failed to fetch')) {
        setError('네트워크 연결을 확인해주세요.');
      } else {
        setError(err.message || '현재 위치의 날씨 정보를 가져올 수 없습니다.');
      }
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

      // OpenWeatherMap API는 에러 시 cod 필드에 에러 코드를 반환합니다
      if (data.cod && data.cod !== 200) {
        throw new Error(data.message || '날씨 정보를 가져올 수 없습니다.');
      }

      // HTTP 상태 코드 체크
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      setWeather(data);
    } catch (err) {
      if (err.message.includes('401')) {
        setError('API 키가 유효하지 않습니다.');
      } else if (err.message.includes('404') || err.message.includes('city not found')) {
        setError(`'${city}' 도시를 찾을 수 없습니다. 영어로 정확한 도시명을 입력해주세요.`);
      } else if (err.message.includes('Failed to fetch')) {
        setError('네트워크 연결을 확인해주세요.');
      } else {
        setError(err.message || `${city}의 날씨 정보를 가져올 수 없습니다.`);
      }
    } finally {
      setLoading(false);
    }
  }, [city]);

  const getCurrentLocation = useCallback(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        let lat = position.coords.latitude
        let lon = position.coords.longitude
        getWeatherByCurrentLocation(lat, lon);
      },
      (error) => {
        setLoading(false);
        setError('위치 정보 접근이 거부되었습니다. 위치 권한을 허용하거나 도시를 선택해주세요.');
      }
    );
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
        <div className="loading-container">
          <ClipLoader
            color="#c27862"
            loading={loading}
            size={100}
          />
        </div>
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
