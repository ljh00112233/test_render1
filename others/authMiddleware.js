const jwt = require('jsonwebtoken'); //jwt(json web token) 생성 및 검증, jwt.sign(payload, secret) : 토큰 생성, jwt.verfy(token, secret) : 토큰 검증, jwt.decode(token) : 서명검사 없이 토큰 내용만 확인

function authMiddleware(req, res, next) { //req:사용자 요청, res: 서버 응답, enxt: 다음 미들웨어로 넘김(비호출시 요청이 다음 단계로 넘어가지 않음)
  const authHeader = req.headers['authorization']; // authhorization: 'Bearer <Token>'에서, spliy을 통해 Bearer부분을 제외하고 Token 부분만 남김
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: '토큰이 없습니다.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => { //토큰 복호화 및 검증, 유효효 토큰인 경우 decoded에 값 담김, 비유효 토큰인 경우 err에 값 담김
    if (err) {
      return res.status(403).json({ error: '토큰이 유효하지 않습니다.' });
    }

    req.user = decoded; // 예: { id: 'aaa', iat: ..., exp: ... }
    next();
  });
}

module.exports = authMiddleware;
