import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try { //서버에서 로그인 정보 비교(user.js의 login)
      // const res = await axios.post('http://localhost:5000/users/login', {
      const res = await axios.post('https://aidiary.onrender.com/users/login', {
        id,
        password,
      });

      // 로그인 성공 시
      const { token } = res.data;
      localStorage.setItem('token', token);
      alert('로그인 성공!');
      navigate('/test');
    } catch (err) {
      console.error('로그인 에러:', err);
      if (err.response && err.response.data && err.response.data.error) {
        alert(err.response.data.error);
      } else {
        alert('서버 오류로 로그인 실패');
      }
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>로그인</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>아이디:</label>
          <input
            type="text"
            value={id}
            onChange={(e) => setId(e.target.value)}
            required
          />
        </div>
        <div>
          <label>비밀번호:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">로그인</button>
      </form>
    </div>
  );
};

export default Login;
