import React, { useState } from "react";
import WeatherInfo from "./weatherInfo";
import DustInfo from "./dustInfo";

const handdiary = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [includeWeather, setIncludeWeather] = useState(false);
  const [includeMood, setIncludeMood] = useState(false);
  const [weather, setWeather] = useState('');
  const [mood, setMood] = useState('');
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerateComment = async () => {
    setLoading(true);

    let message = `다음은 사용자가 작성한 일기야. 공감해주고 따뜻한 코멘트를 남겨줘.\n\n제목: ${title}\n\n내용: ${content}`;
    if (includeWeather && weather.trim()) {
      message += `\n오늘의 날씨는 ${weather}야.`;
    }
    if (includeMood && mood.trim()) {
      message += `\n오늘 사용자의 기분은 ${mood}야.`;
    }

    try {
      const res = await fetch("https://test-render1-u47s.onrender.com/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message,
          diary: "너는 다정하고 따뜻한 코멘트를 남겨주는 일기 친구야. 일기를 쓴 사람에게 응원이나 위로가 담긴 말을 해줘."
        })
      });

      if (!res.ok) throw new Error("GPT API 호출 실패");

      const data = await res.json();
      setComment(data.reply?.content || "코멘트 응답 없음");
    } catch (error) {
      console.error("🔥 오류:", error);
      setComment("❌ GPT 응답 중 오류가 발생했어요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>✍️ 직접 일기 쓰기</h2>

      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="제목을 입력하세요"
        style={{ width: '100%', marginBottom: '1rem' }}
      />

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="오늘의 일기를 작성하세요"
        rows={10}
        style={{ width: '100%', marginBottom: '1rem' }}
      />

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
            value={weather}
            onChange={(e) => setWeather(e.target.value)}
            placeholder="예: 맑음, 흐림"
            style={{ marginLeft: '1rem' }}
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
          감정 포함
        </label>
        {includeMood && (
          <input
            type="text"
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            placeholder="예: 기분이 좋아, 우울해"
            style={{ marginLeft: '1rem' }}
          />
        )}
      </div>

      <button onClick={handleGenerateComment} disabled={loading} style={{ marginTop: '1rem' }}>
        {loading ? "GPT 응답 중..." : "GPT 코멘트 받기"}
      </button>

      {comment && (
        <div style={{ marginTop: '2rem', padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
          <h3>GPT의 코멘트 💬</h3>
          <p style={{ whiteSpace: 'pre-wrap' }}>{comment}</p>
        </div>
      )}
      <WeatherInfo />
      <DustInfo />
    </div>
  );
};

export default handdiary;