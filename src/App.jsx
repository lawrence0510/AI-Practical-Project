import "./App.css";
import Step from "./components/step";
import Input from "./components/input";

function App() {
  return (
    <div className="App">
      <Step />
      <div className="Topic">～　新一代 AI 翻譯影片功能　～</div>
      <Input />
      <div className="Guess">猜你喜歡...</div>
    </div>
  );
}

export default App;
