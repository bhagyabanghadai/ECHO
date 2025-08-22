import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Heart, Play, MapPin } from "lucide-react";

export default function MemoryCard() {
  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        className="glass-morphism rounded-3xl p-8 mb-8"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-purple-400 rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Sleeping memory from</p>
              <p className="text-purple-400 flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                Shibuya, Tokyo
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400">Emotion detected</p>
            <p className="text-pink-400">💜 Nostalgia</p>
          </div>
        </div>
        
        <div className="bg-black/50 rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <motion.button
              className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Play className="w-6 h-6 text-white ml-1" />
            </motion.button>
            
            <div className="voice-wave">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bar" style={{ animationDelay: `${i * 0.1}s` }} />
              ))}
            </div>
            <span className="text-gray-400">Voice memory playing...</span>
          </div>
          <p className="text-gray-300 italic">"I miss the way the cherry blossoms fell like snow..."</p>
        </div>

        <div className="flex justify-center">
          <Button className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-full transition-all">
            🔓 Echo This Memory
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
