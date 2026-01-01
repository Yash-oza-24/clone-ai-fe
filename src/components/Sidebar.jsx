import React, { useState, useEffect } from 'react';
import { MessageSquare, Plus, Trash2, ChevronLeft, Sparkles, Clock, Zap, X, AlertTriangle } from 'lucide-react';

// ═══════════════════════════════════════════════════════════════
// Delete Confirmation Modal Component (Separate & Reusable)
// ═══════════════════════════════════════════════════════════════
const DeleteConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "this conversation" 
}) => {
  if (!isOpen) return null;

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={handleOverlayClick}
    >
      {/* Backdrop with blur */}
      <div className="absolute inset-0 backdrop-blur-md" />

      {/* Modal Container */}
      <div 
        className="relative bg-gray-900 border border-red-500/30 rounded-2xl shadow-2xl w-full max-w-md 
                   animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Icon */}
        <div className="p-6 pb-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0 border border-red-500/30">
              <AlertTriangle size={24} className="text-red-500" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-1">Delete Conversation?</h3>
              <p className="text-sm text-gray-400">
                This action cannot be undone
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-gray-800 rounded-lg transition-colors flex-shrink-0"
              aria-label="Close modal"
            >
              <X size={20} className="text-gray-400" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pb-6">
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4 mb-6">
            <p className="text-sm text-gray-300">
              You are about to permanently delete{' '}
              <span className="text-white font-semibold">"{title}"</span>
            </p>
            <p className="text-xs text-gray-500 mt-2">
              All messages and data associated with this conversation will be lost forever.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 text-sm font-semibold text-gray-300 bg-gray-800 
                       hover:bg-gray-700 rounded-xl transition-all active:scale-95 border border-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="flex-1 px-4 py-3 text-sm font-semibold text-white bg-red-600 
                       hover:bg-red-700 rounded-xl transition-all active:scale-95 shadow-lg 
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
  loading = false
}) => {
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    conversationId: null,
    conversationTitle: ''
  });

  // Handle delete click
  const handleDeleteClick = (e, conv) => {
    e.stopPropagation();
    setDeleteModal({
      isOpen: true,
      conversationId: conv._id,
      conversationTitle: conv.title
    });
  };

  // Handle delete confirm
  const handleDeleteConfirm = () => {
    if (deleteModal.conversationId) {
      onDeleteConversation(deleteModal.conversationId);
    }
  };

  // Handle delete cancel
  const handleDeleteCancel = () => {
    setDeleteModal({
      isOpen: false,
      conversationId: null,
      conversationTitle: ''
    });
  };

  // Group conversations by date
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
      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title={deleteModal.conversationTitle}
      />

      {/* Sidebar Toggle Button */}
      <button
        onClick={onToggle}
        className={`fixed top-4 z-50 p-2.5 bg-gray-800 dark:bg-gray-700 text-white rounded-xl 
                   hover:bg-gray-700 dark:hover:bg-gray-600 transition-all shadow-lg 
                   border border-gray-700/50 ${isOpen ? 'left-[272px]' : 'left-4'}`}
        aria-label={isOpen ? 'Close sidebar' : 'Open sidebar'}
      >
        <ChevronLeft size={20} className={`transition-transform duration-300 ${isOpen ? '' : 'rotate-180'}`} />
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-40
          w-72 bg-gray-900 dark:bg-gray-950 text-white
          transform transition-all duration-300 ease-in-out
          flex flex-col border-r border-gray-800 dark:border-gray-900
          ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
        `}
      >
        {/* Header */}
        <div className="p-5 pb-4 border-b border-gray-800 dark:border-gray-900">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <Sparkles size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                AI Assistant
              </h2>
              <p className="text-xs text-gray-400 flex items-center gap-1.5 mt-0.5">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                Online
              </p>
            </div>
          </div>
          <button
            onClick={onNewChat}
            className="group w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 
                     dark:hover:bg-blue-700 rounded-xl transition-all flex items-center justify-center 
                     gap-2.5 text-sm font-semibold shadow-md active:scale-95 duration-200"
          >
            <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
            New Conversation
          </button>
        </div>

        {/* Conversations List with Groups */}
        <div className="flex-1 overflow-y-auto p-3 space-y-6 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
          {loading ? (
            <LoadingState />
          ) : conversations.length === 0 ? (
            <EmptyState />
          ) : (
            <>
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
            </>
          )}
        </div>

        {/* Footer with Stats */}
        <div className="p-4 border-t border-gray-800 dark:border-gray-900">
          <div className="bg-gray-800/50 dark:bg-gray-900/50 rounded-xl p-3 border border-gray-700/30 mb-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-400">Response Time</span>
              <div className="flex items-center gap-1.5">
                <Zap size={12} className="text-yellow-500" />
                <span className="text-xs font-semibold text-white">~2s</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-400">Conversations</span>
              <span className="text-xs font-semibold text-white">{conversations.length}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="font-medium">Powered by Groq AI</span>
            </div>
          </div>
          <p className="text-center text-xs text-gray-500 mt-1.5 font-medium">
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
    <div className="text-center text-gray-400 mt-12 px-4">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-gray-700 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
        <div className="space-y-2">
          <p className="text-sm font-semibold text-gray-300">Loading conversations...</p>
          <p className="text-xs text-gray-500">Please wait</p>
        </div>
      </div>
      
      <div className="mt-8 space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="h-12 bg-gray-800/50 rounded-xl"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

const EmptyState = () => {
  return (
    <div className="text-center text-gray-500 mt-12 px-4">
      <div className="bg-gray-800/30 p-6 rounded-2xl inline-block mb-4">
        <MessageSquare size={32} className="opacity-50 mx-auto" />
      </div>
      <p className="text-sm font-semibold text-gray-400 mb-1">No conversations yet</p>
      <p className="text-xs text-gray-600">Start a new chat to begin your journey</p>
    </div>
  );
};

const ConversationGroup = ({ title, conversations, activeId, onSelectConversation, onDeleteClick }) => {
  return (
    <div className="space-y-1">
      <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider px-2 mb-2 flex items-center gap-2">
        <Clock size={12} />
        {title}
      </h3>
      {conversations.map((conv) => (
        <div
          key={conv._id}
          onClick={() => onSelectConversation(conv._id)}
          className={`group relative px-3.5 py-3 rounded-xl cursor-pointer transition-all duration-200 
                     ${activeId === conv._id 
                       ? 'bg-blue-600/20 border border-blue-500/30' 
                       : 'hover:bg-gray-800/60 dark:hover:bg-gray-900/60 border border-transparent'
                     }`}
        >
          <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${activeId === conv._id ? 'bg-blue-400' : 'bg-gray-600'}`}></div>
            <MessageSquare
              size={16}
              className={`flex-shrink-0 ${activeId === conv._id ? 'text-blue-400' : 'text-gray-500'}`}
            />
            <span className={`flex-1 text-sm truncate font-medium ${activeId === conv._id ? 'text-white' : 'text-gray-300'}`}>
              {conv.title}
            </span>
            <button
              onClick={(e) => onDeleteClick(e, conv)}
              className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-500/20 
                       rounded-lg transition-all active:scale-90"
              aria-label="Delete conversation"
            >
              <Trash2 size={14} className="text-red-400" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Sidebar;