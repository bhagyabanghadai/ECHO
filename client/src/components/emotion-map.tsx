import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RotateCcw, ZoomIn, Filter } from "lucide-react";

interface EmotionData {
  emotion: string;
  count: number;
  lat: number;
  lng: number;
  locationName: string;
}

interface EmotionMapProps {
  data: EmotionData[];
}

const emotionColors = {
  nostalgia: "bg-purple-400",
  love: "bg-pink-400",
  peace: "bg-cyan-400",
  joy: "bg-yellow-400",
  warmth: "bg-orange-400",
};

const emotionEmojis = {
  nostalgia: "💜",
  love: "❤️",
  peace: "😌",
  joy: "✨",
  warmth: "💕",
};

export default function EmotionMap({ data }: EmotionMapProps) {
  const [selectedMemory, setSelectedMemory] = useState<EmotionData | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const handleMemoryHover = (memory: EmotionData, event: React.MouseEvent) => {
    setSelectedMemory(memory);
    setTooltipPosition({ x: event.clientX, y: event.clientY });
  };

  const handleMemoryLeave = () => {
    setSelectedMemory(null);
  };

  // Convert lat/lng to map position (simplified projection)
  const getMapPosition = (lat: number, lng: number) => {
    // Simple linear projection for demo
    const x = ((lng + 180) / 360) * 100;
    const y = ((90 - lat) / 180) * 100;
    return { x: Math.max(5, Math.min(95, x)), y: Math.max(5, Math.min(95, y)) };
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="relative bg-gradient-to-br from-gray-900 to-black rounded-3xl p-8 glass-morphism">
        {/* World map representation */}
        <div className="relative h-96 overflow-hidden rounded-2xl bg-black/50">
          {/* Simplified world map background */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-1/4 left-1/4 w-16 h-12 border border-gray-600 rounded-lg" />
            <div className="absolute top-1/3 left-1/2 w-20 h-16 border border-gray-600 rounded-lg" />
            <div className="absolute bottom-1/3 left-1/5 w-24 h-20 border border-gray-600 rounded-lg" />
          </div>

          {/* Memory pulses */}
          {data.map((memory, index) => {
            const position = getMapPosition(memory.lat, memory.lng);
            const colorClass = emotionColors[memory.emotion as keyof typeof emotionColors] || "bg-gray-400";
            
            return (
              <motion.div
                key={index}
                className={`absolute w-4 h-4 ${colorClass} rounded-full animate-pulse-slow memory-pulse cursor-pointer`}
                style={{
                  top: `${position.y}%`,
                  left: `${position.x}%`,
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ scale: 1.5 }}
                onMouseEnter={(e) => handleMemoryHover(memory, e)}
                onMouseLeave={handleMemoryLeave}
              >
                <motion.div
                  className="absolute inset-0 rounded-full"
                  animate={{
                    scale: [1, 3, 1],
                    opacity: [0.8, 0, 0.8],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: index * 0.5,
                  }}
                  style={{
                    background: `radial-gradient(circle, ${
                      memory.emotion === 'love' ? '#f472b6' :
                      memory.emotion === 'peace' ? '#22d3ee' :
                      memory.emotion === 'nostalgia' ? '#a855f7' :
                      memory.emotion === 'joy' ? '#facc15' : '#fb923c'
                    } 0%, transparent 70%)`,
                  }}
                />
              </motion.div>
            );
          })}

          {/* Legend */}
          <div className="absolute bottom-4 left-4 glass-morphism rounded-xl p-4">
            <h4 className="text-sm font-medium mb-2 text-white">Live Emotions</h4>
            <div className="space-y-1 text-xs">
              {Object.entries(emotionColors).map(([emotion, colorClass]) => (
                <div key={emotion} className="flex items-center gap-2">
                  <div className={`w-2 h-2 ${colorClass} rounded-full`} />
                  <span className="text-gray-400 capitalize">
                    {emotionEmojis[emotion as keyof typeof emotionEmojis]} {emotion}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Tooltip */}
          {selectedMemory && (
            <motion.div
              className="fixed glass-morphism rounded-xl p-4 pointer-events-none z-50 max-w-xs"
              style={{
                left: tooltipPosition.x + 10,
                top: tooltipPosition.y - 10,
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <p className="text-sm text-gray-400 mb-1">
                Echoed in <span className="text-white">{selectedMemory.locationName}</span>
              </p>
              <p className="text-white font-medium">
                {emotionEmojis[selectedMemory.emotion as keyof typeof emotionEmojis]} {selectedMemory.emotion}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {selectedMemory.count} {selectedMemory.count === 1 ? 'memory' : 'memories'}
              </p>
            </motion.div>
          )}
        </div>

        {/* Map controls */}
        <div className="flex justify-center mt-6 gap-4">
          <Button
            variant="ghost"
            size="sm"
            className="glass-morphism px-4 py-2 rounded-full text-sm hover:bg-white/10 transition-all"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Rotate Globe
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="glass-morphism px-4 py-2 rounded-full text-sm hover:bg-white/10 transition-all"
          >
            <ZoomIn className="w-4 h-4 mr-2" />
            Zoom In
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="glass-morphism px-4 py-2 rounded-full text-sm hover:bg-white/10 transition-all"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filter by Emotion
          </Button>
        </div>
      </div>
    </div>
  );
}
