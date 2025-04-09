const OpenAI = require("openai");
const express = require("express");
require("dotenv").config();
const cors = require("cors");

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

app.listen(5001,() => {
  console.log("server is running on 5001");
});