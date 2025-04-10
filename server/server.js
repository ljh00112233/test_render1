const OpenAI = require("openai");
const express = require("express");
require("dotenv").config();
const cors = require("cors");
const fetch = require("node-fetch");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const app = express();
app.use(cors());
app.use(express.json())
app.post("/chat", async(req,res) => {
  try{
    console.log("📦 req.body:", req.body);
    const{message, diary} = req.body;
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      store: true,
      messages: [
        { role : "system", content : diary },
        { role : "user", content: message },
      ],
    });
    
    if (!completion || !completion.choices || completion.choices.length === 0) {
      console.error("⚠️ GPT 응답이 비어 있음:", completion);
      return res.status(500).json({ error: "GPT 응답이 없습니다." });
    }

    console.log(completion.choices[0].message);
    const reply = completion.choices[0].message;
    res.status(200).json({reply});
  }catch(error){
    res.status(400).json({ error : "api request fail", stack: error.stack, name: error.name });
  }
});

app.get("/air", async (req, res) => {
  const airkorea = process.env.AIRKOREA_API_KEY
  const url = `http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getCtprvnRltmMesureDnsty?serviceKey=${airkorea}&returnType=json&numOfRows=2&pageNo=1&sidoName=서울&ver=1.0`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    const item = data.response.body.items[0];

    const result = {
      dataTime : item.dataTime,
      pm10 : {
        value : item.pm10Value,
        grade : gradeText(item.pm10Grade),
      },
      pm25 : {
        value : item.pm25Value,
        grade : gradeText(item.pm25Grade),
      },
    };
    res.status(200).json(result);
  } catch (error) {
    console.error("❌ 미세먼지 데이터 불러오기 실패:", error.message);
  }
});

const gradeText = (grade) => {
  const map = {
    "1" : "좋음",
    "2" : "보통",
    "3" : "나쁨",
    "4" : "매우 나쁨",
  };
  return map[grade] || "정보없음";
};

app.listen(5001,() => {
  console.log("server is running on 5001");
});