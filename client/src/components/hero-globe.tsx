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
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isSpinning, setIsSpinning] = useState(false);

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
      if (globeRef.current && !isSpinning) {
        const rect = globeRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const newX = (e.clientX - centerX) / 8;
        const newY = (e.clientY - centerY) / 8;
        
        setMousePosition({ x: newX, y: newY });
        setRotation({ x: newY * 0.5, y: newX * 0.5 });
      }
    };

    // Auto-spin when not hovering
    let spinInterval: NodeJS.Timeout;
    if (!isHovered && !isSpinning) {
      spinInterval = setInterval(() => {
        setRotation(prev => ({ 
          x: prev.x + 0.5, 
          y: prev.y + 0.3 
        }));
      }, 50);
    }

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (spinInterval) clearInterval(spinInterval);
    };
  }, [isHovered, isSpinning]);

  return (
    <motion.div 
      ref={globeRef}
      className="relative mx-auto mb-12 w-80 h-80 md:w-96 md:h-96 perspective-1000"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={() => {
        setIsSpinning(!isSpinning);
        if (!isSpinning) {
          // Trigger a random spin animation
          setRotation({ 
            x: Math.random() * 360, 
            y: Math.random() * 360 
          });
        }
      }}
    >
      <motion.div
        className="w-full h-full emotion-orb animate-float memory-pulse cursor-pointer bg-gradient-to-br from-purple-600 via-pink-500 to-purple-400 relative overflow-hidden"
        style={{
          transform: `rotateY(${rotation.y}deg) rotateX(${rotation.x}deg)`,
          transformStyle: 'preserve-3d',
        }}
        whileHover={{ 
          scale: 1.05,
          boxShadow: "0 0 40px rgba(168, 85, 247, 0.4)"
        }}
        whileTap={{ scale: 0.95 }}
        transition={{ 
          type: "spring", 
          stiffness: 100,
          transform: { duration: isSpinning ? 2 : 0.3 }
        }}
      >
        {/* Globe grid lines for more realistic feel */}
        <div className="absolute inset-0 opacity-20">
          {[...Array(8)].map((_, i) => (
            <div
              key={`meridian-${i}`}
              className="absolute bg-white/30"
              style={{
                left: `${(i * 12.5)}%`,
                top: 0,
                width: '1px',
                height: '100%',
                transform: `rotateY(${i * 22.5}deg)`,
                transformOrigin: 'center',
              }}
            />
          ))}
          {[...Array(6)].map((_, i) => (
            <div
              key={`parallel-${i}`}
              className="absolute bg-white/30 rounded-full border border-white/20"
              style={{
                left: '10%',
                right: '10%',
                top: `${10 + i * 15}%`,
                height: '1px',
              }}
            />
          ))}
        </div>
        {/* Memory pulses on globe */}
        {memoryPulses.map((pulse) => (
          <motion.div
            key={pulse.id}
            className={`absolute w-4 h-4 ${emotionColors[pulse.emotion as keyof typeof emotionColors]} rounded-full animate-pulse-slow cursor-pointer shadow-lg border-2 border-white/50`}
            style={{
              top: `${pulse.y}%`,
              left: `${pulse.x}%`,
              animationDelay: `${pulse.delay}s`,
              transform: `translateZ(20px)`,
              zIndex: 10,
            }}
            whileHover={{ 
              scale: 1.8,
              boxShadow: "0 0 20px currentColor",
              z: 20
            }}
            whileTap={{ scale: 1.2 }}
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
            onClick={(e) => {
              e.stopPropagation();
              console.log(`Clicked ${pulse.emotion} memory in ${pulse.location}`);
              // Add a ripple effect
              const ripple = document.createElement('div');
              ripple.className = 'absolute inset-0 rounded-full bg-white/50 animate-ping';
              e.currentTarget.appendChild(ripple);
              setTimeout(() => ripple.remove(), 1000);
            }}
            data-hover-element
          >
            {/* Pulse ring effect */}
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-current opacity-50"
              animate={{
                scale: [1, 2, 1],
                opacity: [0.5, 0, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: pulse.delay,
              }}
            />
          </motion.div>
        ))}

        {/* Additional atmospheric elements */}
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/5 to-transparent rounded-full" />
        <div className="absolute top-4 right-8 w-2 h-2 bg-white/80 rounded-full animate-pulse" />
        <div className="absolute bottom-12 left-6 w-1 h-1 bg-cyan-300 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/3 left-4 w-1 h-1 bg-pink-300 rounded-full animate-pulse" style={{ animationDelay: '2s' }} />

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
