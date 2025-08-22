import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Mail, MapPin, Clock, Twitter, Github, Linkedin } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      toast({
        title: "Message sent! 💜",
        description: "We'll respond to your message within 24 hours.",
      });
      setFormData({ name: "", email: "", subject: "", message: "" });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

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

          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-yellow-400 rounded-full mx-auto mb-6 flex items-center justify-center">
                <Mail className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl md:text-6xl font-light mb-4">
                Contact <span className="gradient-text">Us</span>
              </h1>
              <p className="text-xl text-gray-400">
                Let's start a conversation about emotions and connections
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Information */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="glass-morphism rounded-3xl p-8">
                  <h2 className="text-2xl font-semibold mb-6">Get in Touch</h2>
                  
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-purple-400 rounded-full flex items-center justify-center">
                        <Mail className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">Email</p>
                        <p className="text-gray-400">hello@echo.app</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-emerald-400 rounded-full flex items-center justify-center">
                        <MapPin className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">Location</p>
                        <p className="text-gray-400">San Francisco, CA</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-yellow-400 rounded-full flex items-center justify-center">
                        <Clock className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">Response Time</p>
                        <p className="text-gray-400">Within 24 hours</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-white/10">
                    <h3 className="text-lg font-medium mb-4">Follow Our Journey</h3>
                    <div className="flex gap-4">
                      {[
                        { icon: Twitter, label: "Twitter", color: "from-blue-500 to-blue-400" },
                        { icon: Github, label: "GitHub", color: "from-gray-600 to-gray-500" },
                        { icon: Linkedin, label: "LinkedIn", color: "from-blue-600 to-blue-500" }
                      ].map((social) => (
                        <motion.a
                          key={social.label}
                          href="#"
                          className={`w-10 h-10 bg-gradient-to-r ${social.color} rounded-full flex items-center justify-center hover:scale-110 transition-transform`}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <social.icon className="w-5 h-5 text-white" />
                        </motion.a>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="glass-morphism rounded-3xl p-8">
                  <h2 className="text-2xl font-semibold mb-6">Send us a Message</h2>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Input
                          name="name"
                          placeholder="Your name"
                          value={formData.name}
                          onChange={handleChange}
                          className="bg-white/5 border-white/20 text-white placeholder-gray-400"
                          required
                        />
                      </div>
                      <div>
                        <Input
                          name="email"
                          type="email"
                          placeholder="Your email"
                          value={formData.email}
                          onChange={handleChange}
                          className="bg-white/5 border-white/20 text-white placeholder-gray-400"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Input
                        name="subject"
                        placeholder="Subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="bg-white/5 border-white/20 text-white placeholder-gray-400"
                      />
                    </div>

                    <div>
                      <textarea
                        name="message"
                        placeholder="Your message..."
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full h-32 bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 resize-none focus:outline-none focus:border-purple-400"
                        required
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 py-4 text-lg"
                    >
                      Send Message
                    </Button>
                  </form>
                </div>
              </motion.div>
            </div>

            {/* Additional Info */}
            <motion.div
              className="mt-12 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="glass-morphism rounded-2xl p-6">
                <h3 className="text-lg font-medium mb-2">Partnership & Media Inquiries</h3>
                <p className="text-gray-400 mb-4">
                  Interested in partnering with ECHO or covering our story?
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a href="mailto:partnerships@echo.app" className="text-purple-400 hover:text-purple-300">
                    partnerships@echo.app
                  </a>
                  <span className="hidden sm:inline text-gray-600">|</span>
                  <a href="mailto:press@echo.app" className="text-cyan-400 hover:text-cyan-300">
                    press@echo.app
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}