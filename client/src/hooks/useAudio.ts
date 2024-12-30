import { useState, useEffect, useCallback, useRef } from "react";

interface AudioState {
  isSoundEnabled: boolean;
  volume: number;
}

const STORAGE_KEY = "2048_audio_preferences";

export function useAudio() {
  const [audioState, setAudioState] = useState<AudioState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {
      isSoundEnabled: true,
      volume: 0.5,
    };
  });

  // Use refs to persist audio instances
  const moveSound = useRef(new Audio("/sounds/move.mp3"));
  const mergeSound = useRef(new Audio("/sounds/merge.mp3"));

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(audioState));

    // Update volume for all sounds
    [moveSound.current, mergeSound.current].forEach(sound => {
      sound.volume = audioState.volume;
    });
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

  const toggleSound = useCallback(() => {
    setAudioState(prev => ({ ...prev, isSoundEnabled: !prev.isSoundEnabled }));
  }, []);

  const setVolume = useCallback((volume: number) => {
    setAudioState(prev => ({ ...prev, volume }));
  }, []);

  // Cleanup audio instances on unmount
  useEffect(() => {
    return () => {
      moveSound.current.src = '';
      mergeSound.current.src = '';
    };
  }, []);

  return {
    isSoundEnabled: audioState.isSoundEnabled,
    volume: audioState.volume,
    playMoveSound,
    playMergeSound,
    toggleSound,
    setVolume,
  };
}