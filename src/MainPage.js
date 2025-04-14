import React from 'react';
import { useNavigate } from 'react-router-dom';

const MainPage = () => {
    const navigate = useNavigate();

    return (
        <div>
            안녕하세요.<br />
            <button onClick={() => {navigate('/handdiary')}}>직접일기(Test.js)</button>
            <button onClick={() => {navigate('/aidiary')}}>AI일기</button>
            <button onClick={() => {navigate('/register')}}>회원가입</button>
            <button onClick={() => {navigate('/login')}}>로그인</button>
            <button onClick={() => {navigate('/userlist')}}>회원목록</button>
        </div>
    );
};

export default MainPage;