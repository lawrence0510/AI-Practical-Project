import React, { useState } from "react";
import Step from "./components/step";
import Progressbar from "./components/Progressbar";
import { useNavigate } from "react-router-dom";

function App23() {
  const [check1Visible, setCheck1Visible] = useState(false);
  const [check2Visible, setCheck2Visible] = useState(false);
  const [check3Visible, setCheck3Visible] = useState(false);
  const [check4Visible, setCheck4Visible] = useState(false);

  const [startSecondProgress, setStartSecondProgress] = useState(false); // 控制第二個進度條啟動
  const [startThirdProgress, setStartThirdProgress] = useState(false); // 控制第三個進度條啟動
  const [startFourthProgress, setStartFourthProgress] = useState(false); // 控制第四個進度條啟動
  
  const navigate = useNavigate(); // 用於跳轉頁面

  return (
    <div className="App23">
      <Step />
      <div className="Wait">請稍後，並避免任何操作...</div>
      <div className="ing">
        <div className="text">
          {/* 進度條 1 */}
          <div className="d">
            ➤ 下載字幕
            <Progressbar
              onComplete={() => {
                setCheck1Visible(true); // 顯示第一個打勾
                setStartSecondProgress(true); // 啟動第二個進度條
              }}
            />
            {check1Visible && (
              <img src="/assets/check1.png" className="check" />
            )}
          </div>

          {/* 進度條 2 */}
          <div className="t">
            ➤ 翻譯中
            {startSecondProgress && (
              <Progressbar
                onComplete={() => {
                  setCheck2Visible(true); // 顯示第二個打勾
                  setStartThirdProgress(true); // 啟動第三個進度條
                }}
              />
            )}
            {check2Visible && (
              <img src="/assets/check1.png" className="check" />
            )}
          </div>

          {/* 進度條 3 */}
          <div className="v">
            ➤ 生成音檔
            {startThirdProgress && (
              <Progressbar
                onComplete={() => {
                  setCheck3Visible(true); // 顯示第三個打勾
                  setStartFourthProgress(true); // 啟動第四個進度條
                }}
              />
            )}
            {check3Visible && (
              <img src="/assets/check1.png" className="check" />
            )}
          </div>

          {/* 進度條 4 */}
          <div>
            ➤ 字幕匯出
            {startFourthProgress && (
              <Progressbar
                onComplete={() => {
                  setCheck4Visible(true); // 顯示第四個打勾
                  setTimeout(() => {
                    navigate("/app3"); // 跳轉到 App3 頁面
                  }, 500); 
                }}
              />
            )}
            {check4Visible && (
              <img src="/assets/check1.png" className="check" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App23;
