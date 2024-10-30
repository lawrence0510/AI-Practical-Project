import React, { useState } from "react";
import Loading from "./Loading"; // 引入 Loading 組件

function Input() {
  const [isLoading, setIsLoading] = useState(false); // 追踪是否顯示 Loading
  const [inputValue, setInputValue] = useState(""); // 追蹤使用者的輸入
  const [error, setError] = useState(""); // 錯誤信息
  const [videoData, setVideoData] = useState({}); // 儲存影片名稱

  const handleClick = () => {
    alert("此網址查無影片名稱與圖片！");
    window.location.reload();
  };

  // 查詢 JSON 文件的 API
  const fetchVideoTitleFromAPI = async (webId) => {
    const url = `http://localhost:5000/videos?Web=${webId}`; // 查詢 Web ID 的 API

    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.length > 0) {
        return { name: data[0].Name, image: data[0].image }; // 返回影片名稱&圖片
      } else {
        setTimeout(handleClick, 2000);
        clearTimeout(timer);
      }
    } catch (error) {
      console.error("API 錯誤:", error);
      return { name: "API 查詢失敗", image: null };
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // 防止表單提交刷新頁面
    setError(""); // 重置錯誤信息

    if (inputValue) {
      setIsLoading(true); // 顯示 Loading 組件

      const video = await fetchVideoTitleFromAPI(inputValue); // 從 API 獲取影片名稱
      setVideoData(video);

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
        <button disabled={isLoading}>輸入</button>{" "}
        {/* 提交表單，觸發 handleSubmit */}
      </form>
      {isLoading && <Loading videoData={videoData} />}{" "}
      {/* 如果 isLoading 為 true，則顯示 Loading 組件 */}
      {error && { error }} {/* 顯示錯誤信息 */}
    </div>
  );
}

export default Input;
