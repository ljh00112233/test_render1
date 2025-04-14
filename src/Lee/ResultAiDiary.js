// ResultAidiary.js
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import WeatherInfo from "./WeatherInfo";
import DustInfo from "./DustInfo";

const ResultAiDiary = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { title, diary, weather, mood, date } = location.state || {};

  return (
    <div>
      <button onClick={() => navigate("/")}>홈으로</button>
      <h2>{title}</h2>
      <p>🗓️ {date}</p>
      {weather && <p>☀️ 날씨: {weather}</p>}
      {mood && <p>😊 기분: {mood}</p>}

      <h3>📝 최종 일기</h3>
      <div style={{ whiteSpace: "pre-wrap", border: "1px solid #ccc", padding: "1rem", borderRadius: "8px" }}>
        {diary}
      </div>

      <WeatherInfo />
      <DustInfo />
    </div>
  );
};

export default ResultAiDiary;
