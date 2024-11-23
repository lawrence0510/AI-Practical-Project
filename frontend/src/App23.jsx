import React, { useState, useEffect } from "react";
import Step from "./components/step";
import Progressbar from "./components/Progressbar";
import { useLocation, useNavigate } from "react-router-dom";

function App23() {
  const [check1Visible, setCheck1Visible] = useState(false);
  const [check2Visible, setCheck2Visible] = useState(false);
  const [check3Visible, setCheck3Visible] = useState(false);
  const [check4Visible, setCheck4Visible] = useState(false);

  const [startSecondProgress, setStartSecondProgress] = useState(false);
  const [startThirdProgress, setStartThirdProgress] = useState(false);
  const [startFourthProgress, setStartFourthProgress] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { videoData } = location.state;
  console.log("videoData at App23: ", videoData)

  const [subtitleText, setSubtitleText] = useState(""); // 儲存下載的字幕文字
  const [translatedText, setTranslatedText] = useState(""); // 儲存翻譯後的文字

  // 步驟 1：下載字幕和音訊
  const downloadAudioAndSubtitles = async () => {
    try {
      const response = await fetch("http://localhost:5003/youtube/download_youtube_audio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: videoData.url
      });
      const data = await response.json();

      if (data.subtitles && data.subtitles.length > 0) {
        const subtitleResponse = await fetch(data.subtitles[0].url);
        const subtitleText = await subtitleResponse.text();
        setSubtitleText(subtitleText);
        setCheck1Visible(true);
        setStartSecondProgress(true);
      } else {
        alert("無法下載字幕！");
      }
    } catch (error) {
      console.error("下載字幕和音訊失敗：", error);
    }
  };

  // 步驟 2：翻譯字幕
  const translateSubtitles = async () => {
    try {
      const response = await fetch("http://localhost:5003/text_audio/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: subtitleText, target_language: language }),
      });
      const data = await response.json();

      if (data.translated_text) {
        setTranslatedText(data.translated_text);
        setCheck2Visible(true);
        setStartThirdProgress(true);
      } else {
        alert("翻譯字幕失敗！");
      }
    } catch (error) {
      console.error("翻譯字幕失敗：", error);
    }
  };

  // 步驟 3：生成語音
  const generateAudio = async () => {
    try {
      const response = await fetch("http://localhost:5003/text_audio/text_to_speech", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: translatedText, lang: language }),
      });
      const data = await response.json();

      if (data.audio_path) {
        setCheck3Visible(true);
        setStartFourthProgress(true);
      } else {
        alert("生成語音失敗！");
      }
    } catch (error) {
      console.error("生成語音失敗：", error);
    }
  };

  // 步驟 4：整理大綱
  const summarizeOutline = async () => {
    try {
      setCheck4Visible(true);
      localStorage.setItem("app3State", JSON.stringify({ url, videoData }));
      console.log("導航數據at app23：", { url, videoData });
      setTimeout(() => navigate("/app3", { state: { videoData } })); // 傳遞 videoData
    } catch (error) {
      console.error("整理大綱失敗：", error);
    }
  };

  useEffect(() => {
    downloadAudioAndSubtitles();
  }, []);

  useEffect(() => {
    if (startSecondProgress) translateSubtitles();
  }, [startSecondProgress]);

  useEffect(() => {
    if (startThirdProgress) generateAudio();
  }, [startThirdProgress]);

  useEffect(() => {
    if (startFourthProgress) summarizeOutline();
  }, [startFourthProgress]);

  return (
    <div className="App23">
      <Step />
      <div className="Wait">請稍後，並避免任何操作...</div>
      <div className="ing">
        <div className="text">
          <div className="d">
            ➤ 下載字幕
            <Progressbar
              onComplete={() => {
                setCheck1Visible(true);
                setStartSecondProgress(true);
              }}
            />
            {check1Visible && <img src="/assets/check1.png" className="check" />}
          </div>

          <div className="t">
            ➤ 翻譯中
            {startSecondProgress && (
              <Progressbar
                onComplete={() => {
                  setCheck2Visible(true);
                  setStartThirdProgress(true);
                }}
              />
            )}
            {check2Visible && <img src="/assets/check1.png" className="check" />}
          </div>

          <div className="v">
            ➤ 生成音檔
            {startThirdProgress && (
              <Progressbar
                onComplete={() => {
                  setCheck3Visible(true);
                  setStartFourthProgress(true);
                }}
              />
            )}
            {check3Visible && <img src="/assets/check1.png" className="check" />}
          </div>

          <div>
            ➤ 整理大綱
            {startFourthProgress && (
              <Progressbar
                onComplete={() => {
                  setCheck4Visible(true);
                  setTimeout(() => {
                    navigate("/app3", { state: { videoData } }); // 傳遞 videoData
                  });
                }}
              />
            )}
            {check4Visible && <img src="/assets/check1.png" className="check" />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App23;
