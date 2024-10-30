import Step from "./components/step";
import { useLocation } from "react-router-dom";
import Choose from "./components/Choose";

function App2() {
  const location = useLocation(); // 獲取來自 App 頁面的狀態
  const { videoData } = location.state || {}; // 從狀態中提取 inputValue

  return (
    <div className="App2">
      <Step />
      <p className="web">{videoData.name || "無影片名稱"}</p>{" "}
      {/* 顯示影片名稱 */}
      {videoData.image && (
        <img src={videoData.image} alt={videoData.name} className="VideoPic" />
      )}{" "}
      {/* 顯示影片圖片 */}
      <Choose />
    </div>
  );
}

export default App2;
