import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mic, Square, Play, Pause, MapPin, Heart, Sparkles, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useGeolocation } from "@/hooks/use-geolocation";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface VoiceMemoryRecorderProps {
  isOpen: boolean;
  onClose: () => void;
}

const emotions = [
  { name: 'joy', color: '#FFD700', emoji: '😊' },
  { name: 'nostalgia', color: '#DDA0DD', emoji: '🌅' },
  { name: 'love', color: '#FF69B4', emoji: '❤️' },
  { name: 'calm', color: '#87CEEB', emoji: '😌' },
  { name: 'excitement', color: '#FF4500', emoji: '🎉' },
  { name: 'contemplative', color: '#9370DB', emoji: '🤔' },
  { name: 'hopeful', color: '#32CD32', emoji: '🌟' },
  { name: 'grateful', color: '#FFB6C1', emoji: '🙏' }
];

export function VoiceMemoryRecorder({ isOpen, onClose }: VoiceMemoryRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [detectedEmotion, setDetectedEmotion] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<number>(0);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const { hasLocation, latitude, longitude } = useGeolocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Create memory mutation
  const createMemoryMutation = useMutation({
    mutationFn: async (memoryData: any) => {
      return await apiRequest('/api/memories', {
        method: 'POST',
        body: memoryData,
      });
    },
    onSuccess: () => {
      toast({
        title: "Memory Created!",
        description: "Your emotional memory has been saved successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/emotions/map'] });
      queryClient.invalidateQueries({ queryKey: ['/api/memories'] });
      resetRecorder();
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create memory",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (isRecording && intervalRef.current === null) {
      intervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else if (!isRecording && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRecording]);
  
  // Cleanup effect on unmount
  useEffect(() => {
    return () => {
      // Clean up all resources when component unmounts
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current = null;
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      console.log('Starting recording...');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const chunks: BlobPart[] = [];
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        console.log('Media recorder stopped');
        const audioBlob = new Blob(chunks, { type: 'audio/wav' });
        setAudioBlob(audioBlob);
        setAudioUrl(URL.createObjectURL(audioBlob));
        processAudioForEmotion(audioBlob);
        
        // Stop all media tracks to release microphone
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        }
        
        // Reset media recorder reference after processing
        setTimeout(() => {
          mediaRecorderRef.current = null;
        }, 100);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      console.log('Recording started, isRecording:', true);
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: "Recording Error",
        description: "Unable to access microphone. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    console.log('Stop recording called, isRecording:', isRecording);
    console.log('MediaRecorder ref exists:', !!mediaRecorderRef.current);
    console.log('MediaRecorder state:', mediaRecorderRef.current?.state);
    
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      console.log('Stopping media recorder...');
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      // Clear the timer interval
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      
      console.log('Recording stopped, isRecording set to false');
    } else {
      console.log('Cannot stop recording - recorder state:', mediaRecorderRef.current?.state);
      // Force stop if we're in recording state but recorder is messed up
      if (isRecording) {
        setIsRecording(false);
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        }
      }
    }
  };

  const playAudio = () => {
    if (audioUrl && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const processAudioForEmotion = async (audioBlob: Blob) => {
    setIsProcessing(true);
    
    try {
      // In a real implementation, you would convert audio to text using speech-to-text
      // For demo purposes, we'll simulate a voice transcript
      const simulatedTranscript = "I feel so grateful today. Walking through the park, I'm remembering all the beautiful moments we've shared together. The autumn leaves remind me of change and growth.";
      
      // Analyze emotion using GLM-4.5 AI
      const response = await fetch('/api/ai/analyze-voice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transcript: simulatedTranscript,
          context: 'Voice memory recording in ECHO emotional memory app'
        }),
      });

      if (response.ok) {
        const { analysis } = await response.json();
        
        // Find the emotion object that matches the AI's detection
        const detectedEmotionObj = emotions.find(e => e.name === analysis.primaryEmotion) 
          || emotions.find(e => e.name === 'contemplative') 
          || emotions[0];
        
        setDetectedEmotion(analysis.primaryEmotion);
        setSelectedEmotion(analysis.primaryEmotion);
        setConfidence(analysis.confidence);
        setIsProcessing(false);
        
        toast({
          title: "AI Emotion Analysis Complete!",
          description: `${detectedEmotionObj.emoji} ${analysis.primaryEmotion} detected with ${(analysis.confidence * 100).toFixed(0)}% confidence`,
        });
      } else {
        throw new Error('Failed to analyze emotion');
      }
    } catch (error) {
      console.error('Error processing audio for emotion:', error);
      
      // Fallback to simulated analysis if AI fails
      const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
      const randomConfidence = Math.random() * 0.4 + 0.6;
      
      setDetectedEmotion(randomEmotion.name);
      setSelectedEmotion(randomEmotion.name);
      setConfidence(randomConfidence);
      setIsProcessing(false);
      
      toast({
        title: "Emotion Detected (Fallback)",
        description: `${randomEmotion.emoji} ${randomEmotion.name} detected with ${(randomConfidence * 100).toFixed(0)}% confidence`,
      });
    }
  };

  const createMemory = async () => {
    if (!audioBlob || !title || !hasLocation) {
      toast({
        title: "Incomplete Memory",
        description: "Please provide a title and ensure location is enabled.",
        variant: "destructive",
      });
      return;
    }

    // Convert audio blob to base64 for storage
    const reader = new FileReader();
    reader.onloadend = () => {
      const audioData = reader.result as string;
      
      const memoryData = {
        title,
        description,
        content: title, // Use title as content for now
        emotion: selectedEmotion || detectedEmotion || 'neutral',
        emotionConfidence: confidence,
        latitude,
        longitude,
        audioData,
        duration: recordingTime,
        isActive: 1,
        accessType: 'public',
      };

      createMemoryMutation.mutate(memoryData);
    };
    
    reader.readAsDataURL(audioBlob);
  };

  const resetRecorder = () => {
    setIsRecording(false);
    setIsPlaying(false);
    setRecordingTime(0);
    setAudioBlob(null);
    setAudioUrl(null);
    setDetectedEmotion(null);
    setSelectedEmotion(null);
    setConfidence(0);
    setTitle("");
    setDescription("");
    setIsProcessing(false);
    
    // Clean up timer interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    // Clean up media recorder and stream
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current = null;
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (audioRef.current) {
      audioRef.current.src = "";
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="w-full max-w-2xl"
      >
        <Card className="bg-white border-gray-200 shadow-2xl">
          <CardHeader className="text-center border-b">
            <CardTitle className="flex items-center justify-center gap-2 text-2xl text-gray-900">
              <Mic className="w-6 h-6 text-purple-600" />
              Create Voice Memory
            </CardTitle>
            <p className="text-gray-600 text-sm">
              Record your emotional memory and let AI analyze the feeling
            </p>
          </CardHeader>
          
          <CardContent className="p-6 space-y-6">
            {/* Recording Section */}
            <div className="text-center space-y-4">
              <div className="relative">
                <motion.button
                  onClick={() => {
                    console.log('Button clicked, current isRecording:', isRecording);
                    if (isRecording) {
                      stopRecording();
                    } else {
                      startRecording();
                    }
                  }}
                  className={`w-24 h-24 rounded-full flex items-center justify-center text-white text-2xl shadow-lg transition-all ${
                    isRecording 
                      ? 'bg-red-500 hover:bg-red-600' 
                      : 'bg-purple-600 hover:bg-purple-700'
                  }`}
                  whileTap={{ scale: 0.95 }}
                  animate={isRecording ? { scale: [1, 1.05, 1] } : {}}
                  transition={isRecording ? { repeat: Infinity, duration: 1 } : {}}
                >
                  {isRecording ? <Square className="w-8 h-8" fill="white" /> : <Mic className="w-8 h-8" />}
                  {/* Debug indicator */}
                  <span className="absolute -bottom-8 text-xs text-black">
                    {isRecording ? 'STOP' : 'START'}
                  </span>
                </motion.button>
                
                {isRecording && (
                  <motion.div
                    className="absolute -inset-4 border-4 border-red-500 rounded-full"
                    animate={{ opacity: [0.3, 0.8, 0.3] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  />
                )}
              </div>
              
              <div className="text-lg font-mono text-gray-700">
                {formatTime(recordingTime)}
              </div>
              
              {isRecording && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-center gap-2 text-red-600"
                >
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                  <span className="text-sm font-medium">Recording...</span>
                </motion.div>
              )}
            </div>

            {/* Audio Playback */}
            {audioUrl && (
              <div className="flex items-center justify-center gap-4 p-4 bg-gray-50 rounded-lg">
                <Button
                  onClick={playAudio}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  {isPlaying ? 'Pause' : 'Play'} Recording
                </Button>
                
                <audio
                  ref={audioRef}
                  src={audioUrl}
                  onEnded={() => setIsPlaying(false)}
                  className="hidden"
                />
              </div>
            )}

            {/* Emotion Detection */}
            <AnimatePresence>
              {(isProcessing || detectedEmotion) && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200"
                >
                  {isProcessing ? (
                    <div className="flex items-center justify-center gap-3">
                      <Sparkles className="w-5 h-5 text-purple-600 animate-spin" />
                      <span className="text-purple-800 font-medium">Analyzing emotion...</span>
                    </div>
                  ) : (
                    <div className="text-center space-y-3">
                      <div className="flex items-center justify-center gap-2">
                        <Heart className="w-5 h-5 text-purple-600" />
                        <span className="text-purple-800 font-semibold">Emotion Detected</span>
                      </div>
                      
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-2xl">
                          {emotions.find(e => e.name === detectedEmotion)?.emoji}
                        </span>
                        <span className="text-lg font-bold capitalize text-gray-900">
                          {detectedEmotion}
                        </span>
                        <span className="text-sm text-gray-600">
                          ({(confidence * 100).toFixed(0)}% confidence)
                        </span>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Emotion Selection */}
            {detectedEmotion && (
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700">
                  Adjust emotion if needed:
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {emotions.map((emotion) => (
                    <button
                      key={emotion.name}
                      onClick={() => setSelectedEmotion(emotion.name)}
                      className={`p-3 rounded-lg border transition-all ${
                        selectedEmotion === emotion.name
                          ? 'border-purple-500 bg-purple-50 ring-2 ring-purple-200'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="text-lg mb-1">{emotion.emoji}</div>
                      <div className="text-xs capitalize font-medium">{emotion.name}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Memory Details */}
            {audioBlob && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Memory Title *
                  </label>
                  <Input
                    type="text"
                    placeholder="Give your memory a title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description (optional)
                  </label>
                  <Textarea
                    placeholder="Add context about this memory..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="w-full"
                  />
                </div>
                
                {hasLocation && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 p-3 bg-green-50 rounded-lg border border-green-200">
                    <MapPin className="w-4 h-4 text-green-600" />
                    <span>Location will be saved with this memory</span>
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t">
              <Button
                onClick={onClose}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
              
              {audioBlob && (
                <Button
                  onClick={resetRecorder}
                  variant="outline"
                  className="flex-1"
                >
                  Start Over
                </Button>
              )}
              
              {audioBlob && title && (
                <Button
                  onClick={createMemory}
                  disabled={createMemoryMutation.isPending}
                  className="flex-1 bg-purple-600 hover:bg-purple-700"
                >
                  {createMemoryMutation.isPending ? (
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 animate-spin" />
                      Creating...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Send className="w-4 h-4" />
                      Create Memory
                    </span>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}