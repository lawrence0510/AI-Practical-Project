import React from "react";
import { useLocation } from "react-router-dom";
import Step from "./components/step";

function App3() {
  const location = useLocation();
  const savedState = JSON.parse(localStorage.getItem("app3State")) || {};
  const defaultState = {
    videoData: {
      url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      name: "預設影片標題",
    },
    summary: "這是預設的摘要內容。",
  };
  const { videoData, summary } = location.state || savedState || defaultState;

  React.useEffect(() => {
    if (!savedState.videoData || !savedState.videoData.url) {
      localStorage.setItem("app3State", JSON.stringify(defaultState));
    }
  }, []);

  const getEmbedUrl = (videoUrl) => {
    if (!videoUrl) return "";
    try {
      const url = new URL(videoUrl);
      if (url.hostname.includes("youtube.com") || url.hostname.includes("youtu.be")) {
        const videoId = url.searchParams.get("v") || url.pathname.split("/")[1];
        return `https://www.youtube.com/embed/${videoId}`;
      }
      console.warn("提供的 URL 不是有效的 YouTube 連結:", videoUrl);
      return "";
    } catch (error) {
      console.error("無法解析 URL:", error);
      return "";
    }
  };

  const embedUrl = getEmbedUrl(videoData?.url);

  const downloadSummaryAsTxt = () => {
    const element = document.createElement("a");
    const file = new Blob([summary], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "summary.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (!embedUrl) {
    return (
      <div>
        <p>無法嵌入影片，請提供有效的影片 URL 或重新整理頁面。</p>
        <button onClick={() => window.location.reload()}>重新整理</button>
      </div>
    );
  }

  return (
    <div className="App3">
      <Step />
      <iframe
        className="Video"
        src={embedUrl}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
      <p className="page3_name">{videoData?.name || "無影片標題"}</p>
      <div className="sb">
        <div className="top">
          <button className="play">
            <img src="/assets/play.png" alt="按鈕圖片" />
          </button>
          <button className="download" onClick={downloadSummaryAsTxt}>
            <img src="/assets/download.png" alt="按鈕圖片" />
          </button>
        </div>
        <div className="sub">
          {summary.split("\n").map((line, index) => (
            <p key={index}>{line}</p>
          ))}
        </div>
        <div className="audio-section">
          <p>語音播放：</p>
          <audio controls>
            <source src="/assets/output_audio.mp3" type="audio/mpeg" />
            您的瀏覽器不支援音訊播放。
          </audio>
        </div>
      </div>
    </div>
  );
}

export default App3;
