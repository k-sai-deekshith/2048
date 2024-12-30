import { useState, useEffect, useCallback, useRef } from "react";

interface AudioState {
  isMusicEnabled: boolean;
  isSoundEnabled: boolean;
  volume: number;
}

const STORAGE_KEY = "2048_audio_preferences";

export function useAudio() {
  const [audioState, setAudioState] = useState<AudioState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {
      isMusicEnabled: false,
      isSoundEnabled: true,
      volume: 0.5,
    };
  });

  // Use refs to persist audio instances
  const moveSound = useRef(new Audio("/sounds/move.mp3"));
  const mergeSound = useRef(new Audio("/sounds/merge.mp3"));
  const bgMusic = useRef(new Audio("/sounds/background.mp3"));

  // Configure background music
  useEffect(() => {
    bgMusic.current.loop = true;
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(audioState));

    // Update volume for all sounds
    [moveSound.current, mergeSound.current, bgMusic.current].forEach(sound => {
      sound.volume = audioState.volume;
    });

    // Handle background music
    if (audioState.isMusicEnabled) {
      const playPromise = bgMusic.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay might be blocked, we'll need user interaction
          setAudioState(prev => ({ ...prev, isMusicEnabled: false }));
        });
      }
    } else {
      bgMusic.current.pause();
    }
  }, [audioState]);

  const playMoveSound = useCallback(() => {
    if (audioState.isSoundEnabled) {
      moveSound.current.currentTime = 0;
      moveSound.current.play().catch(() => {});
    }
  }, [audioState.isSoundEnabled]);

  const playMergeSound = useCallback(() => {
    if (audioState.isSoundEnabled) {
      mergeSound.current.currentTime = 0;
      mergeSound.current.play().catch(() => {});
    }
  }, [audioState.isSoundEnabled]);

  const toggleMusic = useCallback(() => {
    setAudioState(prev => ({ ...prev, isMusicEnabled: !prev.isMusicEnabled }));
  }, []);

  const toggleSound = useCallback(() => {
    setAudioState(prev => ({ ...prev, isSoundEnabled: !prev.isSoundEnabled }));
  }, []);

  const setVolume = useCallback((volume: number) => {
    setAudioState(prev => ({ ...prev, volume }));
  }, []);

  // Cleanup audio instances on unmount
  useEffect(() => {
    return () => {
      bgMusic.current.pause();
      bgMusic.current.src = '';
      moveSound.current.src = '';
      mergeSound.current.src = '';
    };
  }, []);

  return {
    ...audioState,
    playMoveSound,
    playMergeSound,
    toggleMusic,
    toggleSound,
    setVolume,
  };
}