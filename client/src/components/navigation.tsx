import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Menu, X, LogIn, UserPlus, LogOut, User } from "lucide-react";
import { useAuth, useLogout } from "@/hooks/useAuth";
import { AuthModal } from "@/components/auth-modal";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authTab, setAuthTab] = useState<"login" | "signup">("login");
  const { user, isAuthenticated } = useAuth();
  const logoutMutation = useLogout();

  const openAuthModal = (tab: "login" | "signup" = "login") => {
    setAuthTab(tab);
    setShowAuthModal(true);
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const navItems = [
    { href: "#home", label: "Home" },
    { href: "#how-it-works", label: "How It Works" },
    { href: "#emotion-map", label: "Emotion Map" },
    { href: "#features", label: "Features" },
  ];

  return (
    <>
    <motion.nav
      className="fixed top-0 w-full z-50 glass-morphism"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <motion.div
            className="text-2xl font-bold gradient-text"
            whileHover={{ scale: 1.05 }}
          >
            ECHO
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <motion.a
                key={item.href}
                href={item.href}
                className="hover:text-purple-400 transition-colors"
                whileHover={{ y: -2 }}
              >
                {item.label}
              </motion.a>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-sm">
                  <User className="w-4 h-4 text-purple-400" />
                  <span className="text-purple-400">{user?.username}</span>
                </div>
                <Button 
                  variant="outline"
                  size="sm"
                  className="border-gray-400 text-gray-400 hover:bg-gray-400 hover:text-white"
                  onClick={handleLogout}
                  disabled={logoutMutation.isPending}
                >
                  <LogOut className="w-4 h-4 mr-1" />
                  {logoutMutation.isPending ? 'Logging out...' : 'Logout'}
                </Button>
              </div>
            ) : (
              <>
                <Button 
                  variant="outline"
                  size="sm"
                  className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white"
                  onClick={() => openAuthModal("login")}
                >
                  <LogIn className="w-4 h-4 mr-1" />
                  Login
                </Button>
                <Button 
                  size="sm"
                  className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600"
                  onClick={() => openAuthModal("signup")}
                >
                  <UserPlus className="w-4 h-4 mr-1" />
                  Sign Up
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <motion.div
            className="md:hidden mt-4 pb-4 border-t border-white/10"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="flex flex-col space-y-4 mt-4">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="hover:text-purple-400 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              
              {/* Mobile Auth Buttons */}
              {isAuthenticated ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-purple-400">
                    <User className="w-4 h-4" />
                    <span>Welcome, {user?.username}</span>
                  </div>
                  <Button 
                    variant="outline"
                    className="w-full border-gray-400 text-gray-400 hover:bg-gray-400 hover:text-white"
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    disabled={logoutMutation.isPending}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    {logoutMutation.isPending ? 'Logging out...' : 'Logout'}
                  </Button>
                </div>
              ) : (
                <>
                  <Button 
                    variant="outline"
                    className="w-full border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white"
                    onClick={() => {
                      openAuthModal("login");
                      setIsOpen(false);
                    }}
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    Login
                  </Button>
                  <Button 
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600"
                    onClick={() => {
                      openAuthModal("signup");
                      setIsOpen(false);
                    }}
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Sign Up
                  </Button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
    
    {/* Authentication Modal */}
    <AuthModal 
      open={showAuthModal} 
      onOpenChange={setShowAuthModal}
      defaultTab={authTab}
    />
    </>
  );
}
