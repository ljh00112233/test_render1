import React, { useState, useEffect } from "react";

function App() {
  const [title, setTitle] = useState("");
  const [keywords, setKeywords] = useState([""]);
  const [diary, setDiary] = useState("");
  const [loading, setLoading] = useState(false);
  const [air, setAir] = useState(null);
  const [weather, setWeather] = useState(null);
  const [selectedTime, setSelectedTime] = useState("0000");
  const [includeWeather, setIncludeWeather] = useState(false);
  const [includeMood, setIncludeMood] = useState(false);
  const [userWeather, setUserWeather] = useState('');
  const [userMood, setUserMood] = useState('');

  const timeOptions = Array.from({ length: 24 }, (_, i) =>
    `${i.toString().padStart(2, "0")}00`
  );

  const fetchDust = async () => {
    const res = await fetch("https://test-render1-u47s.onrender.com/air");
    const data = await res.json();
    console.log("💨 미세먼지:", data);
    setAir(data);
  };

  const fetchWeather = async (time) => {
    const res = await fetch(`https://test-render1-u47s.onrender.com/weather?time=${time}`);
    const data = await res.json();
    console.log("🌦️ 날씨:", data);
    setWeather(data);
  };

  useEffect(() => {
    fetchDust();
    fetchWeather(selectedTime);
  }, []);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleKeywordChange = (index, value) => {
    const newKeywords = [...keywords];
    newKeywords[index] = value;
    setKeywords(newKeywords);
  };

  const addKeywordInput = () => {
    if (keywords.length < 5) {
      setKeywords([...keywords, ""]);
    }
  };

  const generateDiary = async () => {
    setLoading(true);
    let message = `제목은 "${title}"이고, 다음 키워드를 바탕으로 일기를 작성해줘: ${keywords.filter(k => k.trim()).join(", ")}.`;
    if(includeWeather && userWeather.trim()) {
      message += `오늘의 날씨는 ${userWeather}야.`;
    }
    if(includeMood && userMood.trim()) {
      message += `오늘 나의 기분은 ${userMood}야.`
    }
    const diaryContext = "너는 친절한 일기 작성 도우미야. 사용자에게 공감하며 자연스럽고 따뜻한 일기를 대신 써줘.";

    try {
      const response = await fetch("https://test-render1-u47s.onrender.com/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message,
          diary: diaryContext
        })
      });
      if (!response.ok) {
        throw new Error("서버 응답 실패");
      }
  
      const data = await response.json(); // ✅ JSON 변환 필요
      console.log("📦 fetch 응답:", data);
      setDiary(data.reply?.content || "GPT 응답이 없습니다.");
    } catch (error) {
      console.error("🔥 fetch 오류:", error);
      setDiary("❌ 일기 생성 중 오류 발생");
    } finally {
      setLoading(false);
    }
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

  const CATEGORIES_TO_DISPLAY = {
    초단기실황: ["T1H", "RN1", "REH", "PTY"],
    단기예보: ["POP", "PTY", "PCP", "REH", "SNO", "SKY", "TMP", "TMN", "TMX"]
  };

  return (
    <div>
      <h2>키워드를 기반으로 일기 자동 생성</h2>
      <input 
        value={title}
        onChange={handleTitleChange}
        placeholder="제목을 입력하세요"
      />
      <br/>
      <div>
        <label>
          <input
            type="checkbox"
            checked={includeWeather}
            onChange={(e) => setIncludeWeather(e.target.checked)}
          />
          날씨 포함
        </label>
        {includeWeather && (
          <input
            type="text"
            placeholder="예: 맑음, 흐림"
            value={userWeather}
            onChange={(e) => setUserWeather(e.target.value)}
          />
        )}
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            checked={includeMood}
            onChange={(e) => setIncludeMood(e.target.checked)}
          />
          기분 포함
        </label>
        {includeMood && (
          <input
            type="text"
            placeholder="예: 기분이 좋아, 우울해"
            value={userMood}
            onChange={(e) => setUserMood(e.target.value)}
          />
        )}
      </div>
      {keywords.map((keyword, index) => (
        <input
          key={index}
          value={keyword}
          onChange={(e) => handleKeywordChange(index, e.target.value)}
          placeholder={`키워드 ${index + 1}`}
        />
      ))}
      {keywords.length < 5 && <button onClick={addKeywordInput}>키워드 추가</button>}
      <br/>
      <button onClick={generateDiary} disabled={loading}>
        {loading ? "생성 중..." : "일기 자동 생성"}
      </button>
      <div>
        <div style={{ whiteSpace: "pre-wrap", marginTop: "1rem" }}>
          {diary && <h3>생성된 일기</h3>}
          <p>{diary}</p>
        </div>
      </div>
      {/* 시간선택 */}
      <div style={{ marginTop: "2rem" }}>
        <label htmlFor="time">날씨 시간 선택: </label>
        <select
          id="time"
          value={selectedTime}
          onChange={(e) => {
            const newTime = e.target.value;
            setSelectedTime(newTime);
            fetchWeather(newTime);
          }}
        >
          {timeOptions.map((t) => (
            <option key={t} value={t}>{t.slice(0, 2)}:00</option>
          ))}
        </select>
      </div>
      {/* 날씨표시 */}
      {weather && (
        <div style={{ marginTop: "1rem", padding: "1rem", border: "1px solid #ccc", borderRadius: "8px" }}>
          <h3>{formatTimeLabel(selectedTime)} ({weather.source})</h3>
          {(() => {
            const filtered = {};
            weather.items
              .filter(item => CATEGORIES_TO_DISPLAY[weather.source]?.includes(item.category))
              .forEach(item => {
                if (!filtered[item.category]) {
                  filtered[item.category] = item;
                }
              });

            const uniqueItems = Object.values(filtered);

            return uniqueItems.map((item, idx) => (
              <p key={idx}>
                <strong>{getKoreanLabel(item.category)}</strong>:{" "}
                {getWeatherDescription(item.category, item.obsrValue || item.fcstValue)}
              </p>
            ));
          })()}
        </div>
      )}
      {/* 미세먼지 정보 */}
      {air && (
        <div style={{ marginTop: "2rem", padding: "1rem", border: "1px solid #ccc", borderRadius: "8px" }}>
        <h3>오늘의 미세먼지 정보</h3>
        <p>📅 측정 시간: {air.dataTime}</p>
        <p>🌫️ 미세먼지(PM10): {air.pm10.value}㎍/㎥ ({air.pm10.grade})</p>
        <p>🌁 초미세먼지(PM2.5): {air.pm25.value}㎍/㎥ ({air.pm25.grade})</p>
      </div>
      )}
    </div>
  );
}

export default App;
