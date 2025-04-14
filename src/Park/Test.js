import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Test = () => {
  const [user, setUser] = useState(null); // 사용자 정보 저장
  const [loading, setLoading] = useState(true); // 로딩 상태
  const navigate = useNavigate();

  const getUserInfo = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('로그인되지 않음');
      }

      // const res = await axios.get('http://localhost:5000/users/me', {
      const res = await axios.get('https://aidiary.onrender.com/users/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(res.data);
    } catch (err) {
      console.error('사용자 정보 요청 실패:', err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    alert('로그아웃되었습니다.');
    navigate('/login');
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  if (loading) return <p>로딩 중...</p>;

  return (
    <div style={{ padding: 20 }}>
      {user ? (
        <>
          <h2>로그인 상태입니다!</h2>
          <p>아이디: {user.id}</p>
          <p>닉네임: {user.nickname}</p>
          <button onClick={handleLogout}>로그아웃</button>
        </>
      ) : (
        <>
          <h2>로그인되지 않았습니다.</h2>
          <button onClick={() => navigate('/login')}>로그인하러 가기</button>
        </>
      )}
    </div>
  );
};

export default Test;
