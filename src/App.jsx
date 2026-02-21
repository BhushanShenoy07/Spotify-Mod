import { useState, useEffect, useRef } from "react";
import { playlistData } from "./data/playlist";

const PlayIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
    <path d="M8 5v14l11-7z" />
  </svg>
);

const PauseIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
  </svg>
);

const SmallPlayIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
    <path d="M8 5v14l11-7z" />
  </svg>
);

const HeartIcon = ({ filled }) => (
  <svg viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" width="18" height="18">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const DotsIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
    <circle cx="12" cy="5" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="12" cy="19" r="1.5" />
  </svg>
);

const ShuffleIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
    <polyline points="16 3 21 3 21 8" /><line x1="4" y1="20" x2="21" y2="3" />
    <polyline points="21 16 21 21 16 21" /><line x1="15" y1="15" x2="21" y2="21" />
    <line x1="4" y1="4" x2="9" y2="9" />
  </svg>
);

const style = `
  @import url('https://fonts.googleapis.com/css2?family=Figtree:wght@300;400;500;600;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #121212;
    --surface: #181818;
    --surface2: #242424;
    --surface3: #2a2a2a;
    --border: rgba(255,255,255,0.08);
    --text-primary: #fff;
    --text-secondary: #a7a7a7;
    --text-muted: #6a6a6a;
    --accent: #1db954;
    --accent-hover: #1ed760;
    --danger: #e05c5c;
    --radius: 6px;
  }

  body { background: var(--bg); color: var(--text-primary); font-family: 'Figtree', sans-serif; -webkit-font-smoothing: antialiased; }

  .app {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background: var(--bg);
  }

  /* HEADER */
  .playlist-header {
    position: relative;
    display: flex;
    align-items: flex-end;
    gap: 24px;
    padding: 80px 32px 24px;
    background: linear-gradient(transparent, rgba(0,0,0,0.5));
    overflow: hidden;
  }

  .playlist-header::before {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--header-color, #1a6b3a);
    opacity: 0.9;
    z-index: 0;
  }

  .playlist-header::after {
    content: '';
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 120px;
    background: linear-gradient(transparent, rgba(0,0,0,0.6));
    z-index: 1;
  }

  .header-content {
    position: relative;
    z-index: 2;
    display: flex;
    align-items: flex-end;
    gap: 24px;
    width: 100%;
  }

  .playlist-cover {
    width: 232px;
    height: 232px;
    flex-shrink: 0;
    border-radius: 4px;
    object-fit: cover;
    box-shadow: 0 8px 48px rgba(0,0,0,0.6);
    transition: transform 0.2s ease;
  }

  .playlist-cover:hover { transform: scale(1.02); }

  .playlist-meta {
    display: flex;
    flex-direction: column;
    gap: 8px;
    min-width: 0;
    padding-bottom: 4px;
  }

  .playlist-type {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--text-primary);
  }

  .playlist-name {
    font-size: clamp(2rem, 5vw, 4rem);
    font-weight: 800;
    line-height: 1.05;
    color: #fff;
    letter-spacing: -0.02em;
  }

  .playlist-description {
    font-size: 14px;
    color: rgba(255,255,255,0.7);
    line-height: 1.5;
    max-width: 480px;
  }

  .playlist-info {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    color: rgba(255,255,255,0.85);
    flex-wrap: wrap;
  }

  .playlist-info .owner { font-weight: 700; }
  .playlist-info .dot { color: rgba(255,255,255,0.5); font-size: 10px; }
  .playlist-info .muted { color: rgba(255,255,255,0.6); }

  /* TOOLBAR */
  .toolbar {
    display: flex;
    align-items: center;
    gap: 24px;
    padding: 24px 32px;
    background: linear-gradient(rgba(0,0,0,0.3), transparent);
  }

  .play-btn {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: var(--accent);
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #000;
    transition: transform 0.15s ease, background 0.15s ease, box-shadow 0.15s ease;
    box-shadow: 0 8px 20px rgba(29, 185, 84, 0.4);
    flex-shrink: 0;
  }

  .play-btn:hover {
    transform: scale(1.06);
    background: var(--accent-hover);
    box-shadow: 0 12px 28px rgba(29, 185, 84, 0.5);
  }

  .play-btn:active { transform: scale(0.97); }

  .icon-btn {
    background: none;
    border: none;
    cursor: pointer;
    color: var(--text-secondary);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4px;
    border-radius: 4px;
    transition: color 0.15s ease;
  }

  .icon-btn:hover { color: var(--text-primary); }
  .icon-btn.liked { color: var(--accent); }

  .shuffle-btn {
    color: var(--text-secondary);
    background: none;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    padding: 4px;
    border-radius: 4px;
    transition: color 0.15s ease;
  }

  .shuffle-btn:hover { color: var(--text-primary); }
  .shuffle-btn.active { color: var(--accent); }

  /* TRACK TABLE */
  .track-table-container {
    padding: 0 32px 96px;
  }

  .track-table-header {
    display: grid;
    grid-template-columns: 48px 1fr 1fr 1fr 60px 48px;
    align-items: center;
    padding: 8px 16px;
    border-bottom: 1px solid var(--border);
    margin-bottom: 4px;
    color: var(--text-muted);
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    position: sticky;
  top: 0;
  background: var(--bg); /* Must have background to hide tracks underneath */
  z-index: 10;
  }

  .track-row {
    display: grid;
    grid-template-columns: 48px 1fr 1fr 1fr 60px 48px;
    align-items: center;
    padding: 8px 16px;
    border-radius: var(--radius);
    cursor: pointer;
    transition: background 0.12s ease;
    position: relative;
    gap: 0;
  }

  .track-row:hover { background: var(--surface2); }

  .track-row.selected {
    background: var(--surface2);
  }

  .track-row.selected .track-title { color: var(--accent); }

  .track-num {
    font-size: 14px;
    color: var(--text-secondary);
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
  }

  .track-row.selected .track-num { color: var(--accent); }

  .play-indicator {
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--accent);
    animation: pulse 1.2s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.6; }
  }

  .track-title-cell {
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 0;
    padding-right: 12px;
  }

  .track-title {
    font-size: 15px;
    font-weight: 500;
    color: var(--text-primary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .explicit-badge {
    background: rgba(255,255,255,0.2);
    color: var(--text-secondary);
    font-size: 8px;
    font-weight: 700;
    padding: 2px 4px;
    border-radius: 2px;
    letter-spacing: 0.05em;
    flex-shrink: 0;
  }

  .track-artist {
    font-size: 13px;
    color: var(--text-secondary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding-right: 12px;
  }

  .track-artist:hover { text-decoration: underline; color: var(--text-primary); }

  .track-album {
    font-size: 13px;
    color: var(--text-secondary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding-right: 12px;
  }

  .track-album:hover { text-decoration: underline; color: var(--text-primary); }

  .track-duration {
    font-size: 13px;
    color: var(--text-secondary);
    text-align: right;
    padding-right: 8px;
    font-variant-numeric: tabular-nums;
  }

  .track-actions {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    opacity: 0;
    transition: opacity 0.12s ease;
  }

  .track-row:hover .track-actions,
  .track-row.selected .track-actions { opacity: 1; }

  .heart-btn {
    background: none;
    border: none;
    cursor: pointer;
    color: var(--text-muted);
    display: flex;
    align-items: center;
    padding: 4px;
    border-radius: 4px;
    transition: color 0.15s ease;
  }

  .heart-btn:hover { color: var(--text-primary); }
  .heart-btn.liked { color: var(--accent); opacity: 1; }

  /* SEARCH / FILTER BAR */
  .filter-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 32px 16px;
    gap: 16px;
  }

  .search-input-wrap {
    position: relative;
    max-width: 240px;
    width: 100%;
  }

  .search-icon {
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-muted);
    pointer-events: none;
  }

  .search-input {
    width: 100%;
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 4px;
    padding: 8px 12px 8px 34px;
    font-family: 'Figtree', sans-serif;
    font-size: 13px;
    color: var(--text-primary);
    outline: none;
    transition: border-color 0.15s ease;
  }

  .search-input::placeholder { color: var(--text-muted); }
  .search-input:focus { border-color: var(--text-secondary); }

  .total-info {
    font-size: 12px;
    color: var(--text-muted);
    white-space: nowrap;
  }

  /* EMPTY STATE */
  .empty-state {
    text-align: center;
    padding: 64px 32px;
    color: var(--text-secondary);
  }

  .empty-state h3 { font-size: 20px; font-weight: 700; margin-bottom: 8px; color: var(--text-primary); }
  .empty-state p { font-size: 14px; }

  /* RESPONSIVE */
  @media (max-width: 900px) {
    .track-table-header,
    .track-row {
      grid-template-columns: 40px 1fr 1fr 60px 40px;
    }
    .col-album-header,
    .track-album { display: none; }
  }

  @media (max-width: 640px) {
    .playlist-header { padding: 60px 16px 20px; flex-direction: column; align-items: center; text-align: center; }
    .header-content { flex-direction: column; align-items: center; }
    .playlist-cover { width: 160px; height: 160px; }
    .playlist-name { font-size: clamp(1.6rem, 7vw, 2.5rem); }
    .playlist-info { justify-content: center; }
    .toolbar { padding: 20px 16px; }
    .filter-bar { padding: 0 16px 12px; }
    .track-table-container { padding: 0 16px 96px; }
    .track-table-header,
    .track-row { grid-template-columns: 36px 1fr 60px 36px; }
    .col-artist-header,
    .track-artist { display: none; }
  }

  /* MINI NOW PLAYING BAR */
  .now-playing-bar {
    position: fixed;
    bottom: 0; left: 0; right: 0;
    height: 72px;
    background: #181818;
    border-top: 1px solid var(--border);
    display: flex;
    align-items: center;
    padding: 0 16px;
    gap: 16px;
    z-index: 100;
    backdrop-filter: blur(10px);
  }

  .np-info {
    display: flex;
    flex-direction: column;
    min-width: 0;
    flex: 1;
  }

  .np-title {
    font-size: 13px;
    font-weight: 600;
    color: var(--text-primary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .np-artist {
    font-size: 11px;
    color: var(--text-secondary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .np-controls {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .np-play-btn {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: var(--accent);
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #000;
    transition: transform 0.15s ease, background 0.15s ease;
    flex-shrink: 0;
  }

  .np-play-btn:hover { transform: scale(1.05); background: var(--accent-hover); }

  .progress-bar-wrap {
    flex: 2;
    max-width: 400px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .progress-bar {
    flex: 1;
    height: 4px;
    background: var(--surface3);
    border-radius: 2px;
    overflow: hidden;
    cursor: pointer;
  }

  .progress-fill {
    height: 100%;
    background: var(--accent);
    border-radius: 2px;
    transition: width 0.3s linear;
  }

  .progress-time {
    font-size: 10px;
    color: var(--text-muted);
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
  }

  @media (max-width: 640px) {
    .progress-bar-wrap { display: none; }
  }

  /* LOADING */
  .loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    gap: 16px;
    color: var(--text-secondary);
  }

  .spinner {
    width: 36px;
    height: 36px;
    border: 3px solid var(--surface3);
    border-top-color: var(--accent);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  .track-row {
    animation: fadeIn 0.2s ease both;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(4px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

export default function SpotifyPlaylist() {
  const audioRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [likedTracks, setLikedTracks] = useState(new Set([3, 7, 10]));
  const [playlistLiked, setPlaylistLiked] = useState(false);
  const [shuffled, setShuffled] = useState(false);
  const [search, setSearch] = useState("");
  const [progress, setProgress] = useState(34);

  useEffect(() => {
    if (!audioRef.current || !selectedTrack) return;

    audioRef.current.src = selectedTrack.audio;

    if (playing) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [playing, selectedTrack]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    audio.addEventListener("timeupdate", updateProgress);

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
    };
  }, [selectedTrack]);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(t);
  }, []);

  const toggleLike = (e, id) => {
    e.stopPropagation();
    setLikedTracks(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleTrackClick = (track) => {
    if (selectedTrack?.id === track.id) {
      setPlaying(p => !p);
    } else {
      setSelectedTrack(track);
      setPlaying(true);
      setProgress(0);
    }
  };

  // Change handlePlayAll to handle the 'initial play' better
const handlePlayAll = () => {
  if (!selectedTrack) {
    setSelectedTrack(filteredTracks[0]);
  }
  setPlaying(!playing); // Toggle state
};

  const filteredTracks = playlistData.tracks.filter(t =>
    search === "" ||
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    t.artist.toLowerCase().includes(search.toLowerCase()) ||
    t.album.toLowerCase().includes(search.toLowerCase())
  );

  const currentTrack = selectedTrack || playlistData.tracks[0];

  if (loading) {
    return (
      <>
        <style>{style}</style>
        <div className="loading-state">
          <div className="spinner" />
          <span style={{ fontSize: 13 }}>Loading playlist...</span>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{style}</style>
      <div className="app">
        {/* HEADER */}
        <div className="playlist-header" style={{ "--header-color": "#1d5c3a" }}>
          <div className="header-content">
            <img
              className="playlist-cover"
              src={playlistData.image}
              alt={playlistData.name}
              onError={e => { e.target.src = "https://via.placeholder.com/232/1a6b3a/ffffff?text=♪"; }}
            />
            <div className="playlist-meta">
              <span className="playlist-type">Playlist</span>
              <h1 className="playlist-name">{playlistData.name}</h1>
              <p className="playlist-description">{playlistData.description}</p>
              <div className="playlist-info">
                <span className="owner">{playlistData.owner}</span>
                <span className="dot">•</span>
                <span className="muted">{playlistData.year}</span>
                <span className="dot">•</span>
                <span className="muted">{playlistData.tracks.length} songs,</span>
                <span className="muted">{playlistData.totalDuration}</span>
              </div>
            </div>
          </div>
        </div>

        {/* TOOLBAR */}
        <div className="toolbar">
          <button className="play-btn" onClick={handlePlayAll} aria-label={playing ? "Pause" : "Play"}>
            {playing ? <PauseIcon /> : <PlayIcon />}
          </button>
          <button
            className={`icon-btn ${playlistLiked ? "liked" : ""}`}
            onClick={() => setPlaylistLiked(p => !p)}
            aria-label={playlistLiked ? "Unlike playlist" : "Like playlist"}
          >
            <HeartIcon filled={playlistLiked} />
          </button>
          <button
            className={`shuffle-btn ${shuffled ? "active" : ""}`}
            onClick={() => setShuffled(p => !p)}
            aria-label="Shuffle"
          >
            <ShuffleIcon />
          </button>
          <div style={{ marginLeft: "auto" }}>
            <button className="icon-btn" aria-label="More options">
              <DotsIcon />
            </button>
          </div>
        </div>

        {/* FILTER */}
        <div className="filter-bar">
          <div className="search-input-wrap">
            <span className="search-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </span>
            <input
              className="search-input"
              placeholder="Search in playlist"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <span className="total-info">{filteredTracks.length} of {playlistData.tracks.length} tracks</span>
        </div>

        {/* TRACK TABLE */}
        <div className="track-table-container">
          <div className="track-table-header">
            <span style={{ textAlign: "center" }}>#</span>
            <span>Title</span>
            <span className="col-artist-header">Artist</span>
            <span className="col-album-header">Album</span>
            <span style={{ textAlign: "right" }}>
              <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm4.24 16L12 15.45 7.77 18l1.12-4.81-3.73-3.23 4.92-.42L12 5l1.92 4.53 4.92.42-3.73 3.23L16.23 18z" />
              </svg>
            </span>
            <span />
          </div>

          {filteredTracks.length === 0 ? (
            <div className="empty-state">
              <h3>No tracks found</h3>
              <p>Try a different search term.</p>
            </div>
          ) : (
            filteredTracks.map((track, i) => {
              const isSelected = selectedTrack?.id === track.id;
              const isPlaying = isSelected && playing;
              return (
                <div
                  key={track.id}
                  className={`track-row ${isSelected ? "selected" : ""}`}
                  onClick={() => handleTrackClick(track)}
                  style={{ animationDelay: `${i * 20}ms` }}
                  role="row"
                  aria-label={`${track.title} by ${track.artist}`}
                >
                  <div className="track-num">
                    {isPlaying ? (
                      <span className="play-indicator"><SmallPlayIcon /></span>
                    ) : (
                      <span className="row-num">{i + 1}</span>
                    )}
                  </div>

                  <div className="track-title-cell">
                    <div style={{ minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span className="track-title">{track.title}</span>
                        {track.explicit && <span className="explicit-badge">E</span>}
                      </div>
                    </div>
                  </div>

                  <span className="track-artist col-artist-header">{track.artist}</span>
                  <span className="track-album col-album-header">{track.album}</span>
                  <span className="track-duration">{track.duration}</span>

                  <div className="track-actions">
                    <button
                      className={`heart-btn ${likedTracks.has(track.id) ? "liked" : ""}`}
                      onClick={e => toggleLike(e, track.id)}
                      aria-label={likedTracks.has(track.id) ? "Unlike" : "Like"}
                    >
                      <HeartIcon filled={likedTracks.has(track.id)} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
{/* Hidden Audio Element */}
<audio
  ref={audioRef}
  preload="metadata"
  onEnded={() => {
    const currentIndex = playlistData.tracks.findIndex(
      t => t.id === selectedTrack?.id
    );
    const nextTrack = playlistData.tracks[currentIndex + 1];
    if (nextTrack) {
      setSelectedTrack(nextTrack);
      setPlaying(true);
    } else {
      setPlaying(false);
    }
  }}
/>
      {/* NOW PLAYING BAR */}
      <div className="now-playing-bar">
        <div className="np-info">
          <span className="np-title">{currentTrack.title}</span>
          <span className="np-artist">{currentTrack.artist}</span>
        </div>
        <div className="np-controls">
          <button
  className="np-play-btn"
  onClick={() => setPlaying(p => !p)}
  aria-label={playing ? "Pause" : "Play"}
>
  {playing ? (
    <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
      <path d="M9 5v14l11-7z" />
    </svg>
  )}
</button>
        </div>
        <div className="progress-bar-wrap">
          <span className="progress-time">0:{Math.floor(progress * 0.36).toString().padStart(2,"0")}</span>
          <div
  className="progress-bar"
  onClick={(e) => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;

    audio.currentTime = percent * audio.duration;   // 🔥 move song
    setProgress(percent * 100);                     // update UI
  }}
>
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <span className="progress-time">{currentTrack.duration}</span>
        </div>
      </div>
    </>
  );
}
