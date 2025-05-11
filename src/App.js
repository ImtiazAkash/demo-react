import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import VideoUpload from "./components/VideoUpload";
import VideoPlayer from "./components/VideoPlayer";
import HlsVideoPlayer from "./components/AnotherPlayer";

function App() {
  return (
      <Router>
        <div className="navbar">
          <Link to="/upload">Upload Video</Link>
          <Link to="/watch/5">Watch Video (Example ID: 1)</Link>
          <HlsVideoPlayer src="http://localhost:8010/api/v1/lecture/video/1/master.m3u8" />

        </div>

        <Routes>
          <Route path="/upload" element={<VideoUpload />} />
          <Route path="/watch/:lectureId" element={<VideoPlayer />} />
          
        </Routes>
      </Router>
  );
}

export default App;
