import { useState, useEffect, useCallback } from "react";

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

  const moveSound = new Audio("/sounds/move.mp3");
  const mergeSound = new Audio("/sounds/merge.mp3");
  const bgMusic = new Audio("/sounds/background.mp3");
  bgMusic.loop = true;

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(audioState));
    
    // Update volume for all sounds
    [moveSound, mergeSound, bgMusic].forEach(sound => {
      sound.volume = audioState.volume;
    });

    // Handle background music
    if (audioState.isMusicEnabled) {
      bgMusic.play().catch(() => {
        // Autoplay might be blocked, we'll need user interaction
        setAudioState(prev => ({ ...prev, isMusicEnabled: false }));
      });
    } else {
      bgMusic.pause();
    }
  }, [audioState]);

  const playMoveSound = useCallback(() => {
    if (audioState.isSoundEnabled) {
      moveSound.currentTime = 0;
      moveSound.play().catch(() => {});
    }
  }, [audioState.isSoundEnabled]);

  const playMergeSound = useCallback(() => {
    if (audioState.isSoundEnabled) {
      mergeSound.currentTime = 0;
      mergeSound.play().catch(() => {});
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

  return {
    ...audioState,
    playMoveSound,
    playMergeSound,
    toggleMusic,
    toggleSound,
    setVolume,
  };
}
