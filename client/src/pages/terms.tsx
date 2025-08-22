import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Users, AlertCircle, Heart } from "lucide-react";
import { Link } from "wouter";

export default function Terms() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-black text-white">
      <div className="container mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Link href="/">
            <Button variant="ghost" className="mb-8 text-purple-400 hover:text-purple-300">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>

          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="w-20 h-20 bg-gradient-to-r from-cyan-500 to-emerald-400 rounded-full mx-auto mb-6 flex items-center justify-center">
                <FileText className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl md:text-6xl font-light mb-4">
                Terms of <span className="gradient-text">Service</span>
              </h1>
              <p className="text-xl text-gray-400">
                Guidelines for our emotional memory community
              </p>
            </div>

            <div className="glass-morphism rounded-3xl p-8 mb-8">
              <div className="space-y-8">
                <section>
                  <div className="flex items-center gap-3 mb-4">
                    <Heart className="w-6 h-6 text-pink-400" />
                    <h2 className="text-2xl font-semibold">Our Mission</h2>
                  </div>
                  <p className="text-gray-300">
                    ECHO exists to create authentic emotional connections between souls. 
                    By using our service, you agree to treat every memory and echo with 
                    the respect and empathy it deserves.
                  </p>
                </section>

                <section>
                  <div className="flex items-center gap-3 mb-4">
                    <Users className="w-6 h-6 text-cyan-400" />
                    <h2 className="text-2xl font-semibold">Community Guidelines</h2>
                  </div>
                  <div className="text-gray-300 space-y-3">
                    <p>To maintain a safe emotional space:</p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Share genuine emotions and experiences</li>
                      <li>Respect the vulnerability of others' memories</li>
                      <li>No harassment, hate speech, or harmful content</li>
                      <li>Protect the anonymity and privacy of all users</li>
                      <li>Report inappropriate content to help keep our community safe</li>
                    </ul>
                  </div>
                </section>

                <section>
                  <div className="flex items-center gap-3 mb-4">
                    <AlertCircle className="w-6 h-6 text-yellow-400" />
                    <h2 className="text-2xl font-semibold">Content Responsibility</h2>
                  </div>
                  <div className="text-gray-300 space-y-3">
                    <ul className="list-disc pl-6 space-y-2">
                      <li>You own your voice memories and emotional content</li>
                      <li>You're responsible for the content you share</li>
                      <li>We reserve the right to remove harmful or inappropriate content</li>
                      <li>AI emotion analysis is provided as-is and may not be perfect</li>
                      <li>Deleted memories are permanently removed from our systems</li>
                    </ul>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">Service Availability</h2>
                  <p className="text-gray-300">
                    ECHO is currently in beta. We strive for 99.9% uptime but cannot 
                    guarantee uninterrupted service. We'll notify users of planned maintenance 
                    and work quickly to resolve any technical issues.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">Changes to Terms</h2>
                  <p className="text-gray-300">
                    We may update these terms as ECHO evolves. Users will be notified 
                    of significant changes via email or app notification.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">Contact</h2>
                  <p className="text-gray-300">
                    Questions about our terms?{" "}
                    <a href="mailto:legal@echo.app" className="text-purple-400 hover:text-purple-300">
                      legal@echo.app
                    </a>
                  </p>
                </section>
              </div>
            </div>

            <div className="text-center text-gray-500 text-sm">
              Last updated: January 2025
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}