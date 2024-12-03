import React from "react";

function Guess() {
  const videos = [
    "https://www.youtube.com/embed/OC83NA5tAGE", 
    "https://www.youtube.com/embed/CPxSzxylRCI", 
    "https://www.youtube.com/embed/2ePf9rue1Ao", 
  ]; // 影片的嵌入 URL

  return (
    <div className="Guess.Video">
      <div className="video-container">
        {videos.map((video, index) => (
          <iframe
            key={index}
            className="video"
            src={video}
            title={`YouTube video ${index + 1}`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        ))}
      </div>
    </div>
  );
}

export default Guess;
