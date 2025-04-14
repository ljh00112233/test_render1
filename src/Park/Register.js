import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
  const [id, setId] = useState('');
  const [isIdChecked, setIsIdChecked] = useState(false);
  const [idError, setIdError] = useState('');

  const [nickname, setNickname] = useState('');
  const [isNicknameChecked, setIsNicknameChecked] = useState(false);
  const [nicknameError, setNicknameError] = useState('');

  const [password, setPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [profile, setProfile] = useState(1);

  

  const checkIdDuplicate = async () => { //https://aidiary.onrender.com
    try {
      // const res = await axios.get(`http://localhost:5000/users/check-id?id=${id}`);
      const res = await axios.get(`https://aidiary.onrender.com/users/check-id?id=${id}`);
      if (res.data.available) {
        alert('사용 가능한 아이디입니다.');
        setIsIdChecked(true);
      } else {
        alert('이미 사용 중인 아이디입니다.');
        setIsIdChecked(false);
      }
    } catch (err) {
      console.error(err);
      alert('아이디 중복 확인 중 오류가 발생했습니다.');
    }
  };

  const checkNicknameDuplicate = async () => {
    try {
      // const res = await axios.get(`http://localhost:5000/users/check-nickname?nickname=${nickname}`);
      const res = await axios.get(`https://aidiary.onrender.com/users/check-nickname?nickname=${nickname}`);
      if (res.data.available) {
        alert('사용 가능한 닉네임입니다.');
        setIsNicknameChecked(true);
      } else {
        alert('이미 사용 중인 닉네임입니다.');
        setIsNicknameChecked(false);
      }
    } catch (err) {
      console.error(err);
      alert('닉네임 중복 확인 중 오류가 발생했습니다.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isIdChecked) {
      alert('아이디 중복 확인을 먼저 해주세요.');
      return;
    };

    if (!isNicknameChecked) {
      alert('닉네임 중복 확인을 먼저 해주세요.');
      return;
    };

    if (password !== passwordCheck) {
      alert('비밀번호가 일치하지 않습니다.\n비밀번호를 확인해주세요.');
      return;
    };

    try {
      // await axios.post('http://localhost:5000/users/register', {
        await axios.post('https://aidiary.onrender.com/users/register', {
        id,
        password,
        nickname,
        profile,
      });
      alert('회원가입 성공!');
      // 초기화
      setId('');
      setPassword('');
      setPasswordCheck('');
      setNickname('');
      setProfile(1);
      setIsIdChecked(false);
      setIsNicknameChecked(false);
    } catch (err) {
      console.error(err);
      alert('회원가입 실패!');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>회원가입</h2>
      <p>입력된 비밀번호 : {password}</p>
      <input //아이디 입력란
        type="text"
        placeholder="아이디"
        value={id}
        // onChange={(e) => {
        //   setId(e.target.value);
        //   setIsIdChecked(false); // 값 변경 시 중복확인 다시 필요
        // }}
        onChange={(e) => {
          const value = e.target.value;
          const regex = /^[A-Za-z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/; //정규식
          if (regex.test(value)) { //regex.test(문자열) : regex라는 정규식 패턴에 맞는 문자열인지 test()가 검사. 참인 경우 true, 거짓인 경우 fasle 반환
            setId(value);
            setIsIdChecked(false);
            setIdError(' ');
          } else {
            setIdError('id는 영어, 일부 특수문자만 사용 가능합니다.');
          }
        }}
      />
      <button type="button" onClick={checkIdDuplicate} disabled={id.length < 1 ? 'disable' : ''}>아이디 중복확인</button>
      <br />
      <p style={{margin:0, color:'red', fontSize:'0.7rem'}}>{idError}<br/></p>

      <input //비밀번호 입력란
        type={showPassword ? "text" : "password"}
        placeholder="비밀번호"
        value={password}
        // onChange={(e) => setPassword(e.target.value)}
        onChange={(e) => {
          const value = e.target.value;
          const regex = /^[A-Za-z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/; //정규식
          if (regex.test(value)) { //regex.test(문자열) : regex라는 정규식 패턴에 맞는 문자열인지 test()가 검사. 참인 경우 true, 거짓인 경우 fasle 반환
            setPassword(value);
            setPasswordError('');
          } else {
            setPasswordError('비밀번호는 영어, 숫자, 일부 특수문자만 사용 가능합니다.');
          }
        }}
      />
      <button
        type="button"
        onClick={() => setShowPassword((prev) => !prev)}
      >{showPassword ? "숨기기" : "보기"}</button>
      <br />
      <p style={{margin:0, color:'red', fontSize:'0.7rem'}}>{passwordError}<br/></p>

      <input //비밀번호 확인란
        type="password"
        placeholder="비밀번호 확인"
        value={passwordCheck}
        onChange={(e) => setPasswordCheck(e.target.value)}
      /><br /><br />

      <input //닉네임 입력란
        type="text"
        placeholder="닉네임"
        value={nickname}
        // onChange={(e) => {
        //   setNickname(e.target.value);
        //   setIsNicknameChecked(false); // 값 변경 시 중복확인 다시 필요
        // }}
        onChange={(e) => {
          const value = e.target.value;
          const specialCharRegex  = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
          if (!specialCharRegex.test(value) || value=='') {
            setNickname(value);
            setIsNicknameChecked(false);
            setNicknameError('');
          } else {
            setNicknameError('닉네임은 한글, 영어, 숫자만 사용 가능합니다.');
          }
        }}
      />
      <button type="button" onClick={checkNicknameDuplicate} disabled={nickname.length < 1 ? 'disable' : ''}>닉네임 중복확인</button>
      <br />
      <p style={{margin:0, color:'red', fontSize:'0.7rem'}}>{nicknameError}<br/></p>

      <button type="submit">가입하기</button>
    </form>
  );
};

export default Register;
