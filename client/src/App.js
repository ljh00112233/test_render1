import React, { useState } from "react";

function App() {
  const [keywords, setKeywords] = useState([""]);
  const [diary, setDiary] = useState("");
  const [loading, setLoading] = useState(false);

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
    const message = `다음 키워드를 바탕으로 일기를 작성해줘: ${keywords.filter(k => k.trim()).join(", ")}`;
    const diaryContext = "너는 친절한 일기 작성 도우미야. 사용자에게 공감하며 자연스럽고 따뜻한 일기를 대신 써줘.";

    try {
      const response = await fetch("http://localhost:5001/chat", {
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
      <h2>키워드를 기반으로 일기 자동 생성</h2>
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
    </div>
  );
}

export default App;
