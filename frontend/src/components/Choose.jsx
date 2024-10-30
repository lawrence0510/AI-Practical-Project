import { useNavigate } from "react-router-dom"; // 引入 useNavigate 進行頁面導航
import React from "react";

function Choose() {
  const navigate = useNavigate();

  const handleNext = () => {
    navigate("/app23"); // 跳轉到 App3 頁面
  };

  return (
    <div>
      <div className="choose">
        <div className="trans">| 翻譯語言 |</div>
        <div className="voice">| 音檔設定 |</div>
        <div className="sub">| 字幕下載 |</div>
      </div>
      <button className="next" onClick={handleNext}>
        下一步
      </button>
    </div>
  );
}

export default Choose;
