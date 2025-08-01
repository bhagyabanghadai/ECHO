import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, Map, Layers, Filter, MapPin, Zap, RotateCcw } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";

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

export function GoogleMapsEmotionMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isGlobeView, setIsGlobeView] = useState(false);
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [showEmotionPanel, setShowEmotionPanel] = useState(true);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(3);

  // Fetch emotion map data
  const { data: emotionData, isLoading } = useQuery<{ data: EmotionData[] }>({
    queryKey: ["/api/emotions/map"],
  });

  useEffect(() => {
    const createInteractiveMap = () => {
      if (mapRef.current) {
        setMapLoaded(true);
        
        // Create a highly interactive emotion visualization
        mapRef.current.innerHTML = `
          <div class="relative w-full h-full bg-gradient-to-br from-gray-900 via-purple-900/30 to-blue-900/30 rounded-lg overflow-hidden">
            <!-- Globe/Map Background -->
            <div class="absolute inset-0">
              <!-- Grid pattern for interactivity -->
              <div class="absolute inset-0 opacity-10">
                <div class="grid grid-cols-12 grid-rows-8 h-full w-full">
                  ${Array.from({length: 96}, (_, i) => 
                    `<div class="border border-gray-600 hover:bg-purple-400/20 transition-colors cursor-pointer"></div>`
                  ).join('')}
                </div>
              </div>
              
              <!-- Continent Outlines -->
              <svg class="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 1000 500">
                <!-- North America -->
                <path d="M150,100 Q200,80 250,120 L280,180 Q260,220 200,200 L120,160 Z" 
                      stroke="#6366f1" stroke-width="2" fill="none" class="continent-outline"/>
                <!-- Europe -->
                <path d="M450,120 Q480,100 520,130 L540,160 Q520,180 480,170 L440,150 Z" 
                      stroke="#6366f1" stroke-width="2" fill="none" class="continent-outline"/>
                <!-- Asia -->
                <path d="M550,100 Q650,80 750,120 L800,200 Q780,240 700,220 L580,180 Z" 
                      stroke="#6366f1" stroke-width="2" fill="none" class="continent-outline"/>
                <!-- Africa -->
                <path d="M420,180 Q450,170 480,190 L500,280 Q480,320 440,300 L400,240 Z" 
                      stroke="#6366f1" stroke-width="2" fill="none" class="continent-outline"/>
                <!-- South America -->
                <path d="M250,240 Q270,230 290,250 L300,350 Q280,380 250,370 L220,320 Z" 
                      stroke="#6366f1" stroke-width="2" fill="none" class="continent-outline"/>
                <!-- Australia -->
                <path d="M700,320 Q730,310 760,330 L780,360 Q760,380 730,375 L700,350 Z" 
                      stroke="#6366f1" stroke-width="2" fill="none" class="continent-outline"/>
              </svg>
            </div>
            
            <!-- Interactive Emotion Points -->
            <div class="absolute inset-0">
              <!-- Major Cities with Emotions -->
              <div class="absolute top-1/4 left-1/5 group cursor-pointer">
                <div class="w-4 h-4 bg-yellow-400 rounded-full animate-pulse shadow-lg shadow-yellow-400/50 hover:scale-150 transition-transform">
                  <div class="absolute -inset-2 bg-yellow-400/30 rounded-full animate-ping"></div>
                </div>
                <div class="hidden group-hover:block absolute top-6 left-1/2 transform -translate-x-1/2 bg-black/90 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
                  Joy in New York<br><span class="text-yellow-400">234 memories</span>
                </div>
              </div>
              
              <div class="absolute top-1/3 left-1/2 group cursor-pointer">
                <div class="w-3 h-3 bg-purple-400 rounded-full animate-pulse shadow-lg shadow-purple-400/50 hover:scale-150 transition-transform">
                  <div class="absolute -inset-2 bg-purple-400/30 rounded-full animate-ping"></div>
                </div>
                <div class="hidden group-hover:block absolute top-6 left-1/2 transform -translate-x-1/2 bg-black/90 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
                  Nostalgia in Paris<br><span class="text-purple-400">156 memories</span>
                </div>
              </div>
              
              <div class="absolute top-1/2 right-1/4 group cursor-pointer">
                <div class="w-5 h-5 bg-pink-400 rounded-full animate-pulse shadow-lg shadow-pink-400/50 hover:scale-150 transition-transform">
                  <div class="absolute -inset-2 bg-pink-400/30 rounded-full animate-ping"></div>
                </div>
                <div class="hidden group-hover:block absolute top-6 left-1/2 transform -translate-x-1/2 bg-black/90 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
                  Love in Tokyo<br><span class="text-pink-400">387 memories</span>
                </div>
              </div>
              
              <div class="absolute bottom-1/3 left-1/3 group cursor-pointer">
                <div class="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50 hover:scale-150 transition-transform">
                  <div class="absolute -inset-2 bg-green-400/30 rounded-full animate-ping"></div>
                </div>
                <div class="hidden group-hover:block absolute top-6 left-1/2 transform -translate-x-1/2 bg-black/90 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
                  Calm in Sydney<br><span class="text-green-400">92 memories</span>
                </div>
              </div>
              
              <div class="absolute top-2/3 left-2/5 group cursor-pointer">
                <div class="w-4 h-4 bg-orange-400 rounded-full animate-pulse shadow-lg shadow-orange-400/50 hover:scale-150 transition-transform">
                  <div class="absolute -inset-2 bg-orange-400/30 rounded-full animate-ping"></div>
                </div>
                <div class="hidden group-hover:block absolute top-6 left-1/2 transform -translate-x-1/2 bg-black/90 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
                  Excitement in Rio<br><span class="text-orange-400">178 memories</span>
                </div>
              </div>
              
              <!-- Additional smaller emotion points -->
              <div class="absolute top-1/5 right-1/3 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <div class="absolute bottom-1/4 right-1/5 w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
              <div class="absolute top-3/4 left-1/6 w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></div>
              <div class="absolute top-1/6 left-3/5 w-2 h-2 bg-rose-400 rounded-full animate-pulse"></div>
            </div>
            
            <!-- Central Globe Indicator -->
            <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div class="w-16 h-16 border-2 border-purple-400/30 rounded-full flex items-center justify-center">
                <div class="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full opacity-60 animate-pulse"></div>
              </div>
            </div>
            
            <!-- Interactive Overlay -->
            <div class="absolute inset-0 bg-black/10 hover:bg-black/5 transition-colors cursor-crosshair"></div>
          </div>
        `;
        
        // Add click interactions
        const mapElement = mapRef.current.querySelector('.cursor-crosshair');
        if (mapElement) {
          mapElement.addEventListener('click', (e: any) => {
            const rect = mapElement.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            console.log(`Clicked at: ${x.toFixed(1)}%, ${y.toFixed(1)}%`);
            
            // Add temporary emotion point at click location
            const newPoint = document.createElement('div');
            newPoint.className = 'absolute w-3 h-3 bg-white rounded-full animate-ping';
            newPoint.style.left = `${x}%`;
            newPoint.style.top = `${y}%`;
            mapElement.appendChild(newPoint);
            
            // Remove after animation
            setTimeout(() => newPoint.remove(), 2000);
          });
        }
      }
    };

    createInteractiveMap();
  }, []);

  const toggleMapType = () => {
    setIsGlobeView(!isGlobeView);
    
    if (mapRef.current) {
      const bgElement = mapRef.current.querySelector('.bg-gradient-to-br');
      if (bgElement) {
        if (!isGlobeView) {
          // Switch to globe view (satellite-like)
          bgElement.className = bgElement.className.replace(
            'from-gray-900 via-purple-900/30 to-blue-900/30',
            'from-blue-900 via-indigo-900/50 to-black'
          );
        } else {
          // Switch back to map view
          bgElement.className = bgElement.className.replace(
            'from-blue-900 via-indigo-900/50 to-black',
            'from-gray-900 via-purple-900/30 to-blue-900/30'
          );
        }
      }
    }
  };

  const handleZoom = (direction: 'in' | 'out') => {
    const newZoom = direction === 'in' ? Math.min(zoomLevel + 1, 10) : Math.max(zoomLevel - 1, 1);
    setZoomLevel(newZoom);
    
    // Simulate zoom effect
    if (mapRef.current) {
      const scaleValue = 0.8 + (newZoom * 0.1);
      mapRef.current.style.transform = `scale(${scaleValue})`;
      mapRef.current.style.transition = 'transform 0.3s ease';
    }
  };

  const focusOnEmotion = (emotion: string) => {
    setSelectedEmotion(selectedEmotion === emotion ? null : emotion);
    
    // Simulate filtering effect
    if (mapRef.current) {
      const emotionPoints = mapRef.current.querySelectorAll('[class*="bg-"]');
      emotionPoints.forEach((point: any) => {
        if (selectedEmotion === emotion) {
          // Show only selected emotion
          const pointColor = emotionColors[emotion as keyof typeof emotionColors];
          if (point.className.includes(pointColor)) {
            point.style.opacity = '1';
            point.style.transform = 'scale(1.5)';
          } else {
            point.style.opacity = '0.2';
            point.style.transform = 'scale(0.8)';
          }
        } else {
          // Reset all points
          point.style.opacity = '1';
          point.style.transform = 'scale(1)';
        }
      });
    }
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
      {/* Interactive Map Container */}
      <div ref={mapRef} className="w-full h-full" />
      
      {/* Control Panel - Top Left */}
      <div className="absolute top-4 left-4 space-y-2">
        <Button
          onClick={toggleMapType}
          variant="secondary"
          size="sm"
          className="bg-gray-800/90 backdrop-blur-sm hover:bg-gray-700/90 text-white border-purple-500/30"
        >
          {isGlobeView ? <Map className="w-4 h-4 mr-2" /> : <Globe className="w-4 h-4 mr-2" />}
          {isGlobeView ? "Map" : "Globe"}
        </Button>
        
        <div className="flex gap-1">
          <Button
            onClick={() => handleZoom('in')}
            variant="secondary"
            size="sm"
            className="bg-gray-800/90 backdrop-blur-sm hover:bg-gray-700/90 text-white border-purple-500/30 px-2"
          >
            +
          </Button>
          <Button
            onClick={() => handleZoom('out')}
            variant="secondary"
            size="sm"
            className="bg-gray-800/90 backdrop-blur-sm hover:bg-gray-700/90 text-white border-purple-500/30 px-2"
          >
            -
          </Button>
        </div>
        
        <Button
          onClick={() => setShowEmotionPanel(!showEmotionPanel)}
          variant="secondary"
          size="sm"
          className="bg-gray-800/90 backdrop-blur-sm hover:bg-gray-700/90 text-white border-purple-500/30"
        >
          <Layers className="w-4 h-4 mr-2" />
          Emotions
        </Button>
      </div>

      {/* Emotion Filter Panel - Top Right */}
      <AnimatePresence>
        {showEmotionPanel && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="absolute top-4 right-4 w-80"
          >
            <Card className="bg-gray-800/95 backdrop-blur-sm border-gray-700/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-white flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Global Emotions Live
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  {topEmotions.map(([emotion, count]) => (
                    <div
                      key={emotion}
                      className={`cursor-pointer transition-all capitalize p-3 text-sm rounded-lg border ${
                        selectedEmotion === emotion 
                          ? "ring-2 ring-purple-400 bg-purple-600/80 text-white border-purple-400" 
                          : "hover:bg-gray-600/80 bg-gray-700/80 border-gray-600 text-gray-300 hover:border-gray-500"
                      }`}
                      onClick={() => focusOnEmotion(emotion)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div 
                            className="w-3 h-3 rounded-full mr-2 shadow-lg" 
                            style={{ 
                              backgroundColor: emotionColors[emotion as keyof typeof emotionColors] || "#888",
                              boxShadow: `0 0 8px ${emotionColors[emotion as keyof typeof emotionColors]}50`
                            }}
                          />
                          <span className="font-medium">{emotion}</span>
                        </div>
                        <span className="text-xs bg-gray-800/60 px-2 py-1 rounded-full">
                          {count}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                
                {selectedEmotion && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-lg border border-purple-500/30"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="w-4 h-4 text-purple-400" />
                      <span className="text-white font-semibold capitalize">
                        {selectedEmotion} Filter Active
                      </span>
                    </div>
                    <p className="text-sm text-gray-300 mb-3">
                      Viewing global {selectedEmotion} memories and emotional patterns.
                    </p>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => setSelectedEmotion(null)}
                        variant="outline"
                        size="sm"
                        className="flex-1 border-purple-500/50 text-purple-300 hover:bg-purple-500/20"
                      >
                        Clear Filter
                      </Button>
                      <Button
                        onClick={() => handleZoom('in')}
                        variant="outline"
                        size="sm"
                        className="border-purple-500/50 text-purple-300 hover:bg-purple-500/20"
                      >
                        <MapPin className="w-4 h-4" />
                      </Button>
                    </div>
                  </motion.div>
                )}
                
                {/* Real-time Stats */}
                <div className="border-t border-gray-600 pt-3">
                  <div className="flex justify-between text-xs text-gray-400 mb-2">
                    <span>Live Updates</span>
                    <span className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      Active
                    </span>
                  </div>
                  <div className="text-sm text-white">
                    <span className="font-bold">{emotionData?.data?.length || 0}</span> cities
                    <span className="text-gray-400 ml-2">•</span>
                    <span className="font-bold ml-2">{Object.values(emotionCounts).reduce((a, b) => a + b, 0)}</span> memories
                  </div>
                </div>
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

      {/* Map Legend - Bottom Left */}
      <div className="absolute bottom-4 left-4">
        <Card className="bg-gray-800/90 backdrop-blur-sm border-gray-700/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                <span className="text-gray-300">Low</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
                <span className="text-gray-300">Medium</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-purple-400 rounded-full animate-pulse"></div>
                <span className="text-gray-300">High</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Zoom Level Indicator - Bottom Right */}
      <div className="absolute bottom-4 right-4">
        <Card className="bg-gray-800/90 backdrop-blur-sm border-gray-700/50">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 text-xs text-gray-300">
              <RotateCcw className="w-3 h-3" />
              <span>Zoom: {zoomLevel}x</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}