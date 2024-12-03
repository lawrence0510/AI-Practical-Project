import "./App.css";
import Step from "./components/step";
import Input from "./components/input";
import Guess from "./components/Guess";

function App() {
  return (
    <div className="App">
      <Step />
      <div className="Topic">智慧教育翻譯平台</div>
      <Input />
      <div className="Guess">猜你喜歡...</div>
      <Guess />
    </div>
  );
}

export default App;
