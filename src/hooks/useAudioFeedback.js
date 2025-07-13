import { useRef, useCallback } from "react";
import { Howl } from "howler";

export const useAudioFeedback = () => {
  const startSoundRef = useRef(null);
  const stopSoundRef = useRef(null);
  const errorSoundRef = useRef(null);

  const initSounds = useCallback(() => {
    if (!startSoundRef.current) {
      startSoundRef.current = new Howl({
        src: ["/assets/audio/start-listening.mp3"],
        volume: 0.5,
      });
    }

    if (!stopSoundRef.current) {
      stopSoundRef.current = new Howl({
        src: ["/assets/audio/stop-listening.mp3"],
        volume: 0.5,
      });
    }

    if (!errorSoundRef.current) {
      errorSoundRef.current = new Howl({
        src: ["/assets/audio/error.mp3"],
        volume: 0.3,
      });
    }
  }, []);

  const playStartSound = useCallback(() => {
    initSounds();
    startSoundRef.current?.play();
  }, [initSounds]);

  const playStopSound = useCallback(() => {
    initSounds();
    stopSoundRef.current?.play();
  }, [initSounds]);

  const playErrorSound = useCallback(() => {
    initSounds();
    errorSoundRef.current?.play();
  }, [initSounds]);

  return {
    playStartSound,
    playStopSound,
    playErrorSound,
  };
};
