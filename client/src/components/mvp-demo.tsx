import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Mic, Heart, Sparkles, ArrowRight, Volume2, Lock, Unlock } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useGeolocation } from "@/hooks/use-geolocation";
import { useToast } from "@/hooks/use-toast";

interface MVPDemoProps {
  onComplete: () => void;
}

// Simulated nearby memories for GPS demo
const simulatedMemories = [
  {
    id: '1',
    emotion: 'nostalgia',
    snippet: 'Walking through this park reminds me of childhood summers...',
    distance: 50,
    unlocked: false
  },
  {
    id: '2',
    emotion: 'joy',
    snippet: 'Had the most amazing coffee here this morning!',
    distance: 120,
    unlocked: false
  },
  {
    id: '3',
    emotion: 'contemplative',
    snippet: 'Watching the sunset from this bench, thinking about life...',
    distance: 200,
    unlocked: false
  }
];

export function MVPDemo({ onComplete }: MVPDemoProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [hasRecorded, setHasRecorded] = useState(false);
  const [detectedEmotion, setDetectedEmotion] = useState<string | null>(null);
  const [nearbyMemories, setNearbyMemories] = useState(simulatedMemories);
  const [unlockedMemories, setUnlockedMemories] = useState<string[]>([]);
  
  const { user } = useAuth();
  const { hasLocation, latitude, longitude } = useGeolocation();
  const { toast } = useToast();

  // Simulated recording timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  // Auto-advance when location is enabled
  useEffect(() => {
    if (hasLocation && currentStep === 1) {
      setTimeout(() => setCurrentStep(2), 1500);
    }
  }, [hasLocation, currentStep]);

  const emotions = ['joy', 'nostalgia', 'calm', 'excited', 'contemplative', 'hopeful'];

  const handleStartRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    
    // Simulate emotion detection
    setTimeout(() => {
      const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
      setDetectedEmotion(randomEmotion);
      setHasRecorded(true);
      
      toast({
        title: "Memory Created!",
        description: `Emotion detected: ${randomEmotion}`,
      });
      
      setTimeout(() => setCurrentStep(3), 2000);
    }, 1000);
  };

  const handleUnlockMemory = (memoryId: string) => {
    setUnlockedMemories(prev => [...prev, memoryId]);
    toast({
      title: "Memory Unlocked!",
      description: "You can now listen to this emotional echo.",
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <motion.div className="text-center space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Welcome to ECHO MVP
              </h2>
              <p className="text-gray-300">
                Experience the 3 core features: GPS unlock, voice posting, and emotion awareness
              </p>
            </div>
            <Button 
              onClick={() => setCurrentStep(1)}
              className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600"
            >
              Start Demo
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        );

      case 1:
        return (
          <motion.div className="text-center space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
              <MapPin className="w-10 h-10 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">
                ✅ GPS-Based Unlock
              </h2>
              <p className="text-gray-300">
                Enabling location to discover nearby emotional memories
              </p>
            </div>
            {hasLocation ? (
              <motion.div 
                className="text-green-400 space-y-3"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Location enabled!</span>
                </div>
                <div className="text-sm text-gray-400">
                  Found {nearbyMemories.length} memories within 500m
                </div>
              </motion.div>
            ) : (
              <div className="text-yellow-400">
                <p>Requesting location access...</p>
              </div>
            )}
          </motion.div>
        );

      case 2:
        return (
          <motion.div className="text-center space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
              <Mic className="w-10 h-10 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">
                ✅ Real-Time Voice Posting
              </h2>
              <p className="text-gray-300">
                Record your emotional memory for others to discover
              </p>
            </div>
            
            <div className="bg-gray-800/50 rounded-lg p-6 space-y-4">
              {!isRecording && !hasRecorded && (
                <Button
                  onClick={handleStartRecording}
                  size="lg"
                  className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 rounded-full w-16 h-16"
                >
                  <Mic className="w-6 h-6" />
                </Button>
              )}
              
              {isRecording && (
                <div className="space-y-4">
                  <motion.div 
                    className="w-3 h-3 bg-red-500 rounded-full mx-auto"
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                  <div className="text-2xl font-mono text-purple-400">
                    {formatTime(recordingTime)}
                  </div>
                  <Button
                    onClick={handleStopRecording}
                    className="bg-gray-600 hover:bg-gray-700 rounded-full"
                  >
                    Stop Recording
                  </Button>
                </div>
              )}
              
              {hasRecorded && detectedEmotion && (
                <motion.div 
                  className="space-y-3"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div className="text-green-400 flex items-center justify-center gap-2">
                    <Heart className="w-4 h-4" />
                    Memory created!
                  </div>
                  <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg p-4">
                    <div className="text-xl capitalize text-purple-400 font-bold">
                      {detectedEmotion}
                    </div>
                    <div className="text-sm text-gray-400">
                      Emotion detected with 89% confidence
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div className="text-center space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-pink-500 to-rose-500 rounded-full flex items-center justify-center">
              <Heart className="w-10 h-10 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">
                ✅ Emotion-Aware Welcome
              </h2>
              <p className="text-gray-300">
                Discover memories that match your emotional state
              </p>
            </div>
            
            <div className="space-y-3">
              {nearbyMemories.map((memory) => (
                <Card key={memory.id} className="bg-gray-800/70 border-gray-600">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 text-left">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded-full">
                            {memory.emotion}
                          </span>
                          <span className="text-xs text-gray-400">
                            {memory.distance}m away
                          </span>
                        </div>
                        <p className="text-sm text-gray-300">{memory.snippet}</p>
                      </div>
                      <Button
                        size="sm"
                        variant={unlockedMemories.includes(memory.id) ? "default" : "outline"}
                        onClick={() => handleUnlockMemory(memory.id)}
                        disabled={unlockedMemories.includes(memory.id)}
                        className="ml-3"
                      >
                        {unlockedMemories.includes(memory.id) ? (
                          <>
                            <Volume2 className="w-3 h-3 mr-1" />
                            Play
                          </>
                        ) : (
                          <>
                            <Unlock className="w-3 h-3 mr-1" />
                            Unlock
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="pt-4 space-y-3">
              <div className="text-green-400 text-sm">
                ✓ GPS-based discovery ✓ Voice emotion analysis ✓ Location-aware memories
              </div>
              
              <Button 
                onClick={onComplete}
                className="bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-700 hover:to-rose-600"
              >
                Complete MVP Demo
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <Card className="w-full max-w-md bg-gray-900/95 border-gray-700">
        <CardContent className="p-8">
          {/* Progress indicator */}
          <div className="flex justify-center mb-8">
            <div className="flex gap-2">
              {[0, 1, 2, 3].map((index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index <= currentStep ? 'bg-purple-500' : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {renderStep()}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}