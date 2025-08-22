import { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Globe, Map, Layers, Filter, MapPin, Zap, RotateCcw, Search, Maximize, Minimize, Navigation, Crosshair } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { useGeolocation } from "@/hooks/use-geolocation";

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
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [map, setMap] = useState<any>(null);
  const [searchBox, setSearchBox] = useState<any>(null);
  const [isGlobeView, setIsGlobeView] = useState(false);
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [showEmotionPanel, setShowEmotionPanel] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(3);
  const [markers, setMarkers] = useState<any[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  
  const { hasLocation, latitude, longitude } = useGeolocation();

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
        
        // Verify Google Maps loaded successfully
        if (!window.google || !window.google.maps) {
          throw new Error("Google Maps failed to load properly");
        }
        
        // Start with user location if available, otherwise global center
        const initialCenter = hasLocation && latitude && longitude 
          ? { lat: latitude, lng: longitude }
          : { lat: 20, lng: 0 };
        const initialZoom = hasLocation ? 12 : 2;

        const mapInstance = new window.google.maps.Map(mapRef.current, {
          center: initialCenter,
          zoom: initialZoom,
          mapTypeId: window.google.maps.MapTypeId.ROADMAP,
          disableDefaultUI: true,
          zoomControl: true,
          zoomControlOptions: {
            position: window.google.maps.ControlPosition.RIGHT_CENTER
          },
          fullscreenControl: false,
          mapTypeControl: true,
          mapTypeControlOptions: {
            position: window.google.maps.ControlPosition.TOP_LEFT,
            style: window.google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
            mapTypeIds: [
              window.google.maps.MapTypeId.ROADMAP,
              window.google.maps.MapTypeId.SATELLITE,
              window.google.maps.MapTypeId.HYBRID,
              window.google.maps.MapTypeId.TERRAIN
            ]
          },
          streetViewControl: true,
          streetViewControlOptions: {
            position: window.google.maps.ControlPosition.RIGHT_TOP
          },
          gestureHandling: 'greedy',
          minZoom: 2,
          maxZoom: 18,
          restriction: {
            latLngBounds: {
              north: 85,
              south: -85,
              west: -180,
              east: 180
            }
          },
          scaleControl: true,
          rotateControl: false,
          tilt: 0
        });

        setMap(mapInstance);
        setMapLoaded(true);
        setZoomLevel(initialZoom);

        // Set user location if available
        if (hasLocation && latitude && longitude) {
          setUserLocation({ lat: latitude, lng: longitude });
          
          // Add user location marker
          new window.google.maps.Marker({
            position: { lat: latitude, lng: longitude },
            map: mapInstance,
            title: "Your Location",
            icon: {
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 10,
              fillColor: "#3b82f6",
              fillOpacity: 1,
              strokeColor: "#ffffff",
              strokeWeight: 3,
            },
            animation: window.google.maps.Animation.DROP,
          });
        }

        // Initialize search functionality with Places Autocomplete (modern alternative to SearchBox)
        if (searchInputRef.current) {
          const autocomplete = new window.google.maps.places.Autocomplete(searchInputRef.current, {
            types: ['establishment', 'geocode'],
            fields: ['place_id', 'geometry', 'name', 'formatted_address']
          });
          
          autocomplete.addListener("place_changed", () => {
            const place = autocomplete.getPlace();
            if (!place.geometry || !place.geometry.location) return;

            // Focus on the searched location
            mapInstance.setCenter(place.geometry.location);
            mapInstance.setZoom(15);
            
            // Search for memories near this location
            searchMemoriesNearLocation(place.geometry.location.lat(), place.geometry.location.lng());
            
            // Update search query display
            setSearchQuery(place.name || place.formatted_address || '');
          });
        }

        // Add click listener for interactivity
        mapInstance.addListener("click", (event: any) => {
          if (event.latLng) {
            const lat = event.latLng.lat();
            const lng = event.latLng.lng();
            searchMemoriesNearLocation(lat, lng);
          }
        });

        // Listen for zoom changes
        mapInstance.addListener("zoom_changed", () => {
          const zoom = mapInstance.getZoom();
          setZoomLevel(zoom);
        });

      } catch (error: any) {
        console.error("Error loading Google Maps:", error);
        // Fallback to demo visualization if API fails
        if (mapRef.current) {
          mapRef.current.innerHTML = `
            <div class="flex items-center justify-center h-full bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 rounded-lg">
              <div class="text-center p-8">
                <div class="w-16 h-16 mx-auto mb-4 text-purple-400">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 class="text-xl font-semibold text-white mb-2">Google Maps API Error</h3>
                <p class="text-gray-400">Please check your API key configuration</p>
                <p class="text-sm text-red-400 mt-2">Error: ${error?.message || 'Failed to load Google Maps'}</p>
              </div>
            </div>
          `;
        }
        setMapLoaded(false);
      }
    };

    initGoogleMap();
  }, [hasLocation, latitude, longitude]);

  // Function to search for memories near a location
  const searchMemoriesNearLocation = async (lat: number, lng: number) => {
    console.log(`Searching for memories near: ${lat.toFixed(4)}, ${lng.toFixed(4)}`);
    
    try {
      // Query backend for nearby memories
      const response = await fetch(`/api/memories/nearby/${lat}/${lng}?radius=10000`);
      if (response.ok) {
        const data = await response.json();
        console.log(`Found ${data.data?.length || 0} memories nearby`);
        
        // Create search result markers
        if (data.data && data.data.length > 0) {
          data.data.forEach((memory: any) => {
            const searchMarker = new window.google.maps.Marker({
              position: { lat: memory.latitude, lng: memory.longitude },
              map: map,
              title: `Memory: ${memory.title}`,
              icon: {
                path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                scale: 6,
                fillColor: "#10b981", // Green for search results
                fillOpacity: 1,
                strokeColor: "#ffffff",
                strokeWeight: 2,
              },
              animation: window.google.maps.Animation.BOUNCE,
            });
            
            // Remove bounce after 3 seconds
            setTimeout(() => {
              if (searchMarker.getAnimation() !== null) {
                searchMarker.setAnimation(null);
              }
            }, 3000);
          });
        }
      }
    } catch (error) {
      console.error("Error searching for memories:", error);
    }
    
    // Also highlight existing emotion markers within radius
    markers.forEach(marker => {
      const markerPos = marker.getPosition();
      if (markerPos && window.google?.maps?.geometry) {
        const distance = window.google.maps.geometry.spherical.computeDistanceBetween(
          new window.google.maps.LatLng(lat, lng),
          markerPos
        );
        
        if (distance < 50000) { // 50km radius
          marker.setAnimation(window.google.maps.Animation.BOUNCE);
          setTimeout(() => marker.setAnimation(null), 2000);
        }
      }
    });
  };

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

      // Ensure we have valid coordinates
      const lat = typeof emotion.lat === 'number' ? emotion.lat : parseFloat(emotion.lat);
      const lng = typeof emotion.lng === 'number' ? emotion.lng : parseFloat(emotion.lng);
      
      // Skip invalid coordinates
      if (isNaN(lat) || isNaN(lng)) {
        console.warn(`Invalid coordinates for emotion ${emotion.emotion}:`, emotion.lat, emotion.lng);
        return;
      }
      
      const marker = new window.google.maps.Marker({
        position: { lat, lng },
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

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    
    // Trigger a resize event after fullscreen toggle to ensure map redraws correctly
    setTimeout(() => {
      if (map && window.google?.maps?.event) {
        window.google.maps.event.trigger(map, 'resize');
      }
    }, 100);
  };

  const goToUserLocation = () => {
    if (map && userLocation) {
      map.setCenter(userLocation);
      map.setZoom(15);
    } else if (map && hasLocation && latitude && longitude) {
      const newLocation = { lat: latitude, lng: longitude };
      setUserLocation(newLocation);
      map.setCenter(newLocation);
      map.setZoom(15);
    }
  };

  const resetMapView = () => {
    if (map) {
      map.setCenter({ lat: 20, lng: 0 });
      map.setZoom(3);
      map.setMapTypeId(window.google.maps.MapTypeId.ROADMAP);
      map.setTilt(0);
      setIsGlobeView(false);
      setZoomLevel(3);
    }
  };

  const addHeatMapLayer = () => {
    if (!map || !emotionData?.data || !window.google?.maps?.visualization) return;
    
    const heatmapData = emotionData.data.map(emotion => {
      const lat = typeof emotion.lat === 'number' ? emotion.lat : parseFloat(emotion.lat) || 0;
      const lng = typeof emotion.lng === 'number' ? emotion.lng : parseFloat(emotion.lng) || 0;
      
      return {
        location: new window.google.maps.LatLng(lat, lng),
        weight: emotion.count
      };
    });

    const heatmap = new window.google.maps.visualization.HeatmapLayer({
      data: heatmapData,
      map: map,
      radius: 50,
      opacity: 0.6
    });

    return heatmap;
  };

  const focusOnEmotion = (emotion: string) => {
    const newSelectedEmotion = selectedEmotion === emotion ? null : emotion;
    setSelectedEmotion(newSelectedEmotion);
    
    // If an emotion is selected, find and focus on the first location with that emotion
    if (newSelectedEmotion && emotionData?.data && map) {
      const emotionLocation = emotionData.data.find((item: any) => item.emotion === newSelectedEmotion);
      if (emotionLocation) {
        map.setCenter({ lat: emotionLocation.lat, lng: emotionLocation.lng });
        map.setZoom(8);
        
        // Highlight the specific emotion markers
        markers.forEach((marker: any) => {
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

  const emotionCounts = emotionData?.data?.reduce((acc: any, item: any) => {
    acc[item.emotion] = (acc[item.emotion] || 0) + item.count;
    return acc;
  }, {} as Record<string, number>) || {};

  const topEmotions = Object.entries(emotionCounts)
    .sort(([,a], [,b]) => (b as number) - (a as number))
    .slice(0, 6);

  return (
    <div className={`relative bg-gray-900 rounded-lg overflow-hidden transition-all duration-300 ${
      isFullscreen 
        ? 'fixed inset-0 z-50 rounded-none w-screen h-screen' 
        : 'w-full h-96'
    }`}>
      {/* Search Bar */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 w-80">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            ref={searchInputRef}
            type="text"
            placeholder="Search for places or memories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/90 backdrop-blur-sm border-gray-300 focus:border-purple-500 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* Interactive Map Container */}
      <div 
        ref={mapRef} 
        className={`w-full transition-all duration-300 ${
          isFullscreen ? 'h-screen' : 'h-full'
        }`} 
      />
      
      {/* Control Panel - Top Left */}
      <div className="absolute top-20 left-4 space-y-2">
        <Button
          onClick={toggleMapType}
          variant="secondary"
          size="sm"
          className="bg-white/90 backdrop-blur-sm hover:bg-white text-gray-900 border-gray-300 shadow-lg"
        >
          {isGlobeView ? <Map className="w-4 h-4 mr-2" /> : <Globe className="w-4 h-4 mr-2" />}
          {isGlobeView ? "Map" : "Satellite"}
        </Button>
        
        <Button
          onClick={goToUserLocation}
          variant="secondary"
          size="sm"
          className="bg-white/90 backdrop-blur-sm hover:bg-white text-gray-900 border-gray-300 shadow-lg"
          disabled={!hasLocation}
        >
          <Navigation className="w-4 h-4 mr-2" />
          My Location
        </Button>
        
        <Button
          onClick={toggleFullscreen}
          variant="secondary"
          size="sm"
          className="bg-white/90 backdrop-blur-sm hover:bg-white text-gray-900 border-gray-300 shadow-lg"
        >
          {isFullscreen ? <Minimize className="w-4 h-4 mr-2" /> : <Maximize className="w-4 h-4 mr-2" />}
          {isFullscreen ? "Exit" : "Fullscreen"}
        </Button>
        
        <Button
          onClick={() => setShowEmotionPanel(!showEmotionPanel)}
          variant={showEmotionPanel ? "default" : "secondary"}
          size="sm"
          className={`backdrop-blur-sm shadow-lg transition-all ${
            showEmotionPanel 
              ? 'bg-purple-600 hover:bg-purple-700 text-white border-purple-600' 
              : 'bg-white/90 hover:bg-white text-gray-900 border-gray-300'
          }`}
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
            className={`absolute top-20 right-4 ${isFullscreen ? 'w-96' : 'w-80'}`}
          >
            <Card className="bg-white/95 backdrop-blur-sm border-gray-300 shadow-xl">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg text-gray-900 flex items-center gap-2">
                    <Filter className="w-5 h-5" />
                    Global Emotions Live
                  </CardTitle>
                  <Button
                    onClick={() => setShowEmotionPanel(false)}
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700"
                  >
                    ×
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  {topEmotions.map(([emotion, count]) => (
                    <div
                      key={emotion}
                      className={`cursor-pointer transition-all capitalize p-3 text-sm rounded-lg border ${
                        selectedEmotion === emotion 
                          ? "ring-2 ring-purple-400 bg-purple-100 text-purple-900 border-purple-400" 
                          : "hover:bg-gray-100 bg-gray-50 border-gray-300 text-gray-700 hover:border-gray-400"
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
                        <span className="text-xs bg-gray-200 px-2 py-1 rounded-full">
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
                    className="p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg border border-purple-300"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="w-4 h-4 text-purple-400" />
                      <span className="text-gray-900 font-semibold capitalize">
                        {selectedEmotion} Filter Active
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mb-3">
                      Viewing global {selectedEmotion} memories and emotional patterns.
                    </p>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => setSelectedEmotion(null)}
                        variant="outline"
                        size="sm"
                        className="flex-1 border-purple-300 text-purple-700 hover:bg-purple-50"
                      >
                        Clear Filter
                      </Button>
                      <Button
                        onClick={() => handleZoom('in')}
                        variant="outline"
                        size="sm"
                        className="border-purple-300 text-purple-700 hover:bg-purple-50"
                      >
                        <MapPin className="w-4 h-4" />
                      </Button>
                    </div>
                  </motion.div>
                )}
                
                {/* Real-time Stats */}
                <div className="border-t border-gray-300 pt-3">
                  <div className="flex justify-between text-xs text-gray-600 mb-2">
                    <span>Live Updates</span>
                    <span className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      Active
                    </span>
                  </div>
                  <div className="text-sm text-gray-900">
                    <span className="font-bold">{emotionData?.data?.length || 0}</span> cities
                    <span className="text-gray-600 ml-2">•</span>
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
        <Card className="bg-white/90 backdrop-blur-sm border-gray-300 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span className="text-gray-700">Low</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                <span className="text-gray-700">Medium</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-purple-400 rounded-full"></div>
                <span className="text-gray-700">High</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Indicators - Bottom Right */}
      <div className="absolute bottom-4 right-4 space-y-2">
        <Card className="bg-white/90 backdrop-blur-sm border-gray-300 shadow-lg">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 text-xs text-gray-700">
              <Crosshair className="w-3 h-3" />
              <span>Zoom: {zoomLevel}x</span>
            </div>
          </CardContent>
        </Card>
        
        {userLocation && (
          <Card className="bg-white/90 backdrop-blur-sm border-gray-300 shadow-lg">
            <CardContent className="p-3">
              <div className="flex items-center gap-2 text-xs text-gray-700">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span>Location Active</span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}