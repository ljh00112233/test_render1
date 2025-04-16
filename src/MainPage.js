import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button } from 'react-bootstrap'

const MainPage = () => {
    const navigate = useNavigate();

    return (
        <div>
            안녕하세요.<br />
            <Button onClick={() => {navigate('/handdiary')}}>직접일기(Test.js)</Button>
            <Button onClick={() => {navigate('/aidiary')}}>AI일기</Button>
            <Button onClick={() => {navigate('/register')}}>회원가입</Button>
            <Button onClick={() => {navigate('/login')}}>로그인</Button>
            <Button onClick={() => {navigate('/userlist')}}>회원목록</Button>
        </div>
    );
};

export default MainPage;