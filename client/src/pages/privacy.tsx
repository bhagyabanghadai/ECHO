import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield, Eye, Lock, UserCheck } from "lucide-react";
import { Link } from "wouter";

export default function Privacy() {
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
              <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl md:text-6xl font-light mb-4">
                Privacy <span className="gradient-text">Policy</span>
              </h1>
              <p className="text-xl text-gray-400">
                Your emotional memories deserve the highest protection
              </p>
            </div>

            <div className="glass-morphism rounded-3xl p-8 mb-8">
              <div className="space-y-8">
                <section>
                  <div className="flex items-center gap-3 mb-4">
                    <Eye className="w-6 h-6 text-cyan-400" />
                    <h2 className="text-2xl font-semibold">What We Collect</h2>
                  </div>
                  <div className="text-gray-300 space-y-3">
                    <p>We collect only what's necessary to create meaningful emotional connections:</p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Voice recordings and their emotional analysis</li>
                      <li>Location data for memory placement (with your permission)</li>
                      <li>Basic account information (email, username)</li>
                      <li>Interaction data to improve emotion matching</li>
                    </ul>
                  </div>
                </section>

                <section>
                  <div className="flex items-center gap-3 mb-4">
                    <Lock className="w-6 h-6 text-pink-400" />
                    <h2 className="text-2xl font-semibold">How We Protect You</h2>
                  </div>
                  <div className="text-gray-300 space-y-3">
                    <ul className="list-disc pl-6 space-y-2">
                      <li>End-to-end encryption for all voice memories</li>
                      <li>Anonymized emotional data for the global map</li>
                      <li>You control who can unlock your memories</li>
                      <li>Location data is never shared without permission</li>
                      <li>AI processing happens securely on our servers</li>
                    </ul>
                  </div>
                </section>

                <section>
                  <div className="flex items-center gap-3 mb-4">
                    <UserCheck className="w-6 h-6 text-emerald-400" />
                    <h2 className="text-2xl font-semibold">Your Rights</h2>
                  </div>
                  <div className="text-gray-300 space-y-3">
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Delete your memories at any time</li>
                      <li>Export your emotional data</li>
                      <li>Control memory access settings</li>
                      <li>Opt out of AI emotion analysis</li>
                      <li>Request complete account deletion</li>
                    </ul>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
                  <p className="text-gray-300">
                    Questions about your privacy? Email us at{" "}
                    <a href="mailto:privacy@echo.app" className="text-purple-400 hover:text-purple-300">
                      privacy@echo.app
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