import React from 'react';
import { useEnv } from './envContext';

const WeatherInfo = () => {
  const { weather, selectedTime, setSelectedTime } = useEnv();

  const CATEGORIES_TO_DISPLAY = {
    초단기실황: ["T1H", "RN1", "REH", "PTY"],
    단기예보: ["POP", "PTY", "PCP", "REH", "SNO", "SKY", "TMP", "TMN", "TMX"]
  };

  const getWeatherDescription = (category, value) => {
    const codes = {
      PTY: {
        "0": "없음", "1": "비", "2": "비/눈", "3": "눈", "4": "소나기", "5": "빗방울",
        "6": "빗방울눈날림", "7": "눈날림"
      },
      SKY: {
        "1": "맑음", "3": "구름많음", "4": "흐림"
      }
    };
    return codes[category]?.[value] ?? value;
  };

  const getKoreanLabel = (category) => {
    const labels = {
      T1H: "기온 (℃)",
      TMP: "1시간 기온 (℃)",
      TMX: "일 최고기온 (℃)",
      TMN: "일 최저기온 (℃)",
      RN1: "1시간 강수량 (mm)",
      PCP: "1시간 강수량 (mm)",
      POP: "강수확률 (%)",
      REH: "습도 (%)",
      PTY: "강수 형태",
      SKY: "하늘 상태",
      SNO: "1시간 신적설 (cm)"
    };
    return labels[category] || category;
  };

  const formatTimeLabel = (time) => `${time.slice(0, 2)}시 날씨 정보`;

  const filtered = {};
  weather?.items
    .filter(item => CATEGORIES_TO_DISPLAY[weather.source]?.includes(item.category))
    .forEach(item => {
      if (!filtered[item.category]) {
        filtered[item.category] = item;
      }
    });

  const uniqueItems = Object.values(filtered);

  const timeOptions = Array.from({ length: 24 }, (_, i) =>
    `${i.toString().padStart(2, "0")}00`
  );

  return (
    <div style={{ marginTop: "2rem" }}>
      <label htmlFor="time">날씨 시간 선택: </label>
      <select
        id="time"
        value={selectedTime}
        onChange={(e) => setSelectedTime(e.target.value)}
      >
        {timeOptions.map((t) => (
          <option key={t} value={t}>{t.slice(0, 2)}:00</option>
        ))}
      </select>

      {weather && (
        <div style={{ marginTop: "1rem", padding: "1rem", border: "1px solid #ccc", borderRadius: "8px" }}>
          <h3>{formatTimeLabel(selectedTime)} ({weather.source})</h3>
          {uniqueItems.map((item, idx) => (
            <p key={idx}>
              <strong>{getKoreanLabel(item.category)}</strong>:{" "}
              {getWeatherDescription(item.category, item.obsrValue || item.fcstValue)}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export default WeatherInfo;
