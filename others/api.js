// others/api.js
const express = require("express");
const fetch = require("node-fetch");
const OpenAI = require("openai");

const router = express.Router();

// OpenAI 설정
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 미세먼지 등급 변환 함수
const gradeText = (grade) => {
  const map = {
    "1": "좋음",
    "2": "보통",
    "3": "나쁨",
    "4": "매우 나쁨",
  };
  return map[grade] || "정보없음";
};

// 어제 날짜 구하기
const getYesterday = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10).replace(/-/g, "");
};

// ✅ GPT 코멘트 API
router.post("/chat", async (req, res) => {
  try {
    const { message, diary } = req.body;
    console.log("📦 req.body:", req.body);

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      store: true,
      messages: [
        { role: "system", content: diary },
        { role: "user", content: message },
      ],
    });

    if (!completion || !completion.choices || completion.choices.length === 0) {
      console.error("⚠️ GPT 응답이 비어 있음:", completion);
      return res.status(500).json({ error: "GPT 응답이 없습니다." });
    }

    const reply = completion.choices[0].message;
    res.status(200).json({ reply });
  } catch (error) {
    res.status(400).json({ error: "api request fail", stack: error.stack, name: error.name });
  }
});

// ✅ 미세먼지 API
router.get("/air", async (req, res) => {
  const url = `http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getCtprvnRltmMesureDnsty?serviceKey=${process.env.AIRKOREA_API_KEY}&returnType=json&numOfRows=2&pageNo=1&sidoName=서울&ver=1.0`;
  console.log('미세먼지 API process.env.AIRKOREA_API_KEY 값 : ', process.env.AIRKOREA_API_KEY);
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    const item = data.response.body.items[0];
    console.log("📦 응답 상태 코드:", response.status);
    console.log("📦 응답 콘텐츠 타입:", contentType);
    const result = {
      dataTime: item.dataTime,
      pm10: {
        value: item.pm10Value,
        grade: gradeText(item.pm10Grade),
      },
      pm25: {
        value: item.pm25Value,
        grade: gradeText(item.pm25Grade),
      },
    };
    res.status(200).json(result);
  } catch (error) {
    console.error("❌ 미세먼지 데이터 불러오기 실패:", error.message);
    res.status(500).json({ error: "미세먼지 데이터를 불러오지 못했습니다." });
  }
});

// ✅ 날씨 API
router.get("/weather", async (req, res) => {
  const { time } = req.query;
  const now = new Date();
  const currentTimeStr = now.getHours().toString().padStart(2, "0") + now.getMinutes().toString().padStart(2, "0");
  const selectedHourStr = time.slice(0, 2);
  let baseDate = now.toISOString().slice(0, 10).replace(/-/g, "");

  try {
    let result = {};
    let useForecastInstead = false;

    if (selectedHourStr < now.getHours().toString().padStart(2, "0")) {
      const ncstTime = time;
      let ncstUrl = `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst?serviceKey=${process.env.WEATHER_API_KEY}&pageNo=1&numOfRows=1000&dataType=JSON&base_date=${baseDate}&base_time=${ncstTime}&nx=60&ny=127`;
      let ncstRes = await fetch(ncstUrl);
      let ncstData = await ncstRes.json();
      const items = ncstData.response.body.items.item;
      console.log('날씨 API WEATHER_API_KEY 값 : ', process.env.WEATHER_API_KEY);

      if (items && items.length > 0) {
        result = {
          source: "초단기실황",
          items,
        };
      } else {
        useForecastInstead = true;
      }
    } else {
      useForecastInstead = true;
    }

    if (useForecastInstead) {
      const baseTimes = ["0200", "0500", "0800", "1100", "1400", "1700", "2000", "2300"];
      let baseTime = baseTimes.slice().reverse().find(t => currentTimeStr >= t);

      if (now.getHours() < 2 && time < "0200") {
        baseDate = getYesterday();
        baseTime = "2300";
      }

      const vilageUrl = `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?serviceKey=${process.env.WEATHER_API_KEY}&pageNo=1&numOfRows=1000&dataType=JSON&base_date=${baseDate}&base_time=${baseTime}&nx=60&ny=127`;
      const vilageRes = await fetch(vilageUrl);
      const vilageData = await vilageRes.json();

      result = {
        source: "단기예보",
        items: vilageData.response.body.items.item.filter(i => i.fcstTime === time),
      };
    }

    console.log(time, baseDate, currentTimeStr);
    res.status(200).json(result);
  } catch (error) {
    console.error("❌ 날씨 데이터 불러오기 실패:", error.message);
    res.status(500).json({ error: "날씨 데이터를 불러오지 못했습니다." });
  }
});

module.exports = router;
