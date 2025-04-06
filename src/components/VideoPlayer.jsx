import React, { useEffect, useRef, useState } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import { useParams } from 'react-router-dom';

const VideoPlayer = () => {
    const { lectureId } = useParams(); // Get lecture ID from URL
    const videoRef = useRef(null); // Reference to the video element
    const [isError, setIsError] = useState(false); // Track if there is an error
    const [availableQualities, setAvailableQualities] = useState([]);
    const [selectedQuality, setSelectedQuality] = useState(null);
    const [player, setPlayer] = useState(null);
    const [videoUrl, setVideoUrl] = useState("null");

    useEffect(() => {
        const path = `lecture/videos/${lectureId}/master.m3u8`;
        const bucketName ='ai-point-r2-storage'
        const videoURl = `http://localhost:8010/api/r2/buckets/${bucketName}/objects/${path}`
        setVideoUrl(videoURl);
        // Initialize the video.js player when component mounts
        const videoJsPlayer = videojs(videoRef.current, {
            autoplay: false,
            controls: true,
            preload: 'auto',
            sources: [{
                src: videoURl,
                type: 'application/x-mpegURL'
            }],
            plugins: {
                // Add any necessary plugins (like HLS)
            }
        });

        // Store the player instance
        setPlayer(videoJsPlayer);

        // Listen for the available qualities after the stream is loaded
        videoJsPlayer.ready(() => {
            const hls = videoJsPlayer.hls;
            if (hls) {
                // Listen to the level-loaded event to get the available qualities
                hls.on('level-loaded', (event, data) => {
                    const qualities = data.levels.map(level => ({
                        resolution: level.height,
                        bitrate: level.bitrate,
                    }));
                    setAvailableQualities(qualities);

                    // Default to the highest quality
                    setSelectedQuality(qualities[qualities.length - 1]);
                });
            }
        });

        // Error handling
        videoJsPlayer.on('error', (event) => {
            console.error('Video.js Error: ', event);
            setIsError(true);
        });

        // Cleanup on unmount
        return () => {
            if (player) {
                player.dispose();
            }
        };
    }, [lectureId, player]);

    // Handle manual quality change
    const handleQualityChange = (event) => {
        const qualityResolution = parseInt(event.target.value);
        const quality = availableQualities.find(q => q.resolution === qualityResolution);

        if (quality && player) {
            const qualityIndex = availableQualities.indexOf(quality);
            if (qualityIndex !== -1) {
                // Switch quality by setting the current level in Video.js
                player.hls.currentLevel = qualityIndex;
                setSelectedQuality(quality);
            }
        }
    };

    if (isError) {
        return <div>Error loading video</div>;
    }

    return (
        <div>
            <video
                ref={videoRef}
                className="video-js vjs-default-skin"
                controls
                width="800"
            >
                <source
                    src={videoUrl}
                    type="application/x-mpegURL"
                />
            </video>

            {/* Manual Quality Control Dropdown */}
            <div>
                <label>Select Quality: </label>
                <select
                    onChange={handleQualityChange}
                    value={selectedQuality ? selectedQuality.resolution : ''}
                >
                    {availableQualities.map((quality, index) => (
                        <option key={index} value={quality.resolution}>
                            {quality.resolution}p
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default VideoPlayer;
