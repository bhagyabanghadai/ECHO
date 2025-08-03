import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import Navigation from "@/components/navigation";
import HeroGlobe from "@/components/hero-globe";
import EmotionMap from "@/components/emotion-map";
import VoiceRecorder from "@/components/voice-recorder";
import MemoryCard from "@/components/memory-card";
import FeatureShowcase from "@/components/feature-showcase";
import { AuthModal } from "@/components/auth-modal";
import { MVPDemo } from "@/components/mvp-demo";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { useAuth, useLogout } from "@/hooks/useAuth";
import { ChevronDown, Heart, MapPin, Brain, Shield, Link2, Archive, Mic2, Users, Globe, LogOut, User } from "lucide-react";
import { Link } from "wouter";
import { VoiceMemoryRecorder } from "@/components/voice-memory-recorder";

const emotionColors = {
  nostalgia: "from-purple-600 to-purple-400",
  love: "from-pink-500 to-yellow-400",
  peace: "from-cyan-500 to-emerald-400",
  joy: "from-yellow-400 to-orange-400",
  warmth: "from-orange-400 to-red-400",
};

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authTab, setAuthTab] = useState<"login" | "signup">("login");
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false);
  const { user, isAuthenticated, isLoading } = useAuth();
  const logoutMutation = useLogout();
  const { toast } = useToast();

  // Fetch global emotion map data
  const { data: emotionMapData } = useQuery({
    queryKey: ["/api/emotions/map"],
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const openAuthModal = (tab: "login" | "signup" = "login") => {
    setAuthTab(tab);
    setShowAuthModal(true);
  };

  const handleOnboardingComplete = () => {
    // Mark user as having completed onboarding
    // This would typically update the user's onboarding status in the backend
    window.location.reload(); // Refresh to show the full app
  };

  // Show MVP demo for new authenticated users
  if (isAuthenticated && user && !user.hasCompletedOnboarding) {
    return <MVPDemo onComplete={handleOnboardingComplete} />;
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-b from-slate-950 to-black text-white overflow-x-hidden">
      <Navigation />
      
      {/* Hero Section */}
      <motion.section 
        id="home" 
        className="min-h-screen flex items-center justify-center relative parallax-container"
        style={{ y: heroY, opacity: heroOpacity }}
      >
        {/* Background particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className={`absolute w-1 h-1 rounded-full ${
                i % 3 === 0 ? 'bg-purple-400' : i % 3 === 1 ? 'bg-pink-400' : 'bg-cyan-400'
              }`}
              style={{
                top: `${20 + (i * 15)}%`,
                left: `${10 + (i * 15)}%`,
              }}
              animate={{
                opacity: [0.3, 1, 0.3],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 3,
                delay: i * 0.5,
                repeat: Infinity,
              }}
            />
          ))}
        </div>

        <div className="text-center z-10 px-4">
          <HeroGlobe />

          {/* Globe Instructions */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2 }}
          >
            <p className="text-gray-400 text-sm">
              ✨ Hover over memory pulses to see details • Click the globe to make it spin • Move your mouse to rotate
            </p>
          </motion.div>
          
          <motion.h1 
            className="text-5xl md:text-7xl font-light mb-6 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            Memories sleep until<br />
            they're <span className="gradient-text font-semibold">echoed</span>
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-gray-400 mb-12 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.7 }}
          >
            An AI-powered emotional memory network where your voice finds those who need to hear it
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.9 }}
          >
{isAuthenticated ? (
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <div className="text-center sm:text-left">
                  <p className="text-purple-400 mb-2">Welcome back, {user?.username}!</p>
                  <Button 
                    size="lg" 
                    onClick={() => setShowVoiceRecorder(true)}
                    className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 px-8 py-4 text-lg font-medium animate-glow"
                  >
                    <Mic2 className="w-5 h-5 mr-2" />
                    Create Voice Memory
                  </Button>
                </div>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-gray-400 text-gray-400 hover:bg-gray-400 hover:text-white px-6 py-2"
                  onClick={handleLogout}
                  disabled={logoutMutation.isPending}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  {logoutMutation.isPending ? 'Logging out...' : 'Logout'}
                </Button>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 px-8 py-4 text-lg font-medium animate-glow"
                  onClick={() => openAuthModal("login")}
                >
                  🎧 Start Echoing
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white px-8 py-4 text-lg font-medium"
                  onClick={() => openAuthModal("signup")}
                >
                  <User className="w-4 h-4 mr-2" />
                  Join ECHO
                </Button>
              </div>
            )}
          </motion.div>
        </div>

        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown className="text-purple-400 w-6 h-6" />
        </motion.div>
      </motion.section>

      {/* What is ECHO Section */}
      <motion.section 
        className="py-20 relative"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <motion.div 
              className="inline-block p-8 emotion-orb w-32 h-32 mx-auto mb-8 animate-float bg-gradient-to-br from-pink-500 to-yellow-400"
              whileHover={{ scale: 1.1 }}
            >
              <Heart className="w-16 h-16 text-white mx-auto mt-4" />
            </motion.div>
            
            <h2 className="text-4xl md:text-6xl font-light mb-8">
              What is <span className="gradient-text">ECHO</span>?
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              A whispered memory in Tokyo finds its echo in your heart in New York. 
              ECHO connects souls through shared emotions, not algorithms.
            </p>
          </div>

          <MemoryCard />
        </div>
      </motion.section>

      {/* How It Works Section */}
      <motion.section 
        id="how-it-works" 
        className="py-20 relative"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-6">
          <h2 className="text-4xl md:text-6xl font-light text-center mb-16">
            How <span className="gradient-text">ECHO</span> Works
          </h2>

          {/* Step 1: Voice Post */}
          <div className="max-w-6xl mx-auto mb-20">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <h3 className="text-3xl font-light mb-6 text-pink-400">🎙️ Whisper Your Heart</h3>
                <p className="text-xl text-gray-400 mb-6">
                  Share a voice memory with the world. Our AI understands your emotion and finds the perfect place for it to sleep.
                </p>
                <VoiceRecorder />
              </motion.div>
              
              <motion.div 
                className="text-center"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <div className="emotion-orb w-64 h-64 mx-auto animate-float bg-gradient-to-br from-pink-500 to-yellow-400">
                  <div className="flex items-center justify-center h-full">
                    <Mic2 className="w-16 h-16 text-white" />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Step 2: Memory Sleeps */}
          <div className="max-w-6xl mx-auto mb-20">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div 
                className="order-2 md:order-1 text-center"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <div className="emotion-orb w-64 h-64 mx-auto animate-float memory-pulse bg-gradient-to-br from-purple-600 to-purple-400">
                  <div className="flex items-center justify-center h-full">
                    <MapPin className="w-16 h-16 text-white" />
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                className="order-1 md:order-2"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <h3 className="text-3xl font-light mb-6 text-purple-400">🗺️ Memory Finds Its Place</h3>
                <p className="text-xl text-gray-400 mb-6">
                  Your memory drifts to a location where someone might need to hear it. It sleeps, waiting for the right soul to unlock it.
                </p>
                <div className="glass-morphism rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-white font-medium">Memory Placed</p>
                      <p className="text-purple-400">📍 Central Park, NYC</p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-400 text-sm">Status</p>
                      <p className="text-yellow-400">💤 Sleeping</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Step 3: Unlock & Echo */}
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <h3 className="text-3xl font-light mb-6 text-cyan-400">🔓 Someone Echoes</h3>
                <p className="text-xl text-gray-400 mb-6">
                  When someone nearby feels a similar emotion, they unlock your memory. They can listen, feel, and echo back with their own voice.
                </p>
                <div className="glass-morphism rounded-2xl p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-emerald-400 rounded-full flex items-center justify-center">
                      <Heart className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-medium">Memory Unlocked</p>
                      <p className="text-cyan-400 text-sm">Someone echoed your emotion</p>
                    </div>
                  </div>
                  <div className="bg-black/50 rounded-xl p-4">
                    <p className="text-cyan-400 italic text-sm">"I understand that feeling. Here's my echo..."</p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                className="text-center"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <div className="emotion-orb w-64 h-64 mx-auto animate-float bg-gradient-to-br from-cyan-500 to-emerald-400">
                  <div className="flex items-center justify-center h-full">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Heart className="w-16 h-16 text-white" />
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Interactive Emotion Map */}
      <motion.section 
        id="emotion-map" 
        className="py-20 relative"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-light mb-8">
              Global <span className="gradient-text">Emotion</span> Map
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Explore anonymous emotions echoing around the world. Each pulse represents a shared human experience.
            </p>
          </div>

          <EmotionMap />
        </div>
      </motion.section>

      {/* Product Features */}
      <motion.section 
        id="features" 
        className="py-20 relative"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-light mb-8">
              Features That <span className="gradient-text">Connect</span> Souls
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Every feature is designed to deepen emotional connections, not just digital ones.
            </p>
          </div>

          <FeatureShowcase />

          {/* Additional features grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
            {[
              {
                icon: Shield,
                title: "🔐 Privacy Controls",
                description: "Choose who can unlock your memories: Public, Friends, or Emotion-matched",
                gradient: "from-purple-600 to-pink-500"
              },
              {
                icon: Link2,
                title: "🔁 Echo Chains",
                description: "Memories create chains of emotional responses, building deeper connections",
                gradient: "from-pink-500 to-yellow-400"
              },
              {
                icon: Archive,
                title: "📦 Memory Vault",
                description: "Keep all unlocked memories safe in your personal emotional archive",
                gradient: "from-cyan-500 to-emerald-400"
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                className="glass-morphism rounded-2xl p-6 text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-full mx-auto mb-4 flex items-center justify-center`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-lg font-medium mb-2">{feature.title}</h4>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Call to Action */}
      <motion.section 
        id="cta"
        className="py-20 relative"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
              
              <div className="relative z-10">
                <h2 className="text-4xl md:text-6xl font-light mb-8">
                  Some memories wait for the<br />
                  <span className="gradient-text">right person</span> to remember them
                </h2>
                
                <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
                  Join the ECHO community and discover the magic of shared emotions. Your voice might be exactly what someone needs to hear.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                  {isAuthenticated ? (
                    <>
                      <Button 
                        size="lg"
                        className="bg-gradient-to-r from-pink-500 to-yellow-400 hover:from-pink-600 hover:to-yellow-500 px-8 py-4 text-lg font-medium"
                      >
                        🎧 Create Your First Memory
                      </Button>
                      <Button 
                        variant="outline" 
                        size="lg"
                        className="border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-white px-8 py-4 text-lg font-medium"
                      >
                        🗺️ Explore Memory Map
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button 
                        size="lg"
                        className="bg-gradient-to-r from-pink-500 to-yellow-400 hover:from-pink-600 hover:to-yellow-500 px-8 py-4 text-lg font-medium"
                        onClick={() => openAuthModal("login")}
                      >
                        🎧 Start Echoing Now
                      </Button>
                      <Button 
                        variant="outline" 
                        size="lg"
                        className="border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-white px-8 py-4 text-lg font-medium"
                        onClick={() => openAuthModal("signup")}
                      >
                        📝 Create Account
                      </Button>
                    </>
                  )}
                </div>

                <div className="text-sm text-gray-500">
                  <p>🔒 Secure & Private • 🌍 Global Community • ✨ Free to Join</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="text-3xl font-bold gradient-text mb-2">
                ECHO
              </div>
              <p className="text-gray-400 text-sm">Made with emotion 💜</p>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-8">
              <nav className="flex gap-6">
                {[
                  { name: "Privacy", path: "/privacy" },
                  { name: "Terms", path: "/terms" },
                  { name: "Support", path: "/support" },
                  { name: "Contact", path: "/contact" }
                ].map((link) => (
                  <Link
                    key={link.name}
                    href={link.path}
                    className="text-gray-400 hover:text-purple-400 transition-colors text-sm cursor-pointer"
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>

              <div className="flex gap-4">
                {[Users, Globe, Heart].map((Icon, index) => (
                  <a
                    key={index}
                    href="#"
                    className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-purple-400/20 transition-colors"
                  >
                    <Icon className="w-5 h-5 text-purple-400" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-white/10 text-center">
            <p className="text-gray-500 text-sm">
              © 2024 ECHO. All rights reserved.
              <button className="text-purple-400 hover:text-pink-400 transition-colors ml-4">
                Switch to Light Mode ☀️
              </button>
            </p>
          </div>
        </div>
      </footer>

      {/* Authentication Modal */}
      <AuthModal 
        open={showAuthModal} 
        onOpenChange={setShowAuthModal}
        defaultTab={authTab}
      />

      {/* Voice Memory Recorder */}
      <VoiceMemoryRecorder 
        isOpen={showVoiceRecorder}
        onClose={() => setShowVoiceRecorder(false)}
      />
    </div>
  );
}
