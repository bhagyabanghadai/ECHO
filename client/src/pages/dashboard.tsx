import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useGeolocation } from "@/hooks/use-geolocation";
import { useToast } from "@/hooks/use-toast";
import { VoiceMemoryRecorder } from "@/components/voice-memory-recorder";
import { 
  Bell, 
  User, 
  Plus, 
  MapPin, 
  Heart, 
  Volume2, 
  Play, 
  Pause, 
  Unlock,
  Filter,
  Compass,
  Clock,
  Users,
  MessageCircle,
  MoreHorizontal
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

// Add line-clamp utility if not available
declare module 'react' {
  interface CSSProperties {
    'line-clamp'?: number;
  }
}

interface Memory {
  id: string;
  title: string;
  description?: string;
  content: string;
  audioData?: string;
  emotion: string;
  emotionConfidence: number;
  latitude: number;
  longitude: number;
  locationName?: string;
  duration: number;
  unlockCount: number;
  createdAt: string;
  userId: string;
  distance?: number;
}

const emotionColors = {
  joy: "from-amber-400 to-yellow-500",
  love: "from-pink-400 to-rose-500", 
  nostalgia: "from-purple-400 to-indigo-500",
  peace: "from-teal-400 to-cyan-500",
  excitement: "from-orange-400 to-red-500",
  calm: "from-blue-400 to-sky-500",
  grateful: "from-green-400 to-emerald-500",
  contemplative: "from-violet-400 to-purple-500",
  hopeful: "from-lime-400 to-green-500"
};

const emotionEmojis = {
  joy: "😊",
  love: "💕", 
  nostalgia: "😌",
  peace: "🕊️",
  excitement: "⚡",
  calm: "🌊",
  grateful: "🙏",
  contemplative: "🤔",
  hopeful: "🌟"
};

export default function Dashboard() {
  const { user } = useAuth();
  const { hasLocation, latitude, longitude } = useGeolocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false);
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const [showMemoryModal, setShowMemoryModal] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);

  // Fetch nearby memories based on user location
  const { data: nearbyMemories, isLoading: loadingMemories } = useQuery({
    queryKey: ['/api/memories/nearby', latitude, longitude],
    enabled: hasLocation && !!latitude && !!longitude,
  }) as { data: { data: Memory[] } | undefined, isLoading: boolean };

  // Fetch user's unlocked memories (vault preview)
  const { data: userMemories } = useQuery({
    queryKey: ['/api/memories/user'],
  }) as { data: { memories: Memory[] } | undefined };

  // Calculate distance from user to memory
  const calculateDistance = (memoryLat: number, memoryLng: number): number => {
    if (!latitude || !longitude) return 0;
    
    const R = 6371; // Earth's radius in km
    const dLat = (memoryLat - latitude) * Math.PI / 180;
    const dLng = (memoryLng - longitude) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(latitude * Math.PI / 180) * Math.cos(memoryLat * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Play audio memory
  const playAudio = (memory: Memory) => {
    if (!memory.audioData) return;
    
    if (playingAudio === memory.id) {
      setPlayingAudio(null);
      if (audioRef.current) {
        audioRef.current.pause();
      }
      return;
    }
    
    if (audioRef.current) {
      audioRef.current.src = memory.audioData;
      audioRef.current.play().catch(console.error);
      setPlayingAudio(memory.id);
    }
  };

  // Unlock memory mutation
  const unlockMemoryMutation = useMutation({
    mutationFn: async (memoryId: string) => {
      return await apiRequest(`/api/memories/${memoryId}/unlock`, {
        method: 'POST',
        body: {}
      });
    },
    onSuccess: () => {
      toast({
        title: "Memory Unlocked!",
        description: "This emotional echo is now in your vault.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/memories'] });
    }
  });

  // Filter memories by emotion
  const filteredMemories = selectedEmotion 
    ? nearbyMemories?.data?.filter(memory => memory.emotion === selectedEmotion)
    : nearbyMemories?.data;

  // Add distance to memories
  const memoriesWithDistance = filteredMemories?.map(memory => ({
    ...memory,
    distance: calculateDistance(memory.latitude, memory.longitude)
  })).sort((a, b) => (a.distance || 0) - (b.distance || 0));

  const openMemoryModal = (memory: Memory) => {
    setSelectedMemory(memory);
    setShowMemoryModal(true);
  };

  const formatDistance = (distance: number): string => {
    if (distance < 1) return `${Math.round(distance * 1000)}m away`;
    return `${distance.toFixed(1)}km away`;
  };

  const formatTimeAgo = (dateString: string): string => {
    const now = new Date();
    const created = new Date(dateString);
    const diffMs = now.getTime() - created.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const uniqueEmotions = Array.from(
    new Set(nearbyMemories?.data?.map((m: Memory) => m.emotion) || [])
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-black text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-black/20 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between px-6 py-4">
          <motion.h1 
            className="text-2xl font-light bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            ECHO
          </motion.h1>
          
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="w-5 h-5" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-pink-500 rounded-full"></div>
            </Button>
            <Button variant="ghost" size="sm">
              <User className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 px-6">
        {/* Welcome Section */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-3xl font-light mb-2">
            Welcome back, <span className="text-purple-400">{user?.username}</span>
          </h2>
          <p className="text-gray-400">
            {hasLocation 
              ? `${memoriesWithDistance?.length || 0} emotional echoes discovered nearby`
              : 'Enable location to discover memories around you'
            }
          </p>
        </motion.div>

        {/* Emotion Filter */}
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
            <Filter className="w-5 h-5 text-purple-400" />
            Filter by Emotion
          </h3>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedEmotion === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedEmotion(null)}
              className="rounded-full"
            >
              All
            </Button>
            {uniqueEmotions.map((emotion: string) => (
              <Button
                key={emotion}
                variant={selectedEmotion === emotion ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedEmotion(emotion)}
                className={`rounded-full ${
                  selectedEmotion === emotion 
                    ? `bg-gradient-to-r ${emotionColors[emotion as keyof typeof emotionColors]} text-white` 
                    : ''
                }`}
              >
                {emotionEmojis[emotion as keyof typeof emotionEmojis]} {emotion}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Nearby Memories Grid */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-xl font-medium mb-4 flex items-center gap-2">
            <Compass className="w-5 h-5 text-purple-400" />
            Sleeping Memories Nearby
          </h3>
          
          {loadingMemories ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-48 bg-white/5 rounded-xl animate-pulse"></div>
              ))}
            </div>
          ) : memoriesWithDistance && memoriesWithDistance.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {memoriesWithDistance.map((memory: Memory, index: number) => (
                <motion.div
                  key={memory.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card 
                    className="bg-white/5 border-white/10 hover:bg-white/10 transition-all cursor-pointer group relative overflow-hidden"
                    onClick={() => openMemoryModal(memory)}
                  >
                    {/* Emotion glow effect */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${emotionColors[memory.emotion as keyof typeof emotionColors]} opacity-20 group-hover:opacity-30 transition-opacity`}></div>
                    
                    <CardHeader className="relative">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${emotionColors[memory.emotion as keyof typeof emotionColors]} animate-pulse`}></div>
                          <span className="text-xs text-gray-400 capitalize">{memory.emotion}</span>
                        </div>
                        <MoreHorizontal className="w-4 h-4 text-gray-500" />
                      </div>
                      <CardTitle className="text-lg font-medium">{memory.title}</CardTitle>
                    </CardHeader>
                    
                    <CardContent className="relative">
                      <p className="text-gray-300 text-sm mb-4 overflow-hidden text-ellipsis" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                        {memory.description || "Someone left an emotional memory here..."}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {memory.distance ? formatDistance(memory.distance) : 'Unknown distance'}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatTimeAgo(memory.createdAt)}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {memory.audioData && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                playAudio(memory);
                              }}
                              className="p-1 hover:bg-white/20"
                            >
                              {playingAudio === memory.id ? 
                                <Pause className="w-4 h-4" /> : 
                                <Play className="w-4 h-4" />
                              }
                            </Button>
                          )}
                          <span className="text-xs text-gray-400">
                            {memory.duration}s
                          </span>
                        </div>
                        
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            unlockMemoryMutation.mutate(memory.id);
                          }}
                        >
                          <Unlock className="w-3 h-3 mr-1" />
                          Unlock
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <Card className="bg-white/5 border-white/10 text-center py-12">
              <CardContent>
                <MapPin className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No memories nearby</h3>
                <p className="text-gray-400 mb-4">
                  {hasLocation 
                    ? 'Be the first to leave an emotional echo in this area'
                    : 'Enable location services to discover memories around you'
                  }
                </p>
                <Button 
                  onClick={() => setShowVoiceRecorder(true)}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Memory
                </Button>
              </CardContent>
            </Card>
          )}
        </motion.div>

        {/* Your Vault Preview */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h3 className="text-xl font-medium mb-4 flex items-center gap-2">
            <Heart className="w-5 h-5 text-pink-400" />
            Your Emotional Vault
          </h3>
          
          {userMemories?.data?.memories && userMemories.data.memories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {userMemories.data.memories.slice(0, 3).map((memory: Memory, index: number) => (
                <motion.div
                  key={memory.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-all cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${emotionColors[memory.emotion as keyof typeof emotionColors]}`}></div>
                        <span className="text-xs text-gray-400 capitalize">{memory.emotion}</span>
                      </div>
                      <h4 className="font-medium mb-1">{memory.title}</h4>
                      <p className="text-sm text-gray-400 overflow-hidden text-ellipsis" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{memory.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <Card className="bg-white/5 border-white/10 text-center py-8">
              <CardContent>
                <Heart className="w-8 h-8 text-gray-500 mx-auto mb-3" />
                <p className="text-gray-400">Your vault is empty. Start unlocking memories!</p>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </main>

      {/* Floating Action Button */}
      <motion.div 
        className="fixed bottom-8 right-8 z-30"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.8, type: "spring" }}
      >
        <Button
          size="lg"
          onClick={() => setShowVoiceRecorder(true)}
          className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-2xl hover:shadow-purple-500/25 transition-all"
        >
          <Plus className="w-8 h-8" />
        </Button>
      </motion.div>

      {/* Voice Memory Recorder */}
      <VoiceMemoryRecorder 
        isOpen={showVoiceRecorder}
        onClose={() => setShowVoiceRecorder(false)}
      />

      {/* Memory Detail Modal */}
      <AnimatePresence>
        {showMemoryModal && selectedMemory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowMemoryModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900 rounded-2xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${emotionColors[selectedMemory.emotion as keyof typeof emotionColors]} animate-pulse`}></div>
                  <span className="text-sm text-gray-400 capitalize">{selectedMemory.emotion}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowMemoryModal(false)}
                >
                  ✕
                </Button>
              </div>
              
              <h3 className="text-xl font-medium mb-2">{selectedMemory.title}</h3>
              <p className="text-gray-300 mb-4">{selectedMemory.description}</p>
              
              <div className="flex items-center justify-between text-sm text-gray-400 mb-6">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {selectedMemory.distance ? formatDistance(selectedMemory.distance) : 'Unknown distance'}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {formatTimeAgo(selectedMemory.createdAt)}
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => playAudio(selectedMemory)}
                  disabled={!selectedMemory.audioData}
                >
                  <Volume2 className="w-4 h-4 mr-2" />
                  Listen
                </Button>
                <Button
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  onClick={() => {
                    unlockMemoryMutation.mutate(selectedMemory.id);
                    setShowMemoryModal(false);
                  }}
                >
                  <Unlock className="w-4 h-4 mr-2" />
                  Unlock & Echo
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        onEnded={() => setPlayingAudio(null)}
        onError={() => setPlayingAudio(null)}
      />
    </div>
  );
}