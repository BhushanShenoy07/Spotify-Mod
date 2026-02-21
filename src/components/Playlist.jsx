import React, { useState, useRef, useEffect } from "react";
import playlistData from "./data/playlist";

export default function Playlist() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const audioRef = useRef(null);

  const currentTrack =
    currentTrackIndex !== null
      ? playlistData.tracks[currentTrackIndex]
      : null;

  // 🔹 Next Track
  const handleNext = () => {
    if (currentTrackIndex === null) return;

    const nextIndex =
      (currentTrackIndex + 1) % playlistData.tracks.length;
    setCurrentTrackIndex(nextIndex);
  };

  // 🔹 Previous Track
  const handlePrev = () => {
    if (currentTrackIndex === null) return;

    const prevIndex =
      (currentTrackIndex - 1 + playlistData.tracks.length) %
      playlistData.tracks.length;
    setCurrentTrackIndex(prevIndex);
  };

  // 🔹 Load track when index changes
  useEffect(() => {
    if (currentTrack && audioRef.current) {
      audioRef.current.src = currentTrack.audio;
      audioRef.current.play();
    }
  }, [currentTrackIndex, currentTrack]);

  // 🔹 Sync progress with real audio time
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      if (audio.duration) {
        const percent = (audio.currentTime / audio.duration) * 100;
        setProgress(percent);
      }
    };

    const handleEnded = () => {
      handleNext();
    };

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [currentTrackIndex]);

  // 🔹 Play / Pause
  const togglePlay = () => {
    if (!audioRef.current) return;

    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play();
      setPlaying(true);
    }
  };

  return (
    <div style={{ padding: "30px", fontFamily: "sans-serif" }}>
      <h1>{playlistData.name}</h1>
      <p>{playlistData.description}</p>

      {/* Track List */}
      <div>
        {playlistData.tracks.map((track, index) => (
          <div
            key={track.id}
            onClick={() => setCurrentTrackIndex(index)}
            style={{
              padding: "10px",
              marginBottom: "5px",
              cursor: "pointer",
              background:
                index === currentTrackIndex ? "#eee" : "#fff",
              border: "1px solid #ddd",
            }}
          >
            {track.title} – {track.artist}
          </div>
        ))}
      </div>

      {/* Now Playing */}
      {currentTrack && (
        <div style={{ marginTop: "30px" }}>
          <h3>
            Now Playing: {currentTrack.title} – {currentTrack.artist}
          </h3>

          <div
            style={{
              height: "5px",
              width: "100%",
              background: "#ccc",
              margin: "10px 0",
            }}
          >
            <div
              style={{
                height: "5px",
                width: `${progress}%`,
                background: "#000",
              }}
            />
          </div>

          <button onClick={handlePrev}>Prev</button>
          <button onClick={togglePlay}>
            {playing ? "Pause" : "Play"}
          </button>
          <button onClick={handleNext}>Next</button>
        </div>
      )}

      {/* IMPORTANT: Real Audio Element */}
      <audio ref={audioRef} preload="metadata" />
    </div>
  );
}