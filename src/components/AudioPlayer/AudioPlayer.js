import React, { useRef, useState, useEffect } from 'react';
import { useLocation } from '@docusaurus/router';
import styles from './AudioPlayer.module.css';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

export default function AudioPlayer({ audioSrc, title }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const location = useLocation();

  // Correctly resolve the audio path based on the current page location
  const resolveAudioPath = () => {
    // Get the current page path without trailing slash
    const currentPath = location.pathname.replace(/\/$/, '');
    
    // If audio source is relative, construct absolute path
    if (audioSrc.startsWith('./')) {
      return `${currentPath}/${audioSrc.replace('./', '')}`;
    }
    
    // If source already starts with the current path, return as is
    if (audioSrc.startsWith(currentPath)) {
      return audioSrc;
    }
    
    // Otherwise, join the current path with the source
    return `${currentPath}/${audioSrc}`;
  };

  const resolvedAudioSrc = resolveAudioPath();

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    console.log("Loading audio from:", resolvedAudioSrc);

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleDurationChange = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);
    const handleCanPlay = () => {
      console.log("Audio can play!");
      setIsLoaded(true);
      setError(null);
    };
    const handleError = (e) => {
      console.error("Audio error:", e);
      setError(`Could not load audio file. Please check path: ${resolvedAudioSrc}`);
      setIsLoaded(false);
    };

    // Add event listeners
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('error', handleError);

    // Try to load the audio
    audio.load();

    // Clean up event listeners
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('error', handleError);
    };
  }, [resolvedAudioSrc]);

  // Format time in MM:SS
  const formatTime = (time) => {
    if (!isFinite(time) || time < 0) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Handle play/pause
  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => {
        console.error("Play error:", e);
        setError(`Error playing audio: ${e.message}`);
      });
    }
    setIsPlaying(!isPlaying);
  };

  // Handle seek
  const handleSeek = (e) => {
    const newTime = e.target.value;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  // Handle volume change
  const handleVolumeChange = (e) => {
    const newVolume = e.target.value;
    setVolume(newVolume);
    audioRef.current.volume = newVolume;
    if (newVolume === 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
    }
  };

  // Toggle mute
  const toggleMute = () => {
    if (isMuted) {
      audioRef.current.volume = volume;
      setIsMuted(false);
    } else {
      audioRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  return (
    <div className={styles.audioPlayer}>
      {/* Include source elements with different paths as fallbacks */}
      <audio ref={audioRef} preload="metadata">
        <source src={resolvedAudioSrc} type="audio/mpeg" />
        <source src={audioSrc} type="audio/mpeg" />
        {/* Add a third fallback without ./  */}
        <source src={audioSrc.replace('./', '')} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
      
      {error ? (
        <div className={styles.errorMessage}>
          <p>{error}</p>
          <p>Tried loading from: {resolvedAudioSrc}</p>
          <button 
            className={styles.retryButton}
            onClick={() => {
              setError(null);
              audioRef.current.load();
            }}
          >
            Retry
          </button>
        </div>
      ) : (
        <>
          <div className={styles.playerControls}>
            <button 
              className={styles.playButton} 
              onClick={togglePlay}
              disabled={!isLoaded}
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause size={24} /> : <Play size={24} />}
            </button>
            
            <div className={styles.progressContainer}>
              <span className={styles.time}>{formatTime(currentTime)}</span>
              <input
                type="range"
                className={styles.progressBar}
                min="0"
                max={duration || 0}
                value={currentTime}
                onChange={handleSeek}
                disabled={!isLoaded}
              />
              <span className={styles.time}>{formatTime(duration)}</span>
            </div>
            
            <div className={styles.volumeContainer}>
              <button 
                className={styles.muteButton} 
                onClick={toggleMute}
                aria-label={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>
              <input
                type="range"
                className={styles.volumeSlider}
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
              />
            </div>
          </div>
          
          <div className={styles.playerCaption}>
            🎧 {title || "Audio Player"}
          </div>
        </>
      )}
    </div>
  );
}
