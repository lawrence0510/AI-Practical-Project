import React, { useState, useEffect } from "react";

function Progressbar({ onComplete }) {
  const [filled, setFilled] = useState(0);
  const isRunning = true; // 預設為自動啟動

  useEffect(() => {
    if (filled < 100 && isRunning) {
      setTimeout(() => setFilled((prev) => (prev += 2)), 75);
    }
	if (filled === 100 && isRunning) {
		onComplete(); // 當進度條到 100% 時，觸發 onComplete
	  }
	}, [filled, isRunning, onComplete]);

  return (
    <div>
      <div className="progressbar">
        <div
          style={{
            height: "100%",
            width: `${filled}%`,
            backgroundColor: "#a66cff",
            transition: "width 0.1s",
          }}
        ></div>
        <span className="progressPercent">{filled}%</span>
      </div>
    </div>
  );
}

export default Progressbar;
