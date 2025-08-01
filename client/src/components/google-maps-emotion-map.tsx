import { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";
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

// Declare Google Maps types
declare global {
  interface Window {
    google: any;
  }
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
  const [map, setMap] = useState<any>(null);
  const [isGlobeView, setIsGlobeView] = useState(false);
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [showEmotionPanel, setShowEmotionPanel] = useState(true);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(3);
  const [markers, setMarkers] = useState<any[]>([]);

  // Fetch emotion map data
  const { data: emotionData, isLoading } = useQuery<{ data: EmotionData[] }>({
    queryKey: ["/api/emotions/map"],
  });

  useEffect(() => {
    const initGoogleMap = async () => {
      if (!mapRef.current) return;

      try {
        const loader = new Loader({
          apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY!,
          version: "weekly",
          libraries: ["places", "geometry"]
        });

        await loader.load();
        
        const mapInstance = new window.google.maps.Map(mapRef.current, {
          center: { lat: 20, lng: 0 }, // Global center
          zoom: 2,
          mapTypeId: window.google.maps.MapTypeId.ROADMAP,
          styles: [
            {
              featureType: "all",
              elementType: "geometry",
              stylers: [{ color: "#1a1a2e" }]
            },
            {
              featureType: "all",
              elementType: "labels.text.fill",
              stylers: [{ color: "#ffffff" }]
            },
            {
              featureType: "water",
              elementType: "geometry",
              stylers: [{ color: "#0f172a" }]
            },
            {
              featureType: "administrative",
              elementType: "geometry.stroke",
              stylers: [{ color: "#4a5568" }]
            },
            {
              featureType: "landscape",
              elementType: "geometry",
              stylers: [{ color: "#2d3748" }]
            }
          ],
          disableDefaultUI: true,
          zoomControl: false,
          fullscreenControl: false,
          mapTypeControl: false,
          streetViewControl: false,
        });

        setMap(mapInstance);
        setMapLoaded(true);
        setZoomLevel(2);

        // Add click listener for interactivity
        mapInstance.addListener("click", (event: any) => {
          if (event.latLng) {
            const lat = event.latLng.lat();
            const lng = event.latLng.lng();
            console.log(`Clicked at: ${lat.toFixed(4)}, ${lng.toFixed(4)}`);
          }
        });

        // Listen for zoom changes
        mapInstance.addListener("zoom_changed", () => {
          const zoom = mapInstance.getZoom();
          setZoomLevel(zoom);
        });

      } catch (error) {
        console.error("Error loading Google Maps:", error);
        // Fallback to demo visualization if API fails
        if (mapRef.current) {
          mapRef.current.innerHTML = `
            <div class="flex items-center justify-center h-full bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 rounded-lg">
              <div class="text-center p-8">
                <Globe class="w-16 h-16 mx-auto mb-4 text-purple-400" />
                <h3 class="text-xl font-semibold text-white mb-2">Google Maps Loading...</h3>
                <p class="text-gray-400">Initializing interactive map</p>
              </div>
            </div>
          `;
        }
      }
    };

    initGoogleMap();
  }, []);

  // Add emotion markers to the map
  useEffect(() => {
    if (!map || !emotionData?.data) return;

    // Clear existing markers
    markers.forEach(marker => marker.setMap(null));
    setMarkers([]);

    const newMarkers: any[] = [];

    emotionData.data.forEach((emotion) => {
      // Skip if filtering by specific emotion
      if (selectedEmotion && emotion.emotion !== selectedEmotion) return;

      const marker = new window.google.maps.Marker({
        position: { lat: emotion.lat, lng: emotion.lng },
        map: map,
        title: `${emotion.emotion}: ${emotion.count} memories`,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: Math.min(Math.max(emotion.count * 8, 12), 30),
          fillColor: emotionColors[emotion.emotion as keyof typeof emotionColors] || "#888888",
          fillOpacity: 0.8,
          strokeColor: "#ffffff",
          strokeWeight: 2,
        },
        animation: window.google.maps.Animation.DROP,
      });

      // Create info window with custom styling
      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="background: #1a202c; color: white; padding: 12px; border-radius: 8px; min-width: 200px;">
            <h3 style="margin: 0 0 8px 0; font-size: 18px; font-weight: bold; text-transform: capitalize; color: ${emotionColors[emotion.emotion as keyof typeof emotionColors] || '#ffffff'};">
              ${emotion.emotion}
            </h3>
            <p style="margin: 0 0 8px 0; color: #cbd5e0;">
              ${emotion.count} emotional ${emotion.count === 1 ? 'memory' : 'memories'}
            </p>
            <div style="width: 100%; height: 4px; background: ${emotionColors[emotion.emotion as keyof typeof emotionColors] || '#888888'}; border-radius: 2px; margin-top: 8px;"></div>
          </div>
        `
      });

      marker.addListener("click", () => {
        infoWindow.open(map, marker);
      });

      // Add bounce animation on hover
      marker.addListener("mouseover", () => {
        marker.setAnimation(window.google.maps.Animation.BOUNCE);
      });

      marker.addListener("mouseout", () => {
        marker.setAnimation(null);
      });

      newMarkers.push(marker);
    });

    setMarkers(newMarkers);
  }, [map, emotionData, selectedEmotion]);

  const toggleMapType = () => {
    if (!map) return;
    
    setIsGlobeView(!isGlobeView);
    
    if (!isGlobeView) {
      // Switch to satellite view for globe-like experience
      map.setMapTypeId(window.google.maps.MapTypeId.SATELLITE);
      map.setTilt(45);
      if (map.getZoom() > 5) map.setZoom(3);
    } else {
      // Switch back to styled map
      map.setMapTypeId(window.google.maps.MapTypeId.ROADMAP);
      map.setTilt(0);
    }
  };

  const handleZoom = (direction: 'in' | 'out') => {
    if (!map) return;
    
    const currentZoom = map.getZoom();
    const newZoom = direction === 'in' 
      ? Math.min(currentZoom + 2, 18) 
      : Math.max(currentZoom - 2, 1);
    
    map.setZoom(newZoom);
    setZoomLevel(newZoom);
  };

  const focusOnEmotion = (emotion: string) => {
    const newSelectedEmotion = selectedEmotion === emotion ? null : emotion;
    setSelectedEmotion(newSelectedEmotion);
    
    // If an emotion is selected, find and focus on the first location with that emotion
    if (newSelectedEmotion && emotionData?.data && map) {
      const emotionLocation = emotionData.data.find(item => item.emotion === newSelectedEmotion);
      if (emotionLocation) {
        map.setCenter({ lat: emotionLocation.lat, lng: emotionLocation.lng });
        map.setZoom(8);
        
        // Highlight the specific emotion markers
        markers.forEach(marker => {
          const title = marker.getTitle();
          if (title.includes(newSelectedEmotion)) {
            marker.setAnimation(window.google.maps.Animation.BOUNCE);
            setTimeout(() => marker.setAnimation(null), 2000);
          }
        });
      }
    } else if (!newSelectedEmotion && map) {
      // Reset to global view when clearing filter
      map.setCenter({ lat: 20, lng: 0 });
      map.setZoom(2);
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