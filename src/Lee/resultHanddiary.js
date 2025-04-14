import React from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import WeatherInfo from "./weatherInfo";
import DustInfo from "./dustInfo";

const resultHanddiary = () => {
    const navigate = useNavigate();
    const { state } = useLocation();

    if (!state) {
        return <p>잘못된 접근입니다.</p>;
    }

    const { title, content, weather, mood, comment, date } = state;

    return (
        <div>
            <button onClick={() => navigate("/")}>홈으로</button>
            <h2>📘 작성한 일기</h2>
            <p><strong>제목:</strong> {title}</p>
            <p><strong>날짜:</strong> {date}</p>
            {weather && <p><strong>날씨:</strong> {weather}</p>}
            {mood && <p><strong>기분:</strong> {mood}</p>}
            <p><strong>내용:</strong></p>
            <pre style={{ whiteSpace: 'pre-wrap' }}>{content}</pre>

            <div style={{ marginTop: '2rem', padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
                <h3>GPT의 코멘트 💬</h3>
                <p style={{ whiteSpace: 'pre-wrap' }}>{comment}</p>
            </div>
            <WeatherInfo />
            <DustInfo />
        </div>
    );
};

export default resultHanddiary;