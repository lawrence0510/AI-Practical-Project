import Step from "./components/step";
import React from "react";
import Progressbar from "./components/Progressbar";

function App23(){


    return(
        <div className="App23">
            <Step />
            <div className="Wait">請稍後，並避免任何操作...</div>
            <div className="ing">
                <div className="text">
                    <div className="d"> ➤ 下載字幕<Progressbar /><img src="/assets/check1.png" className="check" /></div>
                    <div className="t"> ➤ 翻譯中<Progressbar /></div>
                    <div className="v"> ➤ 生成音檔</div>
                    <div> ➤ 字幕匯出</div>
                </div>
            </div>
        </div>



    )

}

export default App23;