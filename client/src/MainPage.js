import React from 'react';
import { useNavigate } from 'react-router-dom';

const MainPage = () => {
    const navigate = useNavigate();

    return (
        <div>
            안녕하세요.
            <button onClick={() => {navigate('/handdiary')}}>직접일기</button>
            <button onClick={() => {navigate('/aidiary')}}>AI일기</button>
        </div>
    );
};

export default MainPage;