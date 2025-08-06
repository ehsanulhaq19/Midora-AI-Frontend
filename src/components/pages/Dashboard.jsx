// src/components/pages/Dashboard.jsx - Light Theme Version
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authHelpers } from '../../services/authHelpers';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalChats: 0,
    totalMessages: 0,
    favoriteModel: 'Claude Sonnet 4'
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (!authHelpers.isAuthenticated()) {
      navigate('/login');
      return;
    }

    const currentUser = authHelpers.getCurrentUser();
    setUser(currentUser);
    loadDashboardStats();
  }, [navigate]);

  const loadDashboardStats = async () => {
    try {
      setStats({
        totalChats: 12,
        totalMessages: 156,
        favoriteModel: 'Claude Sonnet 4',
        lastActiveDate: new Date().toLocaleDateString()
      });
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authHelpers.logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      navigate('/login');
    }
  };

  const handleStartChat = () => {
    navigate('/chat');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  const quickActions = [
    {
      icon: "💬",
      title: "New Chat",
      description: "Start a fresh conversation",
      color: "from-blue-500 to-cyan-500",
      action: handleStartChat
    },
    {
      icon: "📜",
      title: "Chat History",
      description: "View previous conversations",
      color: "from-purple-500 to-pink-500",
      action: () => navigate('/chat')
    },
    {
      icon: "🎯",
      title: "Templates",
      description: "Use pre-made prompts",
      color: "from-green-500 to-emerald-500",
      action: () => navigate('/chat')
    },
    {
      icon: "⚙️",
      title: "Settings",
      description: "Customize your experience",
      color: "from-orange-500 to-red-500",
      action: () => navigate('/chat')
    }
  ];

  const recentChats = [
    { title: "Code Review Assistant", time: "2 hours ago", model: "Claude Sonnet 4" },
    { title: "Creative Writing Help", time: "1 day ago", model: "Claude Sonnet 4" },
    { title: "Data Analysis Project", time: "3 days ago", model: "GPT-4" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/95 backdrop-blur-sm sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h1 className="text-xl font-semibold text-gray-900">AI Chat</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-white">
                    {(user?.name || user?.email || 'U').charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-gray-700 hidden sm:block">
                  {user?.name || user?.email || 'User'}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="text-gray-500 hover:text-gray-700 transition-colors p-2 hover:bg-gray-100 rounded-lg"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome back, {user?.name?.split(' ')[0] || 'there'}
          </h1>
          <p className="text-xl text-gray-600">
            Ready to have another productive conversation?
          </p>
        </div>

        {/* Quick Actions Grid */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                className="group relative overflow-hidden bg-white border border-gray-200 rounded-2xl p-6 text-left transition-all duration-300 hover:border-purple-300 hover:scale-[1.02] hover:shadow-xl shadow-sm"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                <div className="relative">
                  <div className="text-3xl mb-3">{action.icon}</div>
                  <h3 className="font-semibold text-gray-900 mb-2">{action.title}</h3>
                  <p className="text-gray-600 text-sm">{action.description}</p>
                  <div className="mt-4 flex items-center text-purple-600 text-sm">
                    <span>Get started</span>
                    <svg className="ml-1 h-4 w-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Chats */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Recent Conversations</h2>
            <div className="space-y-4">
              {recentChats.map((chat, index) => (
                <div
                  key={index}
                  className="bg-white border border-gray-200 rounded-xl p-6 hover:border-purple-300 hover:shadow-md transition-all duration-200 cursor-pointer group shadow-sm"
                  onClick={handleStartChat}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 group-hover:text-purple-600 transition-colors">
                        {chat.title}
                      </h3>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                        <span>{chat.time}</span>
                        <span>•</span>
                        <span>{chat.model}</span>
                      </div>
                    </div>
                    <svg className="h-5 w-5 text-gray-400 group-hover:text-purple-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              ))}

              {recentChats.length === 0 && (
                <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                  <div className="text-6xl mb-4">💬</div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">No conversations yet</h3>
                  <p className="text-gray-600 mb-6">Start your first chat to see it here</p>
                  <button
                    onClick={handleStartChat}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-[1.02] shadow-md"
                  >
                    Start First Chat
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Stats Sidebar */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Your Stats</h2>
              <div className="space-y-4">
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-center">
                    <div className="text-2xl mr-3">💬</div>
                    <div>
                      <p className="text-sm text-gray-600">Total Chats</p>
                      <p className="text-2xl font-semibold text-gray-900">{stats.totalChats}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-center">
                    <div className="text-2xl mr-3">📝</div>
                    <div>
                      <p className="text-sm text-gray-600">Messages Sent</p>
                      <p className="text-2xl font-semibold text-gray-900">{stats.totalMessages}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-center">
                    <div className="text-2xl mr-3">🤖</div>
                    <div>
                      <p className="text-sm text-gray-600">Favorite Model</p>
                      <p className="text-sm font-semibold text-gray-900">{stats.favoriteModel}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Tips */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 border border-purple-200 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-3">💡 Pro Tips</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Be specific in your questions</li>
                <li>• Use examples for better results</li>
                <li>• Break complex tasks into steps</li>
                <li>• Try different AI models for variety</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;