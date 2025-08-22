import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, HelpCircle, MessageCircle, Book, Zap, Mail } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Support() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && message) {
      toast({
        title: "Support request sent! 💜",
        description: "We'll get back to you within 24 hours.",
      });
      setEmail("");
      setMessage("");
    }
  };

  const faqs = [
    {
      question: "How does emotion detection work?",
      answer: "Our AI analyzes voice tone, pace, and linguistic patterns to detect emotions. It's trained on thousands of emotional voice samples to understand subtle emotional nuances."
    },
    {
      question: "Can I delete my memories?",
      answer: "Yes, you have full control over your memories. You can delete individual memories or your entire account at any time from your profile settings."
    },
    {
      question: "How are memories matched to locations?",
      answer: "Our AI considers your current emotion, the memory's emotional content, and location significance to place memories where they're most likely to resonate with others."
    },
    {
      question: "Is my location data private?",
      answer: "Your exact location is never shared. We only use general location areas to enable memory discovery while protecting your privacy."
    }
  ];

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
              <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full mx-auto mb-6 flex items-center justify-center">
                <HelpCircle className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl md:text-6xl font-light mb-4">
                Support <span className="gradient-text">Center</span>
              </h1>
              <p className="text-xl text-gray-400">
                We're here to help you connect and share emotions
              </p>
            </div>

            {/* Quick Help Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {[
                {
                  icon: MessageCircle,
                  title: "Live Chat",
                  description: "Chat with our support team",
                  action: "Start Chat",
                  gradient: "from-pink-500 to-rose-400"
                },
                {
                  icon: Book,
                  title: "Documentation",
                  description: "Learn how ECHO works",
                  action: "Read Docs",
                  gradient: "from-purple-500 to-indigo-400"
                },
                {
                  icon: Zap,
                  title: "Report Bug",
                  description: "Help us improve ECHO",
                  action: "Report Issue",
                  gradient: "from-cyan-500 to-teal-400"
                }
              ].map((item, index) => (
                <motion.div
                  key={item.title}
                  className="glass-morphism rounded-2xl p-6 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className={`w-12 h-12 bg-gradient-to-r ${item.gradient} rounded-full mx-auto mb-4 flex items-center justify-center`}>
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">{item.title}</h3>
                  <p className="text-gray-400 text-sm mb-4">{item.description}</p>
                  <Button variant="outline" size="sm" className="text-xs">
                    {item.action}
                  </Button>
                </motion.div>
              ))}
            </div>

            {/* FAQ Section */}
            <div className="glass-morphism rounded-3xl p-8 mb-8">
              <h2 className="text-2xl font-semibold mb-6 text-center">Frequently Asked Questions</h2>
              <div className="space-y-6">
                {faqs.map((faq, index) => (
                  <motion.div
                    key={index}
                    className="border-b border-white/10 pb-6 last:border-b-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <h3 className="text-lg font-medium mb-3 text-purple-400">{faq.question}</h3>
                    <p className="text-gray-300">{faq.answer}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Contact Form */}
            <div className="glass-morphism rounded-3xl p-8">
              <div className="text-center mb-6">
                <Mail className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
                <h2 className="text-2xl font-semibold">Get in Touch</h2>
                <p className="text-gray-400">Can't find what you're looking for? Send us a message.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
                <div>
                  <Input
                    type="email"
                    placeholder="Your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white/5 border-white/20 text-white placeholder-gray-400"
                    required
                  />
                </div>
                <div>
                  <textarea
                    placeholder="Describe your issue or question..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full h-32 bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 resize-none focus:outline-none focus:border-purple-400"
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600"
                >
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}