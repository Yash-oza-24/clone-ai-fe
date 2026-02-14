// src/App.js
import { useState, useEffect, useCallback } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import * as api from './services/api';
import { AlertCircle, WifiOff } from 'lucide-react';

function AppContent() {
  const [conversations, setConversations] = useState([]);
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [error, setError] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [initialLoading, setInitialLoading] = useState(true);
  const [sidebarRefreshing, setSidebarRefreshing] = useState(false);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setError(null);
    };
    const handleOffline = () => {
      setIsOnline(false);
      setError('No internet connection. Please check your network.');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Load conversations on mount
  useEffect(() => {
    loadConversations();
  }, []);

  // Auto-open sidebar on desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const loadConversations = async () => {
    try {
      setInitialLoading(true);
      const data = await api.getConversations();
      setConversations(data.conversations || []);
      setError(null);
    } catch (error) {
      console.error('Error loading conversations:', error);
      setError('Failed to load conversations. Please refresh the page.');
      setConversations([]);
    } finally {
      setInitialLoading(false);
    }
  };

  const refreshConversations = useCallback(async () => {
    try {
      setSidebarRefreshing(true);
      const data = await api.getConversations();
      setConversations(data.conversations || []);
    } catch (error) {
      console.error('Error refreshing conversations:', error);
    } finally {
      setSidebarRefreshing(false);
    }
  }, []);

  const handleSelectConversation = async (id) => {
    if (id === currentConversationId) {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      }
      return;
    }

    try {
      setLoading(true);
      const data = await api.getConversation(id);
      setCurrentConversationId(id);
      
      const existingMessages = (data.conversation?.messages || []).map(msg => ({
        ...msg,
        isComplete: true
      }));
      setMessages(existingMessages);
      setError(null);
      
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      }
    } catch (error) {
      console.error('Error loading conversation:', error);
      setError('Failed to load conversation. Please try again.');
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  const handleNewChat = () => {
    setCurrentConversationId(null);
    setMessages([]);
    setInput('');
    setError(null);
    
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  const handleDeleteConversation = async (id) => {
    try {
      await api.deleteConversation(id);
      setConversations(prev => prev.filter(conv => conv._id !== id));
      
      if (currentConversationId === id) {
        handleNewChat();
      }
      
      setError(null);
    } catch (error) {
      console.error('Error deleting conversation:', error);
      setError('Failed to delete conversation. Please try again.');
      refreshConversations();
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    if (!isOnline) {
      setError('Cannot send message. No internet connection.');
      return;
    }

    const userMessage = input.trim();
    setInput('');
    
    const optimisticUserMessage = { 
      role: 'user', 
      content: userMessage,
      isComplete: true
    };
    setMessages(prev => [...prev, optimisticUserMessage]);
    setLoading(true);
    setError(null);

    try {
      const data = await api.sendMessage(userMessage, currentConversationId);
      
      const responseMessages = data.conversation?.messages || [];
      
      const processedMessages = responseMessages.map((msg, index) => {
        const isNewBotMessage = index === responseMessages.length - 1 && msg.role === 'assistant';
        return {
          ...msg,
          isComplete: !isNewBotMessage
        };
      });
      
      setMessages(processedMessages);
      
      const newConversationId = data.conversationId || data.conversation?._id;
      if (!currentConversationId && newConversationId) {
        setCurrentConversationId(newConversationId);
      }
      
      refreshConversations();
      
    } catch (error) {
      console.error('Error sending message:', error);
      
      const errorMessage = {
        role: 'assistant',
        content: '❌ Sorry, I encountered an error processing your request. Please try again.',
        isComplete: true
      };
      setMessages(prev => [...prev, errorMessage]);
      
      setError('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-white dark:bg-gray-950 transition-colors duration-300">
      {/* Error Toast */}
      {error && (
        <ErrorToast 
          message={error} 
          onClose={() => setError(null)}
          isOnline={isOnline}
        />
      )}

      {/* Offline Indicator */}
      {!isOnline && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-red-500 text-white px-4 py-2 text-center text-sm font-medium flex items-center justify-center gap-2">
          <WifiOff size={16} />
          No internet connection
        </div>
      )}

      {/* Main Layout */}
      <Sidebar
        conversations={conversations}
        onSelectConversation={handleSelectConversation}
        onNewChat={handleNewChat}
        onDeleteConversation={handleDeleteConversation}
        activeId={currentConversationId}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        loading={initialLoading}
        refreshing={sidebarRefreshing}
      />
      
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'lg:ml-72' : 'ml-0'}`}>
        <ChatArea
          messages={messages}
          setMessages={setMessages}
          input={input}
          setInput={setInput}
          onSendMessage={handleSendMessage}
          loading={loading}
          isOnline={isOnline}
          currentChatId={currentConversationId}
        />
      </div>
    </div>
  );
}

// Error Toast Component
const ErrorToast = ({ message, onClose, isOnline }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [message, onClose]);

  return (
    <div className={`fixed ${isOnline ? 'top-4' : 'top-16'} right-4 z-50 animate-slideIn`}>
      <div className="bg-red-500 dark:bg-red-600 text-white px-5 py-4 rounded-xl shadow-2xl flex items-start gap-3 max-w-md border border-red-400 dark:border-red-500">
        <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm font-medium leading-relaxed">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="flex-shrink-0 hover:bg-red-600 dark:hover:bg-red-700 rounded-lg p-1 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

// Main App with Theme Provider
function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;