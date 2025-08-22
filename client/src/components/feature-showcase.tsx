import { motion } from "framer-motion";
import { Mic2, MapPin, Brain } from "lucide-react";

export default function FeatureShowcase() {
  const features = [
    {
      icon: Mic2,
      title: "🎙️ Voice-First",
      description: "Share emotions through voice, the most human way to connect",
      gradient: "from-pink-500 to-yellow-400",
      mockup: (
        <div className="bg-slate-900 rounded-2xl h-full p-4 flex flex-col">
          <div className="text-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-yellow-400 rounded-full mx-auto mb-2 flex items-center justify-center">
              <Mic2 className="w-8 h-8 text-white" />
            </div>
            <p className="text-xs text-gray-400">Tap to record</p>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <div className="voice-wave">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bar" style={{ animationDelay: `${i * 0.1}s` }} />
              ))}
            </div>
          </div>
          <div className="text-center text-xs text-gray-400">
            <p>💜 Emotion: Peaceful</p>
          </div>
        </div>
      ),
    },
    {
      icon: MapPin,
      title: "🧭 Location Magic",
      description: "Memories unlock when you're in the right place at the right time",
      gradient: "from-purple-600 to-purple-400",
      mockup: (
        <div className="bg-slate-900 rounded-2xl h-full p-4 flex flex-col">
          <div className="text-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-purple-400 rounded-full mx-auto mb-2 flex items-center justify-center">
              <MapPin className="w-8 h-8 text-white" />
            </div>
            <p className="text-xs text-gray-400">Nearby memories</p>
          </div>
          <div className="flex-1 relative bg-black/30 rounded-xl">
            <div className="absolute top-1/4 left-1/3 w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
            <div className="absolute bottom-1/3 right-1/4 w-2 h-2 bg-pink-400 rounded-full animate-pulse" style={{ animationDelay: "0.5s" }} />
            <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-purple-400 rounded-full border border-white animate-pulse" />
          </div>
          <div className="text-center text-xs text-gray-400">
            <p>📍 Central Park • 3 memories</p>
          </div>
        </div>
      ),
    },
    {
      icon: Brain,
      title: "🧠 Emotion AI",
      description: "AI understands and matches emotional states across memories",
      gradient: "from-cyan-500 to-emerald-400",
      mockup: (
        <div className="bg-slate-900 rounded-2xl h-full p-4 flex flex-col">
          <div className="text-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-emerald-400 rounded-full mx-auto mb-2 flex items-center justify-center">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <p className="text-xs text-gray-400">Emotion analysis</p>
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400">💜 Nostalgia</span>
              <div className="w-16 h-1 bg-gray-700 rounded-full">
                <div className="w-12 h-1 bg-purple-400 rounded-full" />
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400">❤️ Love</span>
              <div className="w-16 h-1 bg-gray-700 rounded-full">
                <div className="w-8 h-1 bg-pink-400 rounded-full" />
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400">😌 Peace</span>
              <div className="w-16 h-1 bg-gray-700 rounded-full">
                <div className="w-14 h-1 bg-cyan-400 rounded-full" />
              </div>
            </div>
          </div>
          <div className="text-center text-xs text-gray-400">
            <p>AI matched your emotions</p>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            viewport={{ once: true }}
          >
            <div className="relative mx-auto mb-6 w-48 h-96 bg-gradient-to-b from-gray-800 to-gray-900 rounded-3xl p-6 glass-morphism">
              {feature.mockup}
            </div>
            <h3 className="text-xl font-medium mb-2 text-white">{feature.title}</h3>
            <p className="text-gray-400 text-sm">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
