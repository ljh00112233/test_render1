import { useState } from "react";

function App() {
  const [message, setMessage] = useState("");

  const handleClick = async () => {
    try {
      const res = await fetch("https://test-render1-u47s.onrender.com");
      const text = await res.text();
      setMessage(text);
    } catch (err) {
      console.error("에러 발생:", err);
      setMessage("서버 응답 실패");
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