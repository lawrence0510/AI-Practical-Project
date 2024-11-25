import React, { useState, useEffect } from "react";
import Step from "./components/step";
import { useLocation, useNavigate } from "react-router-dom";

function App23() {
  const navigate = useNavigate();
  const location = useLocation();
  const { videoData, language } = location.state;

  const [subtitleText, setSubtitleText] = useState(""); // 儲存下載的字幕文字
  const [translatedText, setTranslatedText] = useState(""); // 儲存翻譯後的完整 JSON
  const [tobetranslated, setTobetranslated] = useState("a"); // 用 useState 儲存翻譯後的文本

  const [step, setStep] = useState(1); // 控制目前步驟

  // 步驟 1：下載字幕和音訊
  const downloadAudioAndSubtitles = async () => {
    try {
      const response = await fetch("http://localhost:5003/youtube/download_youtube_audio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: videoData.url }),
      });
      const data = await response.json();

      if (data.subtitles && data.subtitles.length > 0) {
        const subtitleResponse = await fetch(data.subtitles[0].url);
        const subtitleText = await subtitleResponse.text();

        if (subtitleText) {
          setSubtitleText(subtitleText);
          console.log("下載的字幕內容：", subtitleText);
          location.state.videoData = { ...videoData, subtitleText };
          setStep(2); // 完成步驟 1，進入步驟 2
        } else {
          console.log("字幕內容為空！");
        }
      } else {
        console.log("無法下載字幕！");
      }
    } catch (error) {
      console.error("下載字幕和音訊失敗：", error);
    }
  };

  // 步驟 2：翻譯字幕
  const translateSubtitles = async () => {
    try {
      const subtitleJson = JSON.parse(subtitleText);

      const originalTexts = subtitleJson.events
        .filter(event => event.segs && event.segs.length > 0)
        .map(event => event.segs.map(seg => seg.utf8).join(" "));

      console.log("originalTexts", originalTexts);

      const response = await fetch("http://localhost:5003/text_audio/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: originalTexts.join("\n"), target_language: language }),
      });
      const data = await response.json();

      const translatedTexts = data.translated_text.split("\n");

      console.log("translatedTexts", translatedTexts);

      setTobetranslated(translatedTexts); // 更新翻譯後的文本狀態

      let translatedIndex = 0;
      subtitleJson.events.forEach(event => {
        if (event.segs && event.segs.length > 0) {
          event.segs.forEach(seg => {
            if (seg.utf8) {
              seg.utf8 = translatedTexts[translatedIndex] || seg.utf8;
              translatedIndex++;
            }
          });
        }
      });

      const translatedJson = JSON.stringify(subtitleJson, null, 2);
      setTranslatedText(translatedJson); // 儲存完整翻譯後的 JSON
      setStep(3); // 完成步驟 2，進入步驟 3
    } catch (error) {
      console.error("翻譯字幕失敗：", error);
    }
  };

  // 步驟 3：生成語音
  const generateAudio = async () => {
    try {
      if (!tobetranslated || tobetranslated.length === 0) {
        console.error("無法生成音檔，因為翻譯結果為空！");
        return;
      }

      const response = await fetch("http://localhost:5003/text_audio/text_to_speech", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: tobetranslated.join("\n"), lang: language }), // 使用狀態變數 tobetranslated
      });
      const data = await response.json();

      if (data.audio_path) {
        console.log("生成音檔成功！");
        setStep(4); // 完成步驟 3，進入步驟 4
      } else {
        console.log("生成語音失敗！");
      }
    } catch (error) {
      console.error("生成語音失敗：", error);
    }
  };

  // 步驟 4：整理大綱
  const summarizeOutline = async () => {
    try {
      if (!tobetranslated || tobetranslated.length === 0) {
        console.error("無法整理大綱，因為翻譯結果為空！");
        return;
      }
  
      const response = await fetch("http://localhost:5003/openai/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: tobetranslated.join("\n") }), // 傳遞文本作為請求內容
      });
  
      const data = await response.json();
      
      console.log(data)

      localStorage.setItem("app3State", JSON.stringify({ summary: data, videoData }));
      navigate("/app3", { state: { summary: data, videoData } });
    } catch (error) {
      console.error("整理大綱失敗：", error);
    }
  };  

  useEffect(() => {
    if (step === 1) {
      downloadAudioAndSubtitles();
    } else if (step === 2) {
      translateSubtitles();
    } else if (step === 3) {
      generateAudio();
    } else if (step === 4) {
      summarizeOutline();
    }
  }, [step]);

  return (
    <div className="App23">
      <Step />
      <div className="Wait">請稍後，請勿操作...</div>
      <div className="ing">
        <div className="text">
          <div>➤ 步驟 1：下載字幕 {step > 1 && "✔"}</div>
          <div>➤ 步驟 2：翻譯字幕 {step > 2 && "✔"}</div>
          <div>➤ 步驟 3：生成語音 {step > 3 && "✔"}</div>
          <div>➤ 步驟 4：整理大綱 {step > 4 && "✔"}</div>
        </div>
      </div>
    </div>
  );
}

export default App23;
