import { useState } from "react";

function App() {
  const [message, setMessage] = useState("");

  const handleClick = async () => {
    try {
      const res = await fetch("https://test-render1-7ia3.onrender.com");
  
      if (!res.ok) {
        throw new Error(`서버 응답 에러: ${res.status}`);
      }
  
      const text = await res.text();
      console.log("응답 결과:", text);
      setMessage(text);
    } catch (error) {
      console.error("요청 중 에러 발생:", error);
      setMessage("서버 오류가 발생했습니다.");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>서버에서 메시지 받아오기</h1>
      <button onClick={handleClick}>불러오기</button>
      <p>{message}</p>
    </div>
  );
}

export default App;