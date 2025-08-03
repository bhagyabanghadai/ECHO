import { useState, useRef, useCallback } from "react";

export function useVoiceRecording() {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioPlayer = useRef<HTMLAudioElement | null>(null);
  const chunks = useRef<Blob[]>([]);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      mediaRecorder.current = new MediaRecorder(stream);
      chunks.current = [];

      mediaRecorder.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.current.push(event.data);
        }
      };

      mediaRecorder.current.onstop = () => {
        const blob = new Blob(chunks.current, { type: "audio/webm" });
        setAudioBlob(blob);
        
        // Stop all tracks to free up the microphone
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.current.start();
      setIsRecording(true);
      setError(null);
    } catch (err) {
      setError("Failed to access microphone. Please check permissions.");
      console.error("Error accessing microphone:", err);
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      setIsRecording(false);
    }
  }, [isRecording]);

  const playRecording = useCallback(() => {
    if (audioBlob) {
      const url = URL.createObjectURL(audioBlob);
      audioPlayer.current = new Audio(url);
      
      audioPlayer.current.onended = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(url);
      };

      audioPlayer.current.play();
      setIsPlaying(true);
    }
  }, [audioBlob]);

  const pauseRecording = useCallback(() => {
    if (audioPlayer.current) {
      audioPlayer.current.pause();
      setIsPlaying(false);
    }
  }, []);

  return {
    isRecording,
    isPlaying,
    audioBlob,
    error,
    startRecording,
    stopRecording,
    playRecording,
    pauseRecording,
  };
}
