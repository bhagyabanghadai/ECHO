import { motion } from "framer-motion";
import { useRef, useEffect, useState } from "react";

interface MemoryPulse {
  id: string;
  x: number;
  y: number;
  emotion: string;
  delay: number;
  location: string;
  content: string;
}

export default function HeroGlobe() {
  const globeRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [selectedMemory, setSelectedMemory] = useState<MemoryPulse | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const memoryPulses: MemoryPulse[] = [
    { id: "1", x: 25, y: 30, emotion: "love", delay: 0, location: "Paris, France", content: "Warmth of love near the Eiffel Tower..." },
    { id: "2", x: 70, y: 60, emotion: "peace", delay: 1, location: "London, UK", content: "Found peace by the Thames today..." },
    { id: "3", x: 45, y: 25, emotion: "nostalgia", delay: 2, location: "Shibuya, Tokyo", content: "Missing the cherry blossoms..." },
    { id: "4", x: 80, y: 40, emotion: "joy", delay: 0.5, location: "Sydney, Australia", content: "Pure joy watching the sunrise..." },
    { id: "5", x: 30, y: 70, emotion: "warmth", delay: 1.5, location: "Central Park, NYC", content: "Love overflowing in the heart of the city..." },
  ];

  const emotionColors = {
    love: "bg-pink-400",
    peace: "bg-cyan-400",
    nostalgia: "bg-purple-400",
    joy: "bg-yellow-400",
    warmth: "bg-orange-400",
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (globeRef.current) {
        const rect = globeRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        setMousePosition({
          x: (e.clientX - centerX) / 10,
          y: (e.clientY - centerY) / 10,
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <motion.div 
      ref={globeRef}
      className="relative mx-auto mb-12 w-80 h-80 md:w-96 md:h-96"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <motion.div
        className="w-full h-full emotion-orb animate-float memory-pulse cursor-pointer bg-gradient-to-br from-purple-600 to-purple-400"
        style={{
          transform: `rotateY(${mousePosition.x}deg) rotateX(${-mousePosition.y}deg)`,
        }}
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        {/* Memory pulses on globe */}
        {memoryPulses.map((pulse) => (
          <motion.div
            key={pulse.id}
            className={`absolute w-4 h-4 ${emotionColors[pulse.emotion as keyof typeof emotionColors]} rounded-full animate-pulse-slow cursor-pointer`}
            style={{
              top: `${pulse.y}%`,
              left: `${pulse.x}%`,
              animationDelay: `${pulse.delay}s`,
            }}
            whileHover={{ scale: 1.5 }}
            onMouseEnter={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              setTooltipPosition({ 
                x: rect.left + rect.width / 2, 
                y: rect.top - 10 
              });
              setSelectedMemory(pulse);
            }}
            onMouseLeave={() => {
              setSelectedMemory(null);
            }}
            onClick={() => {
              console.log(`Clicked ${pulse.emotion} memory in ${pulse.location}`);
            }}
          >
            <motion.div
              className="absolute inset-0 rounded-full"
              animate={{
                scale: [1, 2, 1],
                opacity: [0.8, 0, 0.8],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: pulse.delay,
              }}
              style={{
                background: `radial-gradient(circle, ${
                  pulse.emotion === 'love' ? '#f472b6' :
                  pulse.emotion === 'peace' ? '#22d3ee' :
                  pulse.emotion === 'nostalgia' ? '#a855f7' :
                  pulse.emotion === 'joy' ? '#facc15' : '#fb923c'
                } 0%, transparent 70%)`,
              }}
            />
          </motion.div>
        ))}

        {/* Globe shine effect */}
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/30 via-transparent to-transparent"
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* Memory tooltip */}
        {selectedMemory && (
          <motion.div
            className="fixed glass-morphism rounded-xl p-4 pointer-events-none z-50 max-w-xs transform -translate-x-1/2"
            style={{
              left: tooltipPosition.x,
              top: tooltipPosition.y,
            }}
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
          >
            <div className="text-sm">
              <p className="text-gray-400 mb-1">Memory from</p>
              <p className="text-white font-medium">{selectedMemory.location}</p>
              <p className={`text-${
                selectedMemory.emotion === 'love' ? 'pink' :
                selectedMemory.emotion === 'peace' ? 'cyan' :
                selectedMemory.emotion === 'nostalgia' ? 'purple' :
                selectedMemory.emotion === 'joy' ? 'yellow' : 'orange'
              }-400 text-xs mb-2`}>
                {selectedMemory.emotion === 'love' ? '❤️' :
                 selectedMemory.emotion === 'peace' ? '😌' :
                 selectedMemory.emotion === 'nostalgia' ? '💜' :
                 selectedMemory.emotion === 'joy' ? '✨' : '💕'} {selectedMemory.emotion}
              </p>
              <p className="text-gray-300 text-xs italic">"{selectedMemory.content}"</p>
            </div>
          </motion.div>
        )}

        {/* General hover tooltip */}
        {isHovered && !selectedMemory && (
          <motion.div
            className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-black/80 backdrop-blur px-4 py-2 rounded-lg text-sm text-white pointer-events-none"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            Click memory pulses to hear whispered emotions...
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
