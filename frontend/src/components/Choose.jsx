import { useNavigate } from "react-router-dom"; // 引入 useNavigate 進行頁面導航
import React, { useState } from "react";

function Choose({ videoData }) {
  const navigate = useNavigate();
  const [selectedLanguage, setSelectedLanguage] = useState(null); // 保存選擇的語言

  const handleNext = () => {
    if (!videoData) {
      console.error("videoData 未傳遞，請檢查導航流程");
      return;
    }
  
    if (selectedLanguage) {
      // 傳遞語言和 videoData 到下一頁
      console.log("選擇的語言: ", selectedLanguage);
      console.log("videoData at Choose: ", videoData);
      navigate("/app23", { state: { videoData, language: selectedLanguage } }); 
    } else {
      alert("請選擇一個語言！"); // 提示用戶選擇語言
    }
  };

  // 支援翻譯和 TTS 的語言選項
  const languages = [
    { value: "th", label: "泰語 (Thai)" },
    { value: "zu", label: "祖魯語 (Zulu)" },
    { value: "hi", label: "印地語 (Hindi)" },
    { value: "el", label: "希臘語 (Greek)" },
    { value: "de", label: "德語 (German)" },
    { value: "ja", label: "日語 (Japanese)" },
    { value: "ko", label: "韓語 (Korean)" },
    { value: "fr", label: "法語 (French)" },
    { value: "fi", label: "芬蘭語 (Finnish)" },
    { value: "pl", label: "波蘭語 (Polish)" },
    { value: "da", label: "丹麥語 (Danish)" },
    { value: "ru", label: "俄語 (Russian)" },
    { value: "es", label: "西班牙語 (Spanish)" },
    { value: "it", label: "義大利語 (Italian)" },
    { value: "nl", label: "荷蘭語 (Dutch)" },
    { value: "id", label: "印尼語 (Indonesian)" },
    { value: "pt", label: "葡萄牙語 (Portuguese)" },
    { value: "ar", label: "阿拉伯語 (Arabic)" },
    { value: "no", label: "挪威語 (Norwegian)" },
    { value: "sw", label: "斯瓦希里語 (Swahili)" },
    { value: "sv", label: "瑞典語 (Swedish)" },
    { value: "si", label: "僧伽羅語 (Sinhala)" },
    { value: "mr", label: "馬拉地語 (Marathi)" },
    { value: "ne", label: "尼泊爾語 (Nepali)" },
    { value: "ms", label: "馬來語 (Malay)" },
    { value: "ta", label: "泰米爾語 (Tamil)" },
    { value: "su", label: "巽他語 (Sundanese)" },
    { value: "bs", label: "波士尼亞語 (Bosnian)" },
    { value: "ca", label: "加泰羅尼亞語 (Catalan)" },
    { value: "hr", label: "克羅地亞語 (Croatian)" },
    { value: "tr", label: "土耳其語 (Turkish)" },
    { value: "gu", label: "古吉拉特語 (Gujarati)" },
    { value: "uk", label: "烏克蘭語 (Ukrainian)" },
    { value: "af", label: "南非荷蘭語 (Afrikaans)" },
    { value: "bn", label: "孟加拉語 (Bengali)" },
    { value: "am", label: "阿姆哈拉語 (Amharic)" },
    { value: "cs", label: "捷克語 (Czech)" },
    { value: "en", label: "英語 (English)" },
    { value: "hu", label: "匈牙利語 (Hungarian)" },
    { value: "kn", label: "卡納達語 (Kannada)" },
    { value: "jw", label: "爪哇語 (Javanese)" },
    { value: "ro", label: "羅馬尼亞語 (Romanian)" },
    { value: "te", label: "泰盧固語 (Telugu)" },
    { value: "sq", label: "阿爾巴尼亞語 (Albanian)" },
    { value: "zh-TW", label: "中文（繁體） (Chinese, Traditional)" },
  ];

  return (
    <div>
      <div className="choose">
        <div className="trans">
          | 翻譯語言 |
          <div className="language-buttons">
            {languages.map((lang) => (
              <button
                key={lang.value}
                className={`lang-button ${
                  selectedLanguage === lang.value ? "selected" : ""
                }`}
                onClick={() => setSelectedLanguage(lang.value)} // 設置選中語言
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      <button className="next" onClick={handleNext}>
        下一步
      </button>
    </div>
  );
}

export default Choose;