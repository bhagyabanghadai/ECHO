import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  MapPin, 
  Heart, 
  Filter,
  Navigation,
  Calendar,
  Users,
  Layers,
  Play,
  Lock,
  Unlock
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { GoogleMapsEmotionMap } from "@/components/google-maps-emotion-map";
import { useGeolocation } from "@/hooks/use-geolocation";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";

const nearbyMemories = [
  {
    id: 1,
    title: "Peaceful Morning Walk",
    emotion: "peace",
    distance: "0.2 km",
    author: "Sarah M.",
    timeAgo: "2 hours ago",
    isLocked: false,
    preview: "The morning mist over the lake filled me with such tranquility..."
  },
  {
    id: 2,
    title: "Childhood Playground",
    emotion: "nostalgia",
    distance: "0.5 km",
    author: "Mike R.",
    timeAgo: "1 day ago",
    isLocked: true,
    preview: "Standing here reminds me of summer days when..."
  },
  {
    id: 3,
    title: "First Date Anniversary",
    emotion: "love",
    distance: "1.2 km",
    author: "Emma L.",
    timeAgo: "3 days ago",
    isLocked: false,
    preview: "Five years ago, right on this bench, we shared our first..."
  }
];

const emotions = [
  { name: 'all', color: '#666', emoji: '🌟' },
  { name: 'joy', color: '#FFD700', emoji: '😊' },
  { name: 'love', color: '#FF69B4', emoji: '❤️' },
  { name: 'peace', color: '#87CEEB', emoji: '😌' },
  { name: 'nostalgia', color: '#DDA0DD', emoji: '🌅' },
  { name: 'gratitude', color: '#FFB6C1', emoji: '🙏' },
];

export default function Discover() {
  const { user } = useAuth();
  const { hasLocation, latitude, longitude } = useGeolocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEmotion, setSelectedEmotion] = useState("all");
  const [showMap, setShowMap] = useState(true);

  // Fetch nearby memories based on user location
  const { data: nearbyData } = useQuery({
    queryKey: ['/api/memories/nearby', latitude, longitude],
    enabled: !!user && hasLocation
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-purple-900 p-4 flex items-center justify-center">
        <Card>
          <CardContent className="p-6 text-center">
            <Heart className="w-16 h-16 text-purple-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Discover Emotional Memories</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Sign in to explore memories and emotions around the world
            </p>
            <Button className="bg-purple-600 hover:bg-purple-700">
              Sign In to Explore
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const filteredMemories = nearbyMemories.filter(memory => {
    const matchesSearch = !searchQuery || 
      memory.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      memory.preview.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesEmotion = selectedEmotion === 'all' || memory.emotion === selectedEmotion;
    
    return matchesSearch && matchesEmotion;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-purple-900">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-gray-200 p-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Discover Emotions</h1>
            <p className="text-gray-600">
              {hasLocation ? `Finding memories near you` : 'Exploring global emotional memories'}
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant={showMap ? "default" : "outline"}
              size="sm"
              onClick={() => setShowMap(!showMap)}
            >
              <Layers className="w-4 h-4 mr-2" />
              {showMap ? 'Hide Map' : 'Show Map'}
            </Button>
            
            {hasLocation && (
              <Button variant="outline" size="sm">
                <Navigation className="w-4 h-4 mr-2" />
                My Location
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4">
        {showMap && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "400px" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 rounded-lg overflow-hidden shadow-lg"
          >
            <GoogleMapsEmotionMap />
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Filters Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Filter className="w-4 h-4" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Search */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search memories..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Emotions */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Emotions</label>
                  <div className="space-y-2">
                    {emotions.map((emotion) => (
                      <button
                        key={emotion.name}
                        onClick={() => setSelectedEmotion(emotion.name)}
                        className={`w-full text-left p-2 rounded-lg transition-colors ${
                          selectedEmotion === emotion.name
                            ? 'bg-purple-100 text-purple-900 border border-purple-300'
                            : 'hover:bg-gray-100 border border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span>{emotion.emoji}</span>
                          <span className="capitalize text-sm">{emotion.name}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Distance */}
                {hasLocation && (
                  <div>
                    <label className="text-sm font-medium mb-2 block">Distance</label>
                    <div className="space-y-2">
                      {['100m', '500m', '1km', '5km', '10km'].map((distance) => (
                        <button
                          key={distance}
                          className="w-full text-left p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <span className="text-sm">{distance}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Discovery Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Nearby memories</span>
                  <span className="font-medium">{filteredMemories.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Unlocked today</span>
                  <span className="font-medium">3</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Active users</span>
                  <span className="font-medium">127</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Memory Feed */}
          <div className="lg:col-span-3">
            <div className="space-y-4">
              {filteredMemories.map((memory) => {
                const emotion = emotions.find(e => e.name === memory.emotion) || emotions[0];
                
                return (
                  <motion.div
                    key={memory.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Card className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          
                          {/* Memory Info */}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-lg">{memory.title}</h3>
                              <Badge 
                                variant="secondary"
                                style={{ backgroundColor: `${emotion.color}20`, color: emotion.color }}
                              >
                                {emotion.emoji} {memory.emotion}
                              </Badge>
                              {memory.isLocked ? (
                                <Lock className="w-4 h-4 text-gray-400" />
                              ) : (
                                <Unlock className="w-4 h-4 text-green-500" />
                              )}
                            </div>
                            
                            <p className="text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                              {memory.preview}
                            </p>
                            
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <div className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {memory.distance}
                              </div>
                              <div className="flex items-center gap-1">
                                <Users className="w-3 h-3" />
                                {memory.author}
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {memory.timeAgo}
                              </div>
                            </div>
                          </div>
                          
                          {/* Actions */}
                          <div className="flex flex-col gap-2">
                            {memory.isLocked ? (
                              <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                                <Unlock className="w-4 h-4 mr-2" />
                                Unlock
                              </Button>
                            ) : (
                              <Button size="sm" variant="outline">
                                <Play className="w-4 h-4 mr-2" />
                                Listen
                              </Button>
                            )}
                            
                            <Button size="sm" variant="ghost">
                              <Heart className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
              
              {filteredMemories.length === 0 && (
                <Card>
                  <CardContent className="p-8 text-center">
                    <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">No memories found</h3>
                    <p className="text-gray-500 mb-4">
                      {searchQuery ? 'Try adjusting your search criteria' : 'No memories match your current filters'}
                    </p>
                    <Button variant="outline">
                      Clear Filters
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}