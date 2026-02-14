// src/components/Sidebar.js
import React, { useState, useEffect } from 'react';
import { MessageSquare, Plus, Trash2, ChevronLeft, Sparkles, Clock, Zap, X, AlertTriangle, RefreshCw, Sun, Moon, Stars } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

// ═══════════════════════════════════════════════════════════════
// Delete Confirmation Modal Component
// ═══════════════════════════════════════════════════════════════
const DeleteConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "this conversation" 
}) => {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fadeIn"
      onClick={handleOverlayClick}
    >
      <div className="absolute inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm" />

      <div 
        className="relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-red-500/30 rounded-2xl shadow-2xl w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 pb-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0 border border-red-200 dark:border-red-500/30">
              <AlertTriangle size={24} className="text-red-600 dark:text-red-500" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Delete Conversation?</h3>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                This action cannot be undone
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg flex-shrink-0"
              aria-label="Close modal"
            >
              <X size={20} className="text-gray-400" />
            </button>
          </div>
        </div>

        <div className="px-6 pb-6">
          <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl p-4 mb-6">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              You are about to permanently delete{' '}
              <span className="text-gray-900 dark:text-white font-semibold">"{title}"</span>
            </p>
            <span className="text-xs text-gray-500 dark:text-gray-500 mt-2 block">
              All messages and data associated with this conversation will be lost forever.
            </span>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300 
                       bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 
                       rounded-xl active:scale-95 border border-gray-200 dark:border-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="flex-1 px-4 py-3 text-sm font-semibold text-white bg-red-600 
                       hover:bg-red-700 rounded-xl active:scale-95 shadow-lg 
                       shadow-red-500/20 border border-red-500/50"
            >
              Delete Forever
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// Beautiful Animated Theme Toggle Component
// ═══════════════════════════════════════════════════════════════
const SidebarThemeToggle = () => {
  const { theme, toggleTheme, isTransitioning } = useTheme();
  const [isAnimating, setIsAnimating] = useState(false);

  const handleToggle = () => {
    setIsAnimating(true);
    toggleTheme();
    
    // Reset animation state after animation completes
    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isTransitioning}
      className="relative flex items-center justify-between w-full px-4 py-3 rounded-xl 
                 bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-800/50
                 hover:from-gray-200 hover:to-gray-100 dark:hover:from-gray-700 dark:hover:to-gray-800
                 border border-gray-200 dark:border-gray-700/50
                 group overflow-hidden
                 disabled:opacity-70 disabled:cursor-wait"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {/* Background glow effect */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300
                      ${theme === 'dark' 
                        ? 'bg-gradient-to-r from-blue-500/5 to-purple-500/5' 
                        : 'bg-gradient-to-r from-yellow-500/5 to-orange-500/5'}`} 
      />
      
      {/* Left side - Icon and Label */}
      <div className="relative flex items-center gap-3">
        {/* Animated Icon Container */}
        <div className="relative w-8 h-8 flex items-center justify-center">
          {/* Sun Icon */}
          <Sun 
            size={20} 
            className={`absolute theme-toggle-icon text-yellow-500
                       ${theme === 'light' 
                         ? 'rotate-0 scale-100 opacity-100' 
                         : 'rotate-90 scale-0 opacity-0'}
                       ${isAnimating && theme === 'light' ? 'theme-toggle-sun-active' : ''}`}
          />
          {/* Moon Icon */}
          <Moon 
            size={20} 
            className={`absolute theme-toggle-icon text-blue-400
                       ${theme === 'dark' 
                         ? 'rotate-0 scale-100 opacity-100' 
                         : '-rotate-90 scale-0 opacity-0'}
                       ${isAnimating && theme === 'dark' ? 'theme-toggle-moon-active' : ''}`}
          />
          
          {/* Stars for dark mode (decorative) */}
          {theme === 'dark' && (
            <>
              <span className="absolute -top-1 -right-1 w-1 h-1 bg-yellow-300 rounded-full animate-pulse" />
              <span className="absolute top-0 -left-2 w-0.5 h-0.5 bg-yellow-200 rounded-full animate-pulse" 
                    style={{ animationDelay: '150ms' }} />
              <span className="absolute -bottom-1 right-0 w-0.5 h-0.5 bg-yellow-200 rounded-full animate-pulse" 
                    style={{ animationDelay: '300ms' }} />
            </>
          )}
        </div>
        
        {/* Label */}
        <div className="flex flex-col items-start">
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
            {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
          </span>
          <span className="text-[10px] text-gray-400 dark:text-gray-500">
            {theme === 'dark' ? 'Click for light' : 'Click for dark'}
          </span>
        </div>
      </div>
      
      {/* Right side - Toggle Switch */}
      <div className={`relative w-14 h-8 rounded-full theme-toggle-track
                      ${theme === 'dark' 
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg shadow-blue-500/20' 
                        : 'bg-gradient-to-r from-yellow-400 to-orange-400 shadow-lg shadow-yellow-500/20'}`}>
        
        {/* Track Background Pattern */}
        <div className="absolute inset-0 rounded-full overflow-hidden">
          {theme === 'dark' ? (
            // Stars pattern for dark mode
            <div className="absolute inset-0 flex items-center justify-around px-2">
              <span className="w-1 h-1 bg-white/40 rounded-full" />
              <span className="w-0.5 h-0.5 bg-white/30 rounded-full" />
              <span className="w-1 h-1 bg-white/20 rounded-full" />
            </div>
          ) : (
            // Clouds pattern for light mode
            <div className="absolute inset-0 flex items-center justify-around px-2">
              <span className="w-2 h-1 bg-white/40 rounded-full" />
              <span className="w-1.5 h-1 bg-white/30 rounded-full" />
            </div>
          )}
        </div>
        
        {/* Toggle Thumb */}
        <div className={`absolute top-1 w-6 h-6 rounded-full theme-toggle-thumb
                        flex items-center justify-center
                        ${theme === 'dark' 
                          ? 'translate-x-7 bg-gray-900 shadow-lg' 
                          : 'translate-x-1 bg-white shadow-lg'}`}>
          {theme === 'dark' ? (
            <Moon size={14} className="text-blue-400" />
          ) : (
            <Sun size={14} className="text-yellow-500" />
          )}
        </div>
      </div>
    </button>
  );
};

// ═══════════════════════════════════════════════════════════════
// Main Sidebar Component
// ═══════════════════════════════════════════════════════════════
const Sidebar = ({ 
  conversations, 
  onSelectConversation, 
  onNewChat, 
  onDeleteConversation, 
  activeId,
  isOpen,
  onToggle,
  loading = false,
  refreshing = false
}) => {
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    conversationId: null,
    conversationTitle: ''
  });

  const handleDeleteClick = (e, conv) => {
    e.stopPropagation();
    setDeleteModal({
      isOpen: true,
      conversationId: conv._id,
      conversationTitle: conv.title
    });
  };

  const handleDeleteConfirm = () => {
    if (deleteModal.conversationId) {
      onDeleteConversation(deleteModal.conversationId);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal({
      isOpen: false,
      conversationId: null,
      conversationTitle: ''
    });
  };

  const groupConversationsByDate = (convs) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);

    const groups = {
      today: [],
      yesterday: [],
      lastWeek: [],
      older: []
    };

    convs.forEach(conv => {
      const convDate = new Date(conv.updatedAt || conv.createdAt);
      if (convDate.toDateString() === today.toDateString()) {
        groups.today.push(conv);
      } else if (convDate.toDateString() === yesterday.toDateString()) {
        groups.yesterday.push(conv);
      } else if (convDate > lastWeek) {
        groups.lastWeek.push(conv);
      } else {
        groups.older.push(conv);
      }
    });

    return groups;
  };

  const groupedConversations = groupConversationsByDate(conversations);

  return (
    <>
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title={deleteModal.conversationTitle}
      />

      {/* Sidebar Toggle Button */}
      <button
        onClick={onToggle}
        className={`fixed top-4 z-50 p-2.5 rounded-xl shadow-lg active:scale-95
                   bg-white dark:bg-gray-800 
                   hover:bg-gray-100 dark:hover:bg-gray-700
                   border border-gray-200 dark:border-gray-700
                   text-gray-700 dark:text-white
                   ${isOpen ? 'left-[272px]' : 'left-4'}`}
        aria-label={isOpen ? 'Close sidebar' : 'Open sidebar'}
      >
        <ChevronLeft size={20} className={`transition-transform duration-300 ${isOpen ? '' : 'rotate-180'}`} />
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 dark:bg-black/60 backdrop-blur-sm z-30 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-40
          w-72 
          bg-gray-50 dark:bg-gray-900 
          text-gray-900 dark:text-white
          transform transition-transform duration-300 ease-in-out
          flex flex-col 
          border-r border-gray-200 dark:border-gray-800
          ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
        `}
      >
        {/* Header */}
        <div className="p-5 pb-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Sparkles size={20} className="text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                AI Assistant
              </h2>
              <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse inline-block"></span>
                Online
              </span>
            </div>
            {refreshing && (
              <div className="flex items-center justify-center">
                <RefreshCw size={16} className="text-blue-500 dark:text-blue-400 animate-spin" />
              </div>
            )}
          </div>
          
          <button
            onClick={onNewChat}
            className="group w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 
                     hover:from-blue-700 hover:to-blue-800
                     rounded-xl flex items-center justify-center 
                     gap-2.5 text-sm font-semibold text-white shadow-md 
                     shadow-blue-500/20 active:scale-95 duration-200"
          >
            <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
            New Conversation
          </button>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-6 scrollbar-thin">
          {loading ? (
            <LoadingState />
          ) : conversations.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="relative">
              {refreshing && conversations.length > 0 && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 animate-pulse rounded-full" />
              )}
              
              {groupedConversations.today.length > 0 && (
                <ConversationGroup 
                  title="Today" 
                  conversations={groupedConversations.today}
                  activeId={activeId}
                  onSelectConversation={onSelectConversation}
                  onDeleteClick={handleDeleteClick}
                />
              )}
              {groupedConversations.yesterday.length > 0 && (
                <ConversationGroup 
                  title="Yesterday" 
                  conversations={groupedConversations.yesterday}
                  activeId={activeId}
                  onSelectConversation={onSelectConversation}
                  onDeleteClick={handleDeleteClick}
                />
              )}
              {groupedConversations.lastWeek.length > 0 && (
                <ConversationGroup 
                  title="Last 7 Days" 
                  conversations={groupedConversations.lastWeek}
                  activeId={activeId}
                  onSelectConversation={onSelectConversation}
                  onDeleteClick={handleDeleteClick}
                />
              )}
              {groupedConversations.older.length > 0 && (
                <ConversationGroup 
                  title="Older" 
                  conversations={groupedConversations.older}
                  activeId={activeId}
                  onSelectConversation={onSelectConversation}
                  onDeleteClick={handleDeleteClick}
                />
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800 space-y-3">
          {/* Beautiful Theme Toggle */}
          <SidebarThemeToggle />
          
          {/* Stats */}
          <div className="bg-gray-100 dark:bg-gray-800/50 rounded-xl p-3 border border-gray-200 dark:border-gray-700/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Response Time</span>
              <div className="flex items-center gap-1.5">
                <Zap size={12} className="text-yellow-500" />
                <span className="text-xs font-semibold text-gray-700 dark:text-white">~2s</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Conversations</span>
              <span className="text-xs font-semibold text-gray-700 dark:text-white">{conversations.length}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse inline-block"></span>
              <span className="font-medium">Powered by Groq AI</span>
            </div>
          </div>
          <p className="text-center text-xs text-gray-400 dark:text-gray-500 font-medium">
            Llama 3.3 70B Versatile
          </p>
        </div>
      </aside>
    </>
  );
};

// ═══════════════════════════════════════════════════════════════
// Supporting Components
// ═══════════════════════════════════════════════════════════════

const LoadingState = () => {
  return (
    <div className="text-center text-gray-500 dark:text-gray-400 mt-12 px-4">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-gray-200 dark:border-gray-700 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
        <div className="space-y-2">
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Loading conversations...</p>
          <span className="text-xs text-gray-400 dark:text-gray-500 block">Please wait</span>
        </div>
      </div>
      
      <div className="mt-8 space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="h-12 bg-gray-200 dark:bg-gray-800/50 rounded-xl"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

const EmptyState = () => {
  return (
    <div className="text-center text-gray-500 dark:text-gray-500 mt-12 px-4">
      <div className="bg-gray-100 dark:bg-gray-800/30 p-6 rounded-2xl inline-block mb-4">
        <MessageSquare size={32} className="opacity-50 mx-auto text-gray-400 dark:text-gray-500" />
      </div>
      <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">No conversations yet</p>
      <span className="text-xs text-gray-400 dark:text-gray-600 block">Start a new chat to begin your journey</span>
    </div>
  );
};

const ConversationGroup = ({ title, conversations, activeId, onSelectConversation, onDeleteClick }) => {
  return (
    <div className="space-y-1 mb-6">
      <h3 className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-2 mb-2 flex items-center gap-2">
        <Clock size={12} />
        {title}
      </h3>
      {conversations.map((conv) => (
        <ConversationItem
          key={conv._id}
          conv={conv}
          isActive={activeId === conv._id}
          onSelect={() => onSelectConversation(conv._id)}
          onDelete={(e) => onDeleteClick(e, conv)}
        />
      ))}
    </div>
  );
};

const ConversationItem = ({ conv, isActive, onSelect, onDelete }) => {
  const [isNew, setIsNew] = useState(false);

  useEffect(() => {
    const convDate = new Date(conv.createdAt);
    const now = new Date();
    const isRecentlyCreated = (now - convDate) < 2000;
    
    if (isRecentlyCreated) {
      setIsNew(true);
      const timer = setTimeout(() => setIsNew(false), 500);
      return () => clearTimeout(timer);
    }
  }, [conv.createdAt]);

  return (
    <div
      onClick={onSelect}
      className={`group relative px-3.5 py-3 rounded-xl cursor-pointer 
                 ${isActive 
                   ? 'bg-blue-100 dark:bg-blue-600/20 border border-blue-200 dark:border-blue-500/30' 
                   : 'hover:bg-gray-100 dark:hover:bg-gray-800/60 border border-transparent'
                 }
                 ${isNew ? 'animate-slideInLeft' : ''}`}
    >
      <div className="flex items-center gap-3">
        <span className={`w-2 h-2 rounded-full flex-shrink-0 inline-block
                        ${isActive ? 'bg-blue-500 dark:bg-blue-400' : 'bg-gray-300 dark:bg-gray-600'}`}></span>
        <MessageSquare
          size={16}
          className={`flex-shrink-0 
                     ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}`}
        />
        <span className={`flex-1 text-sm truncate font-medium 
                         ${isActive ? 'text-blue-700 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>
          {conv.title}
        </span>
        <button
          onClick={onDelete}
          className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-100 dark:hover:bg-red-500/20 
                   rounded-lg active:scale-90"
          aria-label="Delete conversation"
        >
          <Trash2 size={14} className="text-red-500 dark:text-red-400" />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;