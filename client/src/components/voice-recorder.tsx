import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mic, Square, Play, Pause } from "lucide-react";
import { useVoiceRecording } from "@/hooks/use-voice-recording";

export default function VoiceRecorder() {
  const {
    isRecording,
    isPlaying,
    audioBlob,
    startRecording,
    stopRecording,
    playRecording,
    pauseRecording,
  } = useVoiceRecording();

  const [emotion, setEmotion] = useState<string | null>(null);

  const handleStartRecording = async () => {
    try {
      await startRecording();
      setEmotion(null);
    } catch (error) {
      console.error("Failed to start recording:", error);
    }
  };

  const handleStopRecording = () => {
    stopRecording();
    // Simulate emotion detection
    const emotions = ["nostalgia", "love", "peace", "joy", "warmth"];
    const detectedEmotion = emotions[Math.floor(Math.random() * emotions.length)];
    setEmotion(detectedEmotion);
  };

  const emotionColors = {
    nostalgia: "text-purple-400",
    love: "text-pink-400",
    peace: "text-cyan-400",
    joy: "text-yellow-400",
    warmth: "text-orange-400",
  };

  const emotionEmojis = {
    nostalgia: "💜",
    love: "❤️",
    peace: "😌",
    joy: "✨",
    warmth: "💕",
  };

  return (
    <div className="glass-morphism rounded-2xl p-6">
      <div className="flex items-center gap-4 mb-4">
        <motion.div
          className={`w-16 h-16 rounded-full flex items-center justify-center ${
            isRecording
              ? "bg-gradient-to-r from-red-500 to-red-600"
              : "bg-gradient-to-r from-pink-500 to-yellow-400"
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Mic className="w-8 h-8 text-white" />
        </motion.div>
        <div>
          <p className="text-white font-medium">
            {isRecording ? "Recording..." : "Tap to record"}
          </p>
          <p className="text-gray-400 text-sm">Share your emotion</p>
        </div>
      </div>

      {/* Voice wave visualization */}
      {isRecording && (
        <div className="flex justify-center mb-4">
          <div className="voice-wave">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="bar" style={{ animationDelay: `${i * 0.1}s` }} />
            ))}
          </div>
        </div>
      )}

      {/* Recording controls */}
      <div className="flex justify-center gap-4 mb-4">
        {!isRecording ? (
          <Button
            onClick={handleStartRecording}
            className="bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600"
          >
            <Mic className="w-4 h-4 mr-2" />
            Start Recording
          </Button>
        ) : (
          <Button
            onClick={handleStopRecording}
            variant="destructive"
          >
            <Square className="w-4 h-4 mr-2" />
            Stop Recording
          </Button>
        )}

        {audioBlob && !isRecording && (
          <Button
            onClick={isPlaying ? pauseRecording : playRecording}
            variant="outline"
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 mr-2" />
            ) : (
              <Play className="w-4 h-4 mr-2" />
            )}
            {isPlaying ? "Pause" : "Play"}
          </Button>
        )}
      </div>

      {/* Emotion detection result */}
      {emotion && (
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-gray-400 text-sm mb-1">Emotion detected:</p>
          <p className={`font-medium ${emotionColors[emotion as keyof typeof emotionColors]}`}>
            {emotionEmojis[emotion as keyof typeof emotionEmojis]} {emotion}
          </p>
        </motion.div>
      )}
    </div>
  );
}
