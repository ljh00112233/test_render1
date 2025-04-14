import React, { createContext, useState, useEffect, useContext } from 'react';
import { fetchDust, fetchWeather } from './api';

const EnvContext = createContext();

export const EnvProvider = ({ children }) => {
  const [air, setAir] = useState(null);
  const [weather, setWeather] = useState(null);
  const [selectedTime, setSelectedTime] = useState('0000');

  // 날씨/미세먼지 데이터 요청
  const loadData = async () => {
    try {
      const dustData = await fetchDust();
      const weatherData = await fetchWeather(selectedTime);
      setAir(dustData);
      setWeather(weatherData);
    } catch (error) {
      console.error("환경 데이터 로딩 실패:", error);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedTime]);

  const refetch = () => {
    loadData();
  };

  return (
    <EnvContext.Provider value={{ air, weather, selectedTime, setSelectedTime, refetch }}>
      {children}
    </EnvContext.Provider>
  );
};

export const useEnv = () => useContext(EnvContext);