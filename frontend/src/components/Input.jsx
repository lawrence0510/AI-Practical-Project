import React, { useState } from "react";
import Loading from "./Loading"; // 引入 Loading 組件

function Input() {
  const [isLoading, setIsLoading] = useState(false); // 追踪是否顯示 Loading
  const [inputValue, setInputValue] = useState(""); // 追蹤使用者的輸入
  const [error, setError] = useState(""); // 錯誤信息
  const [videoData, setVideoData] = useState({}); // 儲存影片數據

  const fetchVideoInfoFromAPI = async (url) => {
    try {
      const response = await fetch("http://localhost:5003/youtube/fetch_video_info", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }), // 傳送 URL 作為請求正文
      });

      const data = await response.json();
      if (response.ok && data.title && data.thumbnail_url) {
        return { name: data.title, image: data.thumbnail_url }; // 返回影片名稱和圖片
      } else {
        throw new Error("影片資訊無法取得！");
      }
    } catch (error) {
      console.error("API 錯誤:", error);
      setError("無法取得影片資訊，請確認網址是否正確。");
      return null;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // 防止表單提交刷新頁面
    setError(""); // 重置錯誤信息

    if (inputValue) {
      setIsLoading(true); // 顯示 Loading 組件
      const video = await fetchVideoInfoFromAPI(inputValue);

      if (video) {
        setVideoData({ ...video, url: inputValue }); // 合併影片數據與 URL
      }

      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    }
  };

  return (
    <div className="i">
      <form className="input" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="請貼上 YouTube 影片網址"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)} // 追蹤輸入的變化
        />
        <button disabled={isLoading}>輸入</button> {/* 提交表單，觸發 handleSubmit */}
      </form>
      {isLoading && <Loading videoData={videoData} />}{" "}
      {/* 如果 isLoading 為 true，則顯示 Loading 組件 */}
      {error && <div className="error">{error}</div>} {/* 顯示錯誤信息 */}
    </div>
  );
}

export default Input;