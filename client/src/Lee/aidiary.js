import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import WeatherInfo from "./weatherInfo";
import DustInfo from "./dustInfo";

const aidiary = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [keywords, setKeywords] = useState([""]);
  const [diary, setDiary] = useState("");
  const [loading, setLoading] = useState(false);
  const [includeWeather, setIncludeWeather] = useState(false);
  const [includeMood, setIncludeMood] = useState(false);
  const [userWeather, setUserWeather] = useState('');
  const [userMood, setUserMood] = useState('');

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
    if (includeWeather && userWeather.trim()) {
      message += `오늘의 날씨는 ${userWeather}.`;
    }
    if (includeMood && userMood.trim()) {
      message += `오늘 나의 기분은 ${userMood}.`
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

  return (
    <div>
      <button onClick={() => { navigate('/') }}>홈화면</button>
      <h2>키워드를 기반으로 일기 자동 생성</h2>
      <input
        value={title}
        onChange={handleTitleChange}
        placeholder="제목을 입력하세요"
      />
      <br />
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
      <br />
      <button onClick={generateDiary} disabled={loading}>
        {loading ? "생성 중..." : "일기 자동 생성"}
      </button>
      <div>
        <div style={{ whiteSpace: "pre-wrap", marginTop: "1rem" }}>
          {diary && <h3>생성된 일기</h3>}
          <p>{diary}</p>
        </div>
      </div>
      <WeatherInfo />
      <DustInfo />
    </div>
  );
}

export default aidiary;
