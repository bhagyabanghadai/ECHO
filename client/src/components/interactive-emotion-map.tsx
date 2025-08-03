import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, Map, Layers, Filter } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";

// Google Maps type declarations
declare global {
  interface Window {
    google: any;
  }
}

interface EmotionData {
  emotion: string;
  count: number;
  lat: number;
  lng: number;
}

const emotionColors = {
  joy: "#FFD700",
  sadness: "#4169E1", 
  anger: "#DC143C",
  fear: "#800080",
  surprise: "#FFA500",
  disgust: "#228B22",
  nostalgia: "#DDA0DD",
  love: "#FF69B4",
  excitement: "#FF4500",
  calm: "#87CEEB",
  contemplative: "#9370DB",
  hopeful: "#32CD32",
  grateful: "#FFB6C1"
};

export function InteractiveEmotionMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [isGlobeView, setIsGlobeView] = useState(false);
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [showEmotionPanel, setShowEmotionPanel] = useState(true);
  const [markers, setMarkers] = useState<any[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Fetch emotion map data
  const { data: emotionData, isLoading } = useQuery<{ data: EmotionData[] }>({
    queryKey: ["/api/emotions/map"],
  });

  useEffect(() => {
    const loadGoogleMaps = () => {
      // Create fallback demo map with interactive features
      if (mapRef.current) {
        setMapLoaded(true);
        mapRef.current.innerHTML = `
          <div class="flex items-center justify-center h-full bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 rounded-lg relative overflow-hidden">
            <div class="absolute inset-0 bg-black/50"></div>
            <div class="relative z-10 text-center p-8">
              <div class="w-32 h-32 mx-auto mb-6 relative">
                <div class="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full opacity-20 animate-pulse"></div>
                <div class="absolute inset-4 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full opacity-40 animate-ping"></div>
                <div class="absolute inset-8 bg-white rounded-full flex items-center justify-center">
                  <svg class="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                </div>
              </div>
              <h3 class="text-2xl font-bold text-white mb-2">Global Emotion Map</h3>
              <p class="text-gray-300 mb-4">Interactive mapping with globe view</p>
              <div class="flex justify-center gap-2 text-sm text-gray-400">
                <span class="bg-purple-500/20 px-2 py-1 rounded">Zoom enabled</span>
                <span class="bg-blue-500/20 px-2 py-1 rounded">Globe view</span>
                <span class="bg-green-500/20 px-2 py-1 rounded">Emotion filters</span>
              </div>
            </div>
            
            <!-- Simulated emotion points -->
            <div class="absolute top-1/4 left-1/3 w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
            <div class="absolute bottom-1/3 right-1/4 w-2 h-2 bg-pink-400 rounded-full animate-pulse"></div>
            <div class="absolute top-1/2 left-1/4 w-4 h-4 bg-blue-400 rounded-full animate-pulse"></div>
            <div class="absolute bottom-1/4 left-1/2 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <div class="absolute top-1/3 right-1/3 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
          </div>
        `;
      }
    };

    loadGoogleMaps();
  }, []);

  // Simulate interactive emotion visualization
  useEffect(() => {
    if (!mapLoaded || !emotionData?.data) return;
    
    // In a real implementation, this would add markers to the Google Map
    console.log("Emotion data loaded:", emotionData.data);
    console.log("Selected emotion filter:", selectedEmotion);
  }, [mapLoaded, emotionData, selectedEmotion]);

  const toggleMapType = () => {
    setIsGlobeView(!isGlobeView);
    
    // Simulate map type change with visual feedback
    if (mapRef.current) {
      const currentClass = mapRef.current.querySelector('.bg-gradient-to-br');
      if (currentClass) {
        if (!isGlobeView) {
          currentClass.className = currentClass.className.replace(
            'from-gray-900 via-purple-900/20 to-gray-900',
            'from-blue-900 via-cyan-900/20 to-blue-900'
          );
        } else {
          currentClass.className = currentClass.className.replace(
            'from-blue-900 via-cyan-900/20 to-blue-900',
            'from-gray-900 via-purple-900/20 to-gray-900'
          );
        }
      }
    }
  };

  const focusOnEmotion = (emotion: string) => {
    setSelectedEmotion(selectedEmotion === emotion ? null : emotion);
  };

  const emotionCounts = emotionData?.data?.reduce((acc, item) => {
    acc[item.emotion] = (acc[item.emotion] || 0) + item.count;
    return acc;
  }, {} as Record<string, number>) || {};

  const topEmotions = Object.entries(emotionCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 6);

  return (
    <div className="relative w-full h-96 bg-gray-900 rounded-lg overflow-hidden">
      {/* Map Container */}
      <div ref={mapRef} className="w-full h-full" />
      
      {/* Controls Overlay */}
      <div className="absolute top-4 left-4 space-y-2">
        <Button
          onClick={toggleMapType}
          variant="secondary"
          size="sm"
          className="bg-gray-800/80 backdrop-blur-sm hover:bg-gray-700/80"
        >
          {isGlobeView ? <Map className="w-4 h-4 mr-2" /> : <Globe className="w-4 h-4 mr-2" />}
          {isGlobeView ? "Map View" : "Globe View"}
        </Button>
        
        <Button
          onClick={() => setShowEmotionPanel(!showEmotionPanel)}
          variant="secondary"
          size="sm"
          className="bg-gray-800/80 backdrop-blur-sm hover:bg-gray-700/80"
        >
          <Layers className="w-4 h-4 mr-2" />
          Emotions
        </Button>
      </div>

      {/* Emotion Filter Panel */}
      <AnimatePresence>
        {showEmotionPanel && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="absolute top-4 right-4 w-72"
          >
            <Card className="bg-gray-800/90 backdrop-blur-sm border-gray-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-white flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Global Emotions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  {topEmotions.map(([emotion, count]) => (
                    <div
                      key={emotion}
                      className={`cursor-pointer transition-all capitalize p-2 text-xs rounded-md border ${
                        selectedEmotion === emotion 
                          ? "ring-2 ring-purple-400 bg-purple-600 text-white" 
                          : "hover:bg-gray-600 bg-gray-700 border-gray-600 text-gray-300"
                      }`}
                      style={{
                        backgroundColor: selectedEmotion === emotion 
                          ? emotionColors[emotion as keyof typeof emotionColors] 
                          : undefined,
                        color: selectedEmotion === emotion ? "#000" : undefined
                      }}
                      onClick={() => focusOnEmotion(emotion)}
                    >
                      <div className="flex items-center">
                        <div 
                          className="w-2 h-2 rounded-full mr-1" 
                          style={{ 
                            backgroundColor: emotionColors[emotion as keyof typeof emotionColors] || "#888"
                          }}
                        />
                        {emotion} ({count})
                      </div>
                    </div>
                  ))}
                </div>
                
                {selectedEmotion && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3 p-3 bg-gray-700/50 rounded-lg"
                  >
                    <p className="text-sm text-gray-300">
                      Showing <span className="text-white font-semibold capitalize">{selectedEmotion}</span> memories globally
                    </p>
                    <Button
                      onClick={() => setSelectedEmotion(null)}
                      variant="outline"
                      size="sm"
                      className="mt-2 w-full"
                    >
                      Show All Emotions
                    </Button>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-900/80 flex items-center justify-center">
          <div className="text-center">
            <Globe className="w-8 h-8 animate-spin text-purple-400 mx-auto mb-2" />
            <p className="text-white text-sm">Loading global emotions...</p>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 left-4">
        <Card className="bg-gray-800/80 backdrop-blur-sm border-gray-700">
          <CardContent className="p-3">
            <p className="text-xs text-gray-300 mb-2">Emotion Intensity</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <span className="text-xs text-gray-400">Low</span>
              <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
              <span className="text-xs text-gray-400">High</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}