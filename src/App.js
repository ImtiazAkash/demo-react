import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import VideoUpload from "./components/VideoUpload";
import VideoPlayer from "./components/VideoPlayer";

function App() {
  return (
      <Router>
        <div className="navbar">
          <Link to="/upload">Upload Video</Link>
          <Link to="/watch/5">Watch Video (Example ID: 1)</Link>
        </div>

        <Routes>
          <Route path="/upload" element={<VideoUpload />} />
          <Route path="/watch/:lectureId" element={<VideoPlayer />} />
        </Routes>
      </Router>
  );
}

export default App;
