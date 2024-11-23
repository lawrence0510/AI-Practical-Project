import Step from "./components/step";
import React from "react";

function App3() {
  const { url } = location.state || {}; // 確保 state 存在，提取 url
  return (
    <div className="App3">
      <Step />
      <iframe 
        className="Video"
        src={url}
        title="YouTube video player" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
        allowFullScreen
      ></iframe>
      <p className="page3_name">{"Elon Musk: The future we're building -- and boring | TED"}</p>
      <div className="sb">
        <div className="top">
            <span className="sub1">字幕列表</span>
            <span className="sub_sp">x0.5</span>
            <span className="sub_voice">女聲</span>
            <button className="play"><img src="/assets/play.png" alt="按鈕圖片" /></button>
            <button className="download"><img src="/assets/download.png" alt="按鈕圖片" /></button>
        </div>
        <div className="sub">
        克里斯·安德森（安）：伊隆，歡迎再次參加 TED。真的很榮幸你能來。<br /><br />
        伊隆·馬斯克（馬）：多謝邀請。<br /><br />
        安：接下來的半個多小時，我們要花點時間探索你的願景，未來怎樣令人興奮。我想問的第一個問題會有點反諷。你為什麼無聊？（註：他的公司取名「無聊」The BORING Company）<br /><br />
        馬：是啊。我也經常這麼問自己。<br /><br />
        馬：我們打算在洛杉磯的地底下挖個大窟窿，這可是開創了新起點，希望建成三維網路隧道，來緩解交通擁堵。現在交通是件最令人難以忍受的事，影響到世界各地的人，也佔用了人很多的時間。這太可怕了。在洛杉磯尤其恐怖。（笑聲）<br /><br />
        安：我想你帶來了未來工程的首映片。我能放嗎？<br /><br />
        馬：當然可以了，這還是第一次，讓大家看看我們在說什麼。裡面有幾個很重要的關鍵在講三維網路隧道的建設。你得先整合隧道的入出口，無縫對接城市。所以，藉由電梯和位於電梯上的汽車滑托，就可以整合隧道的網路出入口，只佔用兩個停車位的空間。接著車子就上了汽車滑托。<br /><br />
        馬：隧道是不限速的。我們設計車速能到每小時 200 公里。<br /><br />
        安：多快？<br /><br />
        馬：時速 200 公里，約 130 英里。從西木區到洛杉磯機場應該只要六分鐘，五、六分鐘的樣子。（掌聲）<br /><br />
        </div>
      </div>
    </div>
  );
}

export default App3;
