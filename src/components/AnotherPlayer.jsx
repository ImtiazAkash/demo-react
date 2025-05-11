import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';

const HlsVideoPlayer = ({ src, width = 640, height = 360 }) => {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const [qualityLevels, setQualityLevels] = useState([]);
  const [currentLevel, setCurrentLevel] = useState(-1); // -1 = auto

  useEffect(() => {
    const video = videoRef.current;

    if (Hls.isSupported()) {
      const hls = new Hls();
      hlsRef.current = hls;

      hls.loadSource(src);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        const levels = hls.levels.map((level, index) => ({
          label: `${level.height}p`,
          index
        }));
        setQualityLevels([{ label: 'Auto', index: -1 }, ...levels]);
      });

      hls.on(Hls.Events.LEVEL_SWITCHED, (event, data) => {
        setCurrentLevel(data.level);
      });

    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src;
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
    };
  }, [src]);

  const handleQualityChange = (levelIndex) => {
    if (hlsRef.current) {
      hlsRef.current.currentLevel = levelIndex;
      setCurrentLevel(levelIndex);
    }
  };

  return (
    <div>
      <video
        ref={videoRef}
        controls
        width={width}
        height={height}
        style={{ backgroundColor: 'black' }}
      />
      <div style={{ marginTop: '10px' }}>
        <span>Quality: </span>
        {qualityLevels.map((q) => (
          <button
            key={q.index}
            onClick={() => handleQualityChange(q.index)}
            style={{
              marginRight: '5px',
              padding: '5px 10px',
              backgroundColor: currentLevel === q.index ? '#007bff' : '#ccc',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            {q.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default HlsVideoPlayer;
