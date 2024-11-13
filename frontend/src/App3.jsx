import Step from "./components/step";
import React from "react";
import ReactPlayer from 'react-player'

function App3() {
  return (
    <div className="App3">
      <Step />
      <div>hi</div>
      <ReactPlayer
        url="https://youtu.be/44lbeIb6TjA?si=Qn3w9tmXB5XrUsU0"
        title="YouTube video player"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      ></ReactPlayer>
    </div>
  );
}

export default App3;
