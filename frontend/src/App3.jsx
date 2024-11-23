import React from "react";
import { useLocation } from "react-router-dom"; // 使用 useLocation 提取狀態
import Step from "./components/step";

function App3() {
  const location = useLocation();
  const savedState = JSON.parse(localStorage.getItem("app3State")) || {};
  const { videoData } = location.state || savedState || {};

  console.log("App3 的狀態：", location.state);

  // 將普通 YouTube URL 轉換為嵌入 URL
  const getEmbedUrl = (videoUrl) => {
    if (!videoUrl) return ""; // 如果 URL 不存在，返回空字串
    if (videoUrl.includes("embed")) return videoUrl; // 如果已是嵌入格式，直接返回
    try {
      const url = new URL(videoUrl);
      const videoId = url.searchParams.get("v"); // 提取 video_id
      return `https://www.youtube.com/embed/${videoId}`;
    } catch (error) {
      console.error("無法解析 URL:", error);
      return ""; // 如果解析失敗，返回空字串
    }
  };

  const embedUrl = getEmbedUrl(videoData?.url); // 轉換 URL

  if (!embedUrl) {
    return (
      <div>
        <p>無法嵌入視頻，請檢查影片 URL。</p>
      </div>
    );
  }

  return (
    <div className="App3">
      <Step />
      <iframe 
        className="Video"
        src={embedUrl} // 使用嵌入格式的 URL
        title="YouTube video player" 
        frameBorder="0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
        allowFullScreen
      ></iframe>
      <p className="page3_name">{videoData?.name || "無影片標題"}</p> {/* 使用 videoData.name */}
      <div className="sb">
        <div className="top">
          <button className="play">
            <img src="/assets/play.png" alt="按鈕圖片" />
          </button>
          <button className="download">
            <img src="/assets/download.png" alt="按鈕圖片" />
          </button>
        </div>
        <div className="sub">我是大綱</div>
      </div>
    </div>
  );
}

export default App3;
