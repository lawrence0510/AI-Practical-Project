import { useNavigate } from "react-router-dom"; // 引入 useNavigate 進行頁面導航
import React, { useState } from "react";

function Choose() {
  const navigate = useNavigate();
  const [selectedLanguage, setSelectedLanguage] = useState(null); // 保存選擇的語言

  const handleNext = () => {
    if (selectedLanguage) {
      navigate("/app23", { state: { language: selectedLanguage } }); // 跳轉到下一頁，並傳遞語言
    } else {
      alert("請選擇一個語言！"); // 提示用戶選擇語言
    }
  };

  // 同時支援翻譯和 TTS 的語言選項
  const languages = [
    { value: "af", label: "南非荷蘭語 (Afrikaans)" },
    { value: "sq", label: "阿爾巴尼亞語 (Albanian)" },
    { value: "am", label: "阿姆哈拉語 (Amharic)" },
    { value: "ar", label: "阿拉伯語 (Arabic)" },
    { value: "bn", label: "孟加拉語 (Bengali)" },
    { value: "bs", label: "波士尼亞語 (Bosnian)" },
    { value: "ca", label: "加泰羅尼亞語 (Catalan)" },
    { value: "zh-TW", label: "中文（繁體） (Chinese, Traditional)" },
    { value: "hr", label: "克羅地亞語 (Croatian)" },
    { value: "cs", label: "捷克語 (Czech)" },
    { value: "da", label: "丹麥語 (Danish)" },
    { value: "nl", label: "荷蘭語 (Dutch)" },
    { value: "en", label: "英語 (English)" },
    { value: "fi", label: "芬蘭語 (Finnish)" },
    { value: "fr", label: "法語 (French)" },
    { value: "de", label: "德語 (German)" },
    { value: "el", label: "希臘語 (Greek)" },
    { value: "gu", label: "古吉拉特語 (Gujarati)" },
    { value: "hi", label: "印地語 (Hindi)" },
    { value: "hu", label: "匈牙利語 (Hungarian)" },
    { value: "id", label: "印尼語 (Indonesian)" },
    { value: "it", label: "義大利語 (Italian)" },
    { value: "ja", label: "日語 (Japanese)" },
    { value: "jw", label: "爪哇語 (Javanese)" },
    { value: "kn", label: "卡納達語 (Kannada)" },
    { value: "ko", label: "韓語 (Korean)" },
    { value: "ms", label: "馬來語 (Malay)" },
    { value: "ml", label: "馬拉雅拉姆語 (Malayalam)" },
    { value: "mr", label: "馬拉地語 (Marathi)" },
    { value: "ne", label: "尼泊爾語 (Nepali)" },
    { value: "no", label: "挪威語 (Norwegian)" },
    { value: "pl", label: "波蘭語 (Polish)" },
    { value: "pt", label: "葡萄牙語 (Portuguese)" },
    { value: "ro", label: "羅馬尼亞語 (Romanian)" },
    { value: "ru", label: "俄語 (Russian)" },
    { value: "si", label: "僧伽羅語 (Sinhala)" },
    { value: "es", label: "西班牙語 (Spanish)" },
    { value: "su", label: "巽他語 (Sundanese)" },
    { value: "sw", label: "斯瓦希里語 (Swahili)" },
    { value: "sv", label: "瑞典語 (Swedish)" },
    { value: "ta", label: "泰米爾語 (Tamil)" },
    { value: "te", label: "泰盧固語 (Telugu)" },
    { value: "th", label: "泰語 (Thai)" },
    { value: "tr", label: "土耳其語 (Turkish)" },
    { value: "uk", label: "烏克蘭語 (Ukrainian)" },
    { value: "ur", label: "烏爾都語 (Urdu)" },
    { value: "vi", label: "越南語 (Vietnamese)" },
    { value: "zu", label: "祖魯語 (Zulu)" },
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
