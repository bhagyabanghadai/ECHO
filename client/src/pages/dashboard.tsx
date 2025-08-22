import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { 
  Heart, 
  MapPin, 
  Calendar,
  TrendingUp,
  Users,
  Globe,
  Mic,
  Play,
  Plus,
  Settings,
  Bell,
  Star,
  Activity
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { VoiceMemoryRecorder } from "@/components/voice-memory-recorder";
import { Link } from "wouter";

const recentActivities = [
  { type: 'memory', text: 'Created "Peaceful Morning Walk"', time: '2 hours ago', emotion: 'peaceful' },
  { type: 'echo', text: 'Received echo from Sarah', time: '5 hours ago', emotion: 'joy' },
  { type: 'unlock', text: 'Unlocked memory in Central Park', time: '1 day ago', emotion: 'nostalgia' },
  { type: 'achievement', text: 'Reached 10 memories milestone', time: '2 days ago', emotion: 'proud' }
];

const emotionTrends = [
  { emotion: 'grateful', count: 15, change: '+20%', color: '#10B981' },
  { emotion: 'peaceful', count: 12, change: '+15%', color: '#3B82F6' },
  { emotion: 'nostalgic', count: 8, change: '+5%', color: '#8B5CF6' },
  { emotion: 'joyful', count: 6, change: '-10%', color: '#F59E0B' }
];

export default function Dashboard() {
  const { user } = useAuth();
  const [showRecorder, setShowRecorder] = useState(false);

  // Fetch dashboard data
  const { data: userStats } = useQuery({
    queryKey: ['/api/user/stats'],
    enabled: !!user
  });

  const { data: recentMemories } = useQuery({
    queryKey: ['/api/memories/user'],
    enabled: !!user
  });

  const { data: emotionData } = useQuery({
    queryKey: ['/api/emotions/map'],
    enabled: !!user
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-purple-900 p-4 flex items-center justify-center">
        <Card>
          <CardContent className="p-6">
            <p>Please log in to view your dashboard.</p>
            <Button asChild className="mt-4">
              <Link href="/login">Login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const stats = userStats?.data || {
    totalMemories: 0,
    totalEchoes: 0,
    memoriesUnlocked: 0,
    favoriteEmotion: 'contemplative'
  };

  const memories = recentMemories?.memories || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-purple-900 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        >
          <div className="flex items-center gap-4">
            <Avatar className="w-12 h-12">
              <AvatarImage src={user.profileImageUrl} alt={user.username} />
              <AvatarFallback>
                {user.firstName?.charAt(0) || user.username.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Welcome back, {user.firstName || user.username}!
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Ready to capture new emotional memories?
              </p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Bell className="w-4 h-4 mr-2" />
              Notifications
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href="/profile">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Link>
            </Button>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-xl font-semibold mb-2">Create Memory</h2>
                  <p className="text-purple-100">
                    Capture a moment with AI emotion analysis
                  </p>
                </div>
                <Button 
                  onClick={() => setShowRecorder(true)}
                  variant="secondary"
                  className="bg-white text-purple-600 hover:bg-gray-100"
                >
                  <Mic className="w-4 h-4 mr-2" />
                  Record
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-xl font-semibold mb-2">Discover Emotions</h2>
                  <p className="text-blue-100">
                    Explore memories and emotions around the world
                  </p>
                </div>
                <Button 
                  variant="secondary"
                  className="bg-white text-blue-600 hover:bg-gray-100"
                  asChild
                >
                  <Link href="/discover">
                    <Globe className="w-4 h-4 mr-2" />
                    Explore
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Memories</p>
                  <p className="text-2xl font-bold">{stats.totalMemories}</p>
                </div>
                <Heart className="w-8 h-8 text-red-500" />
              </div>
              <div className="mt-2">
                <Progress value={Math.min((stats.totalMemories / 50) * 100, 100)} className="h-2" />
                <p className="text-xs text-gray-500 mt-1">
                  {50 - stats.totalMemories > 0 ? `${50 - stats.totalMemories} to next milestone` : 'Milestone reached!'}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Echoes</p>
                  <p className="text-2xl font-bold">{stats.totalEchoes}</p>
                </div>
                <Users className="w-8 h-8 text-blue-500" />
              </div>
              <div className="mt-2">
                <Progress value={Math.min((stats.totalEchoes / 100) * 100, 100)} className="h-2" />
                <p className="text-xs text-gray-500 mt-1">Social connections</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Unlocked</p>
                  <p className="text-2xl font-bold">{stats.memoriesUnlocked}</p>
                </div>
                <MapPin className="w-8 h-8 text-green-500" />
              </div>
              <div className="mt-2">
                <Progress value={Math.min((stats.memoriesUnlocked / 25) * 100, 100)} className="h-2" />
                <p className="text-xs text-gray-500 mt-1">Discoveries made</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Favorite</p>
                  <p className="text-lg font-bold capitalize">{stats.favoriteEmotion}</p>
                </div>
                <Star className="w-8 h-8 text-yellow-500" />
              </div>
              <div className="mt-2">
                <Badge variant="secondary" className="text-xs">
                  Most frequent emotion
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Recent Memories */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2"
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Recent Memories
                </CardTitle>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/memories">View All</Link>
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {memories.slice(0, 5).map((memory: any, index: number) => (
                  <div key={memory.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                    <div className="flex-1">
                      <p className="font-medium line-clamp-1">
                        {memory.title || 'Untitled Memory'}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
                        {memory.description || 'No description'}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {memory.emotion}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {new Date(memory.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    {memory.audioUrl && (
                      <Button size="sm" variant="ghost">
                        <Play className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                
                {memories.length === 0 && (
                  <div className="text-center py-8">
                    <Heart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 mb-4">No memories yet</p>
                    <Button onClick={() => setShowRecorder(true)} size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Create First Memory
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Emotion Trends & Activity */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            {/* Emotion Trends */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Emotion Trends
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {emotionTrends.map((trend, index) => (
                  <div key={trend.emotion} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: trend.color }}
                      ></div>
                      <span className="text-sm capitalize">{trend.emotion}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-medium">{trend.count}</span>
                      <span className={`text-xs ml-2 ${
                        trend.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {trend.change}
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm">{activity.text}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Global Emotion Map */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Discover Emotions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <p className="text-2xl font-bold">2,847</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Memories shared today
                  </p>
                  <Button variant="outline" size="sm" className="mt-3" asChild>
                    <Link href="/discover">
                      <MapPin className="w-4 h-4 mr-2" />
                      View Map
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Voice Memory Recorder Modal */}
        <VoiceMemoryRecorder
          isOpen={showRecorder}
          onClose={() => setShowRecorder(false)}
        />
      </div>
    </div>
  );
}