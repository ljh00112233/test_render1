// ResultAidiary.js
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import WeatherInfo from "./WeatherInfo";
import DustInfo from "./DustInfo";

const ResultAiDiary = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { title, diary, weather, mood, date } = location.state || {};

  const [editedDiary, setEditedDiary] = useState(diary);

  return (
    <div>
      <button onClick={() => navigate("/")}>홈으로</button>
      <h2>{title}</h2>
      <p>🗓️ {date}</p>
      {weather && <p>☀️ 날씨: {weather}</p>}
      {mood && <p>😊 기분: {mood}</p>}

      <h3>📝 생성된 일기</h3>
      <textarea
        value={editedDiary}
        onChange={(e) => setEditedDiary(e.target.value)}
        rows={15}
        cols={80}
        style={{ width: "100%" }}
      />

      <WeatherInfo />
      <DustInfo />
    </div>
  );
};

export default ResultAiDiary;
