import { useNavigate } from "react-router-dom"; // 引入 useNavigate 進行頁面導航
import React from "react";
import Select from "react-select";
import { useState } from "react";

function Choose() {
  const navigate = useNavigate();
  const [toggled, setToggled] = useState(false)

  const handleNext = () => {
    navigate("/app23"); // 跳轉到 App3 頁面
  };

  const trans = [
    { value: "中文（繁體）", label: "中文（繁體）" },
    { value: "孟加拉語", label: "孟加拉語" },
    { value: "印地語", label: "印地語" },
    { value: "尼泊爾語", label: "尼泊爾語" },
  ];

  const gender = [
    { value: "女性", label: "女性" },
    { value: "男性", label: "男性" },
    { value: "中性", label: "中性" },
  ];

  const speed = [
    { value: "0.5", label: "0.5" },
    { value: "0.75", label: "0.75" },
    { value: "1", label: "1" },
    { value: "1.25", label: "1.25" },
    { value: "1.5", label: "1.5" },
  ];

  return (
    <div>
      <div className="choose">
        <div className="trans">
          | 翻譯語言 |<Select options={trans} className="select_trans" />
        </div>
        <div className="voice">
          | 音檔設定 |<Select options={gender} className="select_gender" />
          <Select options={speed} className="select_speed" />
        </div>
        <div className="ssub">
          | 字幕下載 |{" "}
          <button
            className={`toggle-btn ${toggled ? "toggled" : ""}`}
            onClick={() => setToggled(!toggled)}
          >
            <div className="thumb"></div>
          </button>
        </div>
      </div>
      <button className="next" onClick={handleNext}>
        下一步
      </button>
    </div>
  );
}

export default Choose;
