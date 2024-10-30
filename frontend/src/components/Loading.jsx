import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";  // 引入 useNavigate 進行頁面導航
import spinner from "/assets/Spinner.svg";  // 引入加載圖片

function Loading({ videoData }) {
  const navigate = useNavigate();  // 初始化導航函數

  useEffect(() => {
    const timer = setTimeout(() => {
      if (videoData && videoData.name && videoData.image) {
        navigate('/app2' , { state: { videoData } });  // 跳轉到 App2 頁面
      }
    }, 2000);  // 

    // 清理計時器
    return () => clearTimeout(timer);
  }, [navigate, videoData]);

  return (
    <div className="Loading">
      <img src={spinner} alt="Loading spinner" />  {/* 顯示加載圖片 */}
    </div>
  );
}

export default Loading;
