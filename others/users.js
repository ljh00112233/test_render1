const express = require('express');
const router = express.Router();
const db = require('./index');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authMiddleware = require('./authMiddleware');

// 회원가입
router.post('/register', async (req, res) => {
  const { id, password, nickname, profile } = req.body; //사용자 요청 정보 받음

  try {
    const hashedPassword = await bcrypt.hash(password, 10); //비밀번호 암호화, 10은 Salting Round로 내부적으로 해시 연산을 반복할 횟수(복잡도가 높을수록 보안 ↑, 성능 ↓)
    console.log('요청된 id, password, hashedPassword, nickname, profile 값 : \n', id, password, hashedPassword, nickname, profile);

    const [result] = await db.execute( //db.execute: SQL 쿼리를 실행하는 함수. db.excute는 결과값을 배열([rows, fields])로 반환하므로 [result]로 선언
      'INSERT INTO users (id, password, nickname, profile) VALUES (?, ?, ?, ?)',
      [id, hashedPassword, nickname, profile]
    );
    res.status(201).json({ message: '회원가입 성공', userId: result.insertId }); //응답 데이터를 json 형식으로 반환. 201은 http 상태 코드(201: 요청 성공, 그 결과로 리소스 생성 및 반환)
  } catch (err) {
    console.error('회원가입 에러', err);
    res.status(500).json({ error: '회원가입 실패' });
  }
});

// 회원가입 시 ID 중복 확인
router.get('/check-id', async (req, res) => {
  const { id } = req.query;
  try {
    const [rows] = await db.execute('SELECT id FROM users WHERE id = ?', [id]);
    if (rows.length > 0) {
      res.json({ available: false });
    } else {
      res.json({ available: true });
    }
  } catch (err) {
    console.error('ID 중복 확인 에러:', err);
    res.status(500).json({ error: '서버 에러' });
  }
});

// 닉네임 중복 확인
router.get('/check-nickname', async (req, res) => {
  const { nickname } = req.query;
  try {
    const [rows] = await db.execute('SELECT nickname FROM users WHERE nickname = ?', [nickname]);
    if (rows.length > 0) {
      res.json({ available: false });
    } else {
      res.json({ available: true });
    }
  } catch (err) {
    console.error('닉네임 중복 확인 에러:', err);
    res.status(500).json({ error: '서버 에러' });
  }
});

// 로그인
router.post('/login', async (req, res) => {
  const { id, password } = req.body;

  try {
    // 아이디로 사용자 조회
    const [rows] = await db.execute('SELECT * FROM users WHERE id = ?', [id]);
    const user = rows[0];

    if (!user) {
      return res.status(401).json({ error: '존재하지 않는 ID입니다.' });
    }

    // 비밀번호 비교
    const isMatch = await bcrypt.compare(password, user.password); //password를 암호화하여 user.password와 비교.
    if (!isMatch) {
      return res.status(401).json({ error: '비밀번호가 틀렸습니다.' });
    }

    // JWT 토큰 발급
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' }); //expiresIn: '1h' 인증 유효기간 1시간

    res.json({ message: '로그인 성공', token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '로그인 실패' });
  }
});

// 회원 정보 조회
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM users');
        res.json(rows);
    } catch (err) {
        console.error("DB 조회 중 에러 발생:", err); // 에러 로그 추가
        res.status(500).json({ error: 'DB 조회 실패' });
    }
});

// 로그인한 사용자만 접근 가능한 API
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const [rows] = await db.execute('SELECT id, nickname, profile FROM users WHERE id = ?', [userId]);
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '사용자 정보 조회 실패' });
  }
});

module.exports = router;
