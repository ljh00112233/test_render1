import { useState } from "react";

function App() {
  const [message, setMessage] = useState("");

  const handleClick = async () => {
    const res = await fetch("https://test-render-p497.onrender.com");
    const text = await res.text();
    setMessage(text);
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