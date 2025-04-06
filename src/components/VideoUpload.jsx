import React, {useState} from "react";
import axios from "axios";

const VideoUpload = () => {
    const [file, setFile] = useState(null);
    const [lectureId, setLectureId] = useState(""); // Input for lecture ID
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState("");

    const handleUpload = async () => {
        // Ensure lectureId is provided
        if (!file || !lectureId) {
            setMessage("Please select a file and enter a lecture ID.");
            return;
        }

        // Ensure lectureId is a valid number
        const parsedLectureId = parseInt(lectureId, 10);
        if (isNaN(parsedLectureId)) {
            setMessage("Invalid lecture ID.");
            return;
        }

        setUploading(true);
        setMessage("");

        const formData = new FormData();
        formData.append("file", file); // Append the file to form data

        try {
            // Construct the URL with the lectureId
            const response = await axios.post(
                `http://localhost:8010/api/v1/lecture/upload/${parsedLectureId}`, // Correctly using parsed lectureId
                formData,
                {
                    headers: {"Content-Type": "multipart/form-data"},
                }
            );
            setMessage(`Upload successful! Video URL: ${response.data}`);
        } catch (error) {
            setMessage("Upload failed. Please try again.");
        }

        setUploading(false);
    };

    return (
        <div className="container">
            <h2>Upload Video</h2>
            <input
                type="text"
                placeholder="Enter Lecture ID"
                value={lectureId}
                onChange={(e) => setLectureId(e.target.value)} // Set the lectureId
            />
            <input
                type="file"
                accept="video/*"
                onChange={(e) => setFile(e.target.files[0])} // Set the selected file
            />
            <button onClick={handleUpload} disabled={uploading}>
                {uploading ? "Uploading..." : "Upload"}
            </button>
            {message && <p>{message}</p>}
        </div>
    );
};

export default VideoUpload;
