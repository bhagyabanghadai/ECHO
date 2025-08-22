import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  Filter, 
  Calendar, 
  MapPin, 
  Heart, 
  Play, 
  Pause, 
  MoreVertical,
  Share2,
  Edit,
  Trash2,
  Plus,
  Grid,
  List
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import { VoiceMemoryRecorder } from "@/components/voice-memory-recorder";

const emotions = [
  { name: 'all', color: '#666', emoji: '🌟' },
  { name: 'joy', color: '#FFD700', emoji: '😊' },
  { name: 'nostalgia', color: '#DDA0DD', emoji: '🌅' },
  { name: 'love', color: '#FF69B4', emoji: '❤️' },
  { name: 'calm', color: '#87CEEB', emoji: '😌' },
  { name: 'excitement', color: '#FF4500', emoji: '🎉' },
  { name: 'contemplative', color: '#9370DB', emoji: '🤔' },
  { name: 'hopeful', color: '#32CD32', emoji: '🌟' },
  { name: 'grateful', color: '#FFB6C1', emoji: '🙏' }
];

export default function Memories() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEmotion, setSelectedEmotion] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showRecorder, setShowRecorder] = useState(false);
  const [playingMemory, setPlayingMemory] = useState<string | null>(null);

  // Fetch user memories
  const { data: memoriesData, isLoading } = useQuery({
    queryKey: ['/api/memories/user', selectedEmotion, sortBy, searchQuery],
    enabled: !!user
  });

  const memories = memoriesData?.memories || [];
  
  const filteredMemories = memories.filter((memory: any) => {
    const matchesSearch = !searchQuery || 
      memory.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      memory.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesEmotion = selectedEmotion === 'all' || memory.emotion === selectedEmotion;
    
    return matchesSearch && matchesEmotion;
  });

  const handlePlayMemory = (memoryId: string) => {
    if (playingMemory === memoryId) {
      setPlayingMemory(null);
    } else {
      setPlayingMemory(memoryId);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-purple-900 p-4 flex items-center justify-center">
        <Card>
          <CardContent className="p-6">
            <p>Please log in to view your memories.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-purple-900 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Memories</h1>
            <p className="text-gray-600 dark:text-gray-400">
              {filteredMemories.length} {filteredMemories.length === 1 ? 'memory' : 'memories'} found
            </p>
          </div>
          <Button onClick={() => setShowRecorder(true)} className="bg-purple-600 hover:bg-purple-700">
            <Plus className="w-4 h-4 mr-2" />
            Create Memory
          </Button>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search your memories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex gap-2">
                <Select value={selectedEmotion} onValueChange={setSelectedEmotion}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Emotion" />
                  </SelectTrigger>
                  <SelectContent>
                    {emotions.map((emotion) => (
                      <SelectItem key={emotion.name} value={emotion.name}>
                        <div className="flex items-center gap-2">
                          <span>{emotion.emoji}</span>
                          <span className="capitalize">{emotion.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="emotion">By Emotion</SelectItem>
                    <SelectItem value="location">By Location</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex border rounded-md">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="rounded-r-none"
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="rounded-l-none"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Memories Grid/List */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-4">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-20 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredMemories.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No memories found</h3>
              <p className="text-gray-500 mb-4">
                {searchQuery ? 'Try adjusting your search criteria' : 'Start creating your first emotional memory'}
              </p>
              <Button onClick={() => setShowRecorder(true)} className="bg-purple-600 hover:bg-purple-700">
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Memory
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className={viewMode === "grid" 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" 
            : "space-y-4"
          }>
            <AnimatePresence>
              {filteredMemories.map((memory: any, index: number) => {
                const emotion = emotions.find(e => e.name === memory.emotion) || emotions[0];
                
                return (
                  <motion.div
                    key={memory.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="group hover:shadow-lg transition-shadow cursor-pointer">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg line-clamp-1">
                              {memory.title || 'Untitled Memory'}
                            </CardTitle>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge 
                                variant="secondary" 
                                style={{ backgroundColor: `${emotion.color}20`, color: emotion.color }}
                              >
                                {emotion.emoji} {memory.emotion}
                              </Badge>
                              {memory.isPrivate && (
                                <Badge variant="outline">Private</Badge>
                              )}
                            </div>
                          </div>
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Share2 className="w-4 h-4 mr-2" />
                                Share
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="pt-0">
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                          {memory.description || 'No description available'}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(memory.createdAt).toLocaleDateString()}
                            </div>
                            {memory.location && (
                              <div className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {memory.location}
                              </div>
                            )}
                          </div>
                          
                          {memory.audioUrl && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handlePlayMemory(memory.id)}
                            >
                              {playingMemory === memory.id ? (
                                <Pause className="w-4 h-4" />
                              ) : (
                                <Play className="w-4 h-4" />
                              )}
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {/* Voice Memory Recorder Modal */}
        <VoiceMemoryRecorder
          isOpen={showRecorder}
          onClose={() => setShowRecorder(false)}
        />
      </div>
    </div>
  );
}