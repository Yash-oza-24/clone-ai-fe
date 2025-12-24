import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import * as api from './services/api';
import { AlertCircle, Wifi, WifiOff } from 'lucide-react';

function App() {
  const [conversations, setConversations] = useState([]);
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [error, setError] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [initialLoading, setInitialLoading] = useState(true);

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

  const handleSelectConversation = async (id) => {
    if (id === currentConversationId) {
      // Close sidebar on mobile when selecting same conversation
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      }
      return;
    }

    try {
      setLoading(true);
      const data = await api.getConversation(id);
      setCurrentConversationId(id);
      setMessages(data.conversation?.messages || []);
      setError(null);
      
      // Close sidebar on mobile after selection
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
    
    // Close sidebar on mobile
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  const handleDeleteConversation = async (id) => {
    // Confirm deletion
    if (!window.confirm('Are you sure you want to delete this conversation?')) {
      return;
    }

    try {
      await api.deleteConversation(id);
      
      // Update conversations list optimistically
      setConversations(prev => prev.filter(conv => conv._id !== id));
      
      // Clear current conversation if it's the deleted one
      if (currentConversationId === id) {
        handleNewChat();
      }
      
      setError(null);
    } catch (error) {
      console.error('Error deleting conversation:', error);
      setError('Failed to delete conversation. Please try again.');
      // Reload conversations to sync state
      loadConversations();
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
    
    // Optimistically add user message
    const optimisticUserMessage = { role: 'user', content: userMessage };
    setMessages(prev => [...prev, optimisticUserMessage]);
    setLoading(true);
    setError(null);

    try {
      const data = await api.sendMessage(userMessage, currentConversationId);
      
      // Update messages with actual response
      setMessages(data.conversation?.messages || []);
      
      // Update conversation ID if it's a new conversation
      if (!currentConversationId && data.conversationId) {
        setCurrentConversationId(data.conversationId);
      }
      
      // Reload conversations to update sidebar
      loadConversations();
      
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Add error message to chat
      const errorMessage = {
        role: 'assistant',
        content: '❌ Sorry, I encountered an error processing your request. Please try again.'
      };
      setMessages(prev => [...prev, errorMessage]);
      
      // Set error state
      setError('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-black dark:to-gray-950">
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
      />
      
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'lg:ml-72' : 'ml-0'}`}>
        <ChatArea
          messages={messages}
          input={input}
          setInput={setInput}
          onSendMessage={handleSendMessage}
          loading={loading}
          isOnline={isOnline}
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

export default App;