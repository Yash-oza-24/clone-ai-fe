// src/components/ChatArea.js
import React, { useEffect, useRef, useState, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { 
  User, Bot, Send, Sparkles, Zap, Code, Lightbulb, Copy, Check, 
  TrendingUp, Rocket, Brain, Star, Sun, Moon, MessageSquare 
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

// ═══════════════════════════════════════════════════════════════
// Main ChatArea Component
// ═══════════════════════════════════════════════════════════════
const ChatArea = ({ messages, setMessages, input, setInput, onSendMessage, loading, currentChatId }) => {
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const { theme, isDark } = useTheme();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const newHeight = Math.min(textareaRef.current.scrollHeight, 200);
      textareaRef.current.style.height = newHeight + 'px';
    }
  }, [input]);

  const handleMessageComplete = useCallback((messageIndex) => {
    if (setMessages) {
      setMessages(prevMessages => 
        prevMessages.map((msg, idx) => 
          idx === messageIndex 
            ? { ...msg, isComplete: true }
            : msg
        )
      );
    }
  }, [setMessages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !loading) {
      onSendMessage();
      if (textareaRef.current) {
        textareaRef.current.style.height = '52px';
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="flex-1 flex flex-col relative overflow-hidden
                    bg-gradient-to-b from-gray-50 via-white to-gray-50 
                    dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Light mode decorations */}
        <div className={`absolute top-20 left-10 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl
                        transition-opacity duration-500 ${isDark ? 'opacity-0' : 'opacity-100'}`} />
        <div className={`absolute bottom-40 right-10 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl
                        transition-opacity duration-500 ${isDark ? 'opacity-0' : 'opacity-100'}`} />
        
        {/* Dark mode decorations */}
        <div className={`absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl
                        transition-opacity duration-500 ${isDark ? 'opacity-100' : 'opacity-0'}`} />
        <div className={`absolute bottom-40 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl
                        transition-opacity duration-500 ${isDark ? 'opacity-100' : 'opacity-0'}`} />
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto relative z-10">
        <div className="max-w-5xl mx-auto px-3 sm:px-4 lg:px-8">
          {messages.length === 0 ? (
            <WelcomeScreen onSuggestionClick={setInput} />
          ) : (
            <div className="py-4 sm:py-8 space-y-4 sm:space-y-6">
              {messages.map((msg, index) => (
                <MessageBubble 
                  key={`${currentChatId}-${index}`}
                  message={msg} 
                  index={index} 
                  isLatest={index === messages.length - 1} 
                  loading={loading}
                  onMessageComplete={handleMessageComplete}
                  chatId={currentChatId}
                />
              ))}
              {loading && messages.length > 0 && messages[messages.length - 1].role === 'user' && (
                <TypingIndicator />
              )}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Form */}
      <div className="relative z-10 border-t border-gray-200/80 dark:border-gray-800/80
                      bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-3 sm:px-4 lg:px-8 py-3 sm:py-4">
          <form onSubmit={handleSubmit} className="relative">
            <div className="relative group">
              {/* Input glow effect */}
              <div className={`absolute -inset-1 rounded-2xl blur-lg transition-all duration-300
                             ${input.trim() 
                               ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-100' 
                               : 'opacity-0'}
                             group-focus-within:opacity-100`} />
              
              <div className="relative">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask me anything..."
                  disabled={loading}
                  rows="1"
                  className="w-full px-4 sm:px-5 py-3 sm:py-4 pr-12 sm:pr-14 
                           rounded-2xl border-2 
                           border-gray-200 dark:border-gray-700 
                           bg-white dark:bg-gray-900 
                           text-gray-900 dark:text-gray-100
                           placeholder:text-gray-400 dark:placeholder:text-gray-500
                           focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 
                           focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-blue-500/20
                           disabled:opacity-50 disabled:cursor-not-allowed
                           resize-none shadow-sm
                           font-medium text-sm sm:text-base
                           scrollbar-hide overflow-y-auto"
                  style={{ minHeight: '52px', maxHeight: '200px' }}
                />
                
                {/* Send Button */}
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="absolute right-2 bottom-2.5 p-2.5 sm:p-3 rounded-xl
                           bg-gradient-to-r from-blue-600 to-blue-700
                           hover:from-blue-700 hover:to-blue-800
                           text-white shadow-lg shadow-blue-500/25
                           disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-none
                           active:scale-95 disabled:active:scale-100
                           transition-all duration-200"
                >
                  {loading ? (
                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Send size={16} className="sm:w-[18px] sm:h-[18px]" />
                  )}
                </button>
              </div>
            </div>
            
            {/* Quick Info Footer */}
            <div className="flex items-center justify-between mt-2 sm:mt-3 text-[10px] sm:text-xs">
              <div className="flex items-center gap-2 sm:gap-4 text-gray-500 dark:text-gray-500">
                <span className="flex items-center gap-1 sm:gap-1.5 px-2 py-1 rounded-lg
                               bg-gray-100 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50">
                  <Zap size={10} className="sm:w-3 sm:h-3 text-yellow-500" />
                  <span className="font-medium">Groq AI</span>
                </span>
                <span className="flex items-center gap-1 sm:gap-1.5 px-2 py-1 rounded-lg
                               bg-gray-100 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50">
                  <Brain size={10} className="sm:w-3 sm:h-3 text-purple-500" />
                  <span className="font-medium">Llama 3.3</span>
                </span>
              </div>
              <span className="text-gray-400 dark:text-gray-600 hidden sm:flex items-center gap-1.5">
                Press 
                <kbd className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded-md font-mono text-[10px] 
                              border border-gray-200 dark:border-gray-700 shadow-sm">
                  Enter
                </kbd> 
                to send
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// Welcome Screen Component
// ═══════════════════════════════════════════════════════════════
const WelcomeScreen = ({ onSuggestionClick }) => {
  const { isDark } = useTheme();
  
  const suggestions = [
    {
      icon: Code,
      title: "Code Assistant",
      text: "Write a Python function to sort an array",
      gradient: "from-blue-500 to-cyan-500",
      lightBg: "from-blue-50 to-cyan-50",
      darkBg: "from-blue-500/10 to-cyan-500/10",
      borderLight: "border-blue-200",
      borderDark: "border-blue-500/30",
      iconColor: "text-blue-600 dark:text-blue-400"
    },
    {
      icon: Lightbulb,
      title: "Explain Concepts",
      text: "Explain quantum computing in simple terms",
      gradient: "from-yellow-500 to-orange-500",
      lightBg: "from-yellow-50 to-orange-50",
      darkBg: "from-yellow-500/10 to-orange-500/10",
      borderLight: "border-yellow-200",
      borderDark: "border-yellow-500/30",
      iconColor: "text-yellow-600 dark:text-yellow-400"
    },
    {
      icon: TrendingUp,
      title: "Tech Trends",
      text: "What are the latest web development trends?",
      gradient: "from-green-500 to-emerald-500",
      lightBg: "from-green-50 to-emerald-50",
      darkBg: "from-green-500/10 to-emerald-500/10",
      borderLight: "border-green-200",
      borderDark: "border-green-500/30",
      iconColor: "text-green-600 dark:text-green-400"
    },
    {
      icon: Rocket,
      title: "Creative Ideas",
      text: "Help me plan a trip to Japan",
      gradient: "from-purple-500 to-pink-500",
      lightBg: "from-purple-50 to-pink-50",
      darkBg: "from-purple-500/10 to-pink-500/10",
      borderLight: "border-purple-200",
      borderDark: "border-purple-500/30",
      iconColor: "text-purple-600 dark:text-purple-400"
    }
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-180px)] px-4 py-8 sm:py-12">
      {/* Hero Section */}
      <div className="mb-8 sm:mb-12 text-center relative">
        {/* Animated background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                       w-48 sm:w-64 h-48 sm:h-64 rounded-full blur-3xl animate-pulse
                       bg-gradient-to-r from-blue-500/20 to-purple-500/20" />
        
        {/* Logo */}
        <div className="relative mb-6 sm:mb-8 inline-block">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl sm:rounded-3xl blur-2xl opacity-30 animate-pulse" />
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 
                         bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 
                         rounded-2xl sm:rounded-3xl flex items-center justify-center 
                         shadow-2xl shadow-blue-500/30">
            <Sparkles size={32} className="sm:w-10 sm:h-10 text-white" />
          </div>
        </div>
        
        {/* Title */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold mb-3 sm:mb-4 
                      bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 
                      dark:from-white dark:via-gray-200 dark:to-white 
                      bg-clip-text text-transparent leading-tight px-4">
          How can I assist you?
        </h1>
        
        {/* Subtitle */}
        <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-lg md:text-xl 
                     max-w-2xl mx-auto leading-relaxed px-4">
          Ask me anything. I'm powered by{' '}
          <span className="font-semibold bg-gradient-to-r from-blue-600 to-blue-500 
                          dark:from-blue-400 dark:to-blue-300 bg-clip-text text-transparent">
            Groq AI
          </span>
          {' '}with{' '}
          <span className="font-semibold bg-gradient-to-r from-purple-600 to-purple-500 
                          dark:from-purple-400 dark:to-purple-300 bg-clip-text text-transparent">
            Llama 3.3 70B
          </span>
        </p>
      </div>

      {/* Suggestion Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full max-w-3xl mb-8 sm:mb-12">
        {suggestions.map((suggestion, index) => {
          const IconComponent = suggestion.icon;
          return (
            <button
              key={index}
              onClick={() => onSuggestionClick(suggestion.text)}
              className={`group relative p-4 sm:p-5 rounded-xl sm:rounded-2xl 
                         bg-gradient-to-br ${isDark ? suggestion.darkBg : suggestion.lightBg}
                         border-2 ${isDark ? suggestion.borderDark : suggestion.borderLight}
                         hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]
                         transition-all duration-300 text-left overflow-hidden`}
            >
              {/* Hover gradient overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${suggestion.gradient} 
                             opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
              
              <div className="relative flex items-start gap-3 sm:gap-4">
                {/* Icon */}
                <div className={`p-2 sm:p-3 rounded-lg sm:rounded-xl 
                               bg-gradient-to-br ${suggestion.gradient} 
                               shadow-lg group-hover:scale-110 group-hover:rotate-3
                               transition-transform duration-300 flex-shrink-0`}>
                  <IconComponent size={18} className="sm:w-5 sm:h-5 text-white" />
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className={`text-xs sm:text-sm font-bold mb-1 sm:mb-1.5 ${suggestion.iconColor}`}>
                    {suggestion.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-2">
                    {suggestion.text}
                  </p>
                </div>
              </div>
              
              {/* Shine effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full 
                             transition-transform duration-1000 
                             bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </button>
          );
        })}
      </div>

      {/* Feature Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm">
        {[
          { icon: Zap, text: 'Lightning Fast', gradient: 'from-yellow-500 to-orange-500' },
          { icon: Brain, text: 'Smart AI', gradient: 'from-purple-500 to-pink-500' },
          { icon: Star, text: 'Always Learning', gradient: 'from-blue-500 to-cyan-500' }
        ].map((feature, index) => {
          const FeatureIcon = feature.icon;
          return (
            <div
              key={index}
              className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 
                        rounded-full bg-white dark:bg-gray-900 
                        border border-gray-200 dark:border-gray-800
                        shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className={`p-0.5 sm:p-1 rounded-full bg-gradient-to-br ${feature.gradient}`}>
                <FeatureIcon size={10} className="sm:w-3 sm:h-3 text-white" />
              </div>
              <span className="text-gray-700 dark:text-gray-300 font-medium whitespace-nowrap">
                {feature.text}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// Code Block Component with Theme Support
// ═══════════════════════════════════════════════════════════════
const CodeBlock = ({ language, value }) => {
  const [copied, setCopied] = useState(false);
  const { isDark } = useTheme();

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group my-4 sm:my-6 rounded-xl overflow-hidden 
                   border border-gray-200 dark:border-gray-700/50 
                   shadow-lg hover:shadow-xl transition-shadow duration-300">
      {/* Header */}
      <div className="flex items-center justify-between px-3 sm:px-5 py-2 sm:py-3 
                     bg-gray-100 dark:bg-gray-800 
                     border-b border-gray-200 dark:border-gray-700/50">
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language indicator dots */}
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500/80" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <span className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 ml-2">
            <Code size={12} className="sm:w-[14px] sm:h-[14px] text-blue-500 dark:text-blue-400" />
            <span className="text-[10px] sm:text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
              {language || 'code'}
            </span>
          </div>
        </div>
        
        {/* Copy button */}
        <button
          onClick={handleCopy}
          className={`flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 
                     text-[10px] sm:text-xs font-medium rounded-md sm:rounded-lg 
                     transition-all duration-200 active:scale-95
                     ${copied 
                       ? 'bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 border-green-200 dark:border-green-500/30' 
                       : 'bg-gray-200 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-300 dark:hover:bg-gray-700'}
                     border`}
        >
          {copied ? (
            <>
              <Check size={12} className="sm:w-[14px] sm:h-[14px]" />
              <span className="hidden xs:inline">Copied!</span>
            </>
          ) : (
            <>
              <Copy size={12} className="sm:w-[14px] sm:h-[14px]" />
              <span className="hidden xs:inline">Copy</span>
            </>
          )}
        </button>
      </div>
      
      {/* Code content */}
      <div className="overflow-x-auto">
        <SyntaxHighlighter
          language={language || 'text'}
          style={isDark ? oneDark : oneLight}
          customStyle={{
            margin: 0,
            borderRadius: 0,
            fontSize: '13px',
            lineHeight: '1.6',
            padding: '16px',
            background: isDark ? '#1a1b26' : '#fafafa',
          }}
          wrapLines={true}
          showLineNumbers={true}
          lineNumberStyle={{ 
            minWidth: '2.5em', 
            paddingRight: '1em', 
            color: isDark ? '#4a5568' : '#a0aec0',
            userSelect: 'none',
            fontSize: '12px'
          }}
        >
          {value}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// Inline Code Component
// ═══════════════════════════════════════════════════════════════
const InlineCode = ({ children }) => {
  return (
    <code className="px-1.5 sm:px-2 py-0.5 sm:py-1 
                   bg-pink-50 dark:bg-pink-500/10 
                   text-pink-600 dark:text-pink-400 
                   rounded-md sm:rounded-lg text-[11px] sm:text-[13px] 
                   font-mono font-semibold
                   border border-pink-200 dark:border-pink-500/30">
      {children}
    </code>
  );
};

// ═══════════════════════════════════════════════════════════════
// Message Bubble Component
// ═══════════════════════════════════════════════════════════════
const MessageBubble = ({ message, index, isLatest, loading, onMessageComplete, chatId }) => {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);
  const [displayedContent, setDisplayedContent] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const hasTypedRef = useRef(false);
  const { isDark } = useTheme();
  
  const messageId = `${chatId || 'default'}-${index}-${message.role}`;

  const checkIfAlreadyTyped = useCallback(() => {
    if (message.isComplete) return true;
    const typedMessages = JSON.parse(sessionStorage.getItem('typedMessages') || '{}');
    return typedMessages[messageId] === true;
  }, [message.isComplete, messageId]);

  const markAsTyped = useCallback(() => {
    const typedMessages = JSON.parse(sessionStorage.getItem('typedMessages') || '{}');
    typedMessages[messageId] = true;
    sessionStorage.setItem('typedMessages', JSON.stringify(typedMessages));
  }, [messageId]);

  useEffect(() => {
    hasTypedRef.current = false;
  }, [chatId]);

  useEffect(() => {
    const alreadyTyped = checkIfAlreadyTyped();
    
    if (!isUser && isLatest && message.content && !alreadyTyped && !hasTypedRef.current) {
      hasTypedRef.current = true;
      setIsTyping(true);
      let currentIndex = 0;
      const content = message.content;
      
      const typingSpeed = 8;
      const charsPerInterval = 3;
      
      const typingInterval = setInterval(() => {
        if (currentIndex < content.length) {
          currentIndex += charsPerInterval;
          setDisplayedContent(content.slice(0, Math.min(currentIndex, content.length)));
        } else {
          setIsTyping(false);
          setDisplayedContent(content);
          clearInterval(typingInterval);
          markAsTyped();
          if (onMessageComplete) {
            onMessageComplete(index);
          }
        }
      }, typingSpeed);

      return () => clearInterval(typingInterval);
    } else {
      setDisplayedContent(message.content);
      setIsTyping(false);
    }
  }, [message.content, isUser, isLatest, checkIfAlreadyTyped, markAsTyped, onMessageComplete, index]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      className={`animate-fadeIn ${isUser ? 'flex justify-end' : 'flex justify-start'}`}
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div className={`flex gap-2 sm:gap-3 items-end max-w-[95%] sm:max-w-[85%] md:max-w-[75%] 
                      ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        
        {/* Avatar */}
        <div className="flex-shrink-0 mb-1">
          {isUser ? (
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full 
                           bg-gradient-to-br from-gray-600 to-gray-700 dark:from-gray-500 dark:to-gray-600
                           flex items-center justify-center shadow-lg 
                           border-2 border-white dark:border-gray-800">
              <User size={14} className="sm:w-4 sm:h-4 text-white" />
            </div>
          ) : (
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 
                             rounded-full blur-md opacity-50 animate-pulse" />
              <div className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-full 
                             bg-gradient-to-br from-blue-500 to-purple-600 
                             flex items-center justify-center shadow-lg
                             border-2 border-white dark:border-gray-800">
                <Bot size={14} className="sm:w-4 sm:h-4 text-white" />
              </div>
            </div>
          )}
        </div>
        
        {/* Message Content */}
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
          {/* Message Bubble */}
          <div className={`
            group relative max-w-full
            ${isUser 
              ? `bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 
                 text-white rounded-2xl sm:rounded-3xl rounded-br-md 
                 shadow-lg shadow-blue-500/20` 
              : `bg-white dark:bg-gray-800 
                 text-gray-900 dark:text-gray-100 
                 rounded-2xl sm:rounded-3xl rounded-bl-md 
                 shadow-lg shadow-gray-200/50 dark:shadow-none
                 border border-gray-100 dark:border-gray-700/50`
            }
            px-3 sm:px-4 py-2.5 sm:py-3
          `}>
            <div className={`markdown-content text-[13px] sm:text-[15px] leading-relaxed break-words 
                           ${isUser ? 'text-white' : 'text-gray-800 dark:text-gray-100'}`}>
              {isUser ? (
                <p className="whitespace-pre-wrap">{displayedContent}</p>
              ) : (
                <>
                  <ReactMarkdown
                    components={{
                      code({ node, inline, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || '');
                        const codeString = String(children).replace(/\n$/, '');
                        
                        return !inline && match ? (
                          <CodeBlock language={match[1]} value={codeString} {...props} />
                        ) : (
                          <InlineCode {...props}>{children}</InlineCode>
                        );
                      },
                      p({ children }) {
                        return <p className="mb-3 last:mb-0 leading-6 sm:leading-7">{children}</p>;
                      },
                      ul({ children }) {
                        return <ul className="list-none pl-0 mb-3 sm:mb-4 space-y-1.5 sm:space-y-2">{children}</ul>;
                      },
                      ol({ children }) {
                        return <ol className="list-decimal pl-4 sm:pl-6 mb-3 sm:mb-4 space-y-1.5 sm:space-y-2">{children}</ol>;
                      },
                      li({ children }) {
                        return (
                          <li className="leading-6 sm:leading-7 flex items-start gap-2">
                            <span className="text-blue-500 dark:text-blue-400 mt-1.5 text-sm flex-shrink-0">•</span>
                            <span className="flex-1">{children}</span>
                          </li>
                        );
                      },
                      h1({ children }) {
                        return (
                          <h1 className="text-xl sm:text-3xl font-bold mb-3 sm:mb-4 mt-4 sm:mt-6 
                                        bg-gradient-to-r from-blue-600 to-purple-600 
                                        dark:from-blue-400 dark:to-purple-400 
                                        bg-clip-text text-transparent">
                            {children}
                          </h1>
                        );
                      },
                      h2({ children }) {
                        return (
                          <h2 className="text-lg sm:text-2xl font-bold mb-2 sm:mb-3 mt-3 sm:mt-5 
                                        text-gray-900 dark:text-white">
                            {children}
                          </h2>
                        );
                      },
                      h3({ children }) {
                        return (
                          <h3 className="text-base sm:text-xl font-bold mb-2 mt-3 sm:mt-4 
                                        text-gray-900 dark:text-white">
                            {children}
                          </h3>
                        );
                      },
                      blockquote({ children }) {
                        return (
                          <blockquote className="border-l-4 border-blue-500 dark:border-blue-400 
                                               pl-3 sm:pl-4 py-2 italic my-3 sm:my-4 
                                               bg-blue-50 dark:bg-blue-500/10 
                                               rounded-r-lg text-sm sm:text-base 
                                               text-gray-700 dark:text-gray-300">
                            {children}
                          </blockquote>
                        );
                      },
                      a({ children, href }) {
                        return (
                          <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 dark:text-blue-400 hover:underline 
                                     font-semibold underline-offset-2 
                                     hover:text-blue-700 dark:hover:text-blue-300
                                     transition-colors duration-200"
                          >
                            {children}
                          </a>
                        );
                      },
                      strong({ children }) {
                        return <strong className="font-bold text-gray-900 dark:text-white">{children}</strong>;
                      },
                      em({ children }) {
                        return <em className="italic text-gray-700 dark:text-gray-300">{children}</em>;
                      },
                      table({ children }) {
                        return (
                          <div className="overflow-x-auto my-4 sm:my-6 rounded-xl 
                                        border border-gray-200 dark:border-gray-700 shadow-lg">
                            <table className="min-w-full text-xs sm:text-sm">
                              {children}
                            </table>
                          </div>
                        );
                      },
                      thead({ children }) {
                        return (
                          <thead className="bg-gray-100 dark:bg-gray-800">
                            {children}
                          </thead>
                        );
                      },
                      th({ children }) {
                        return (
                          <th className="border-b-2 border-gray-200 dark:border-gray-700 
                                       px-3 sm:px-6 py-2 sm:py-3 text-left font-bold 
                                       text-gray-900 dark:text-white">
                            {children}
                          </th>
                        );
                      },
                      td({ children }) {
                        return (
                          <td className="border-b border-gray-200 dark:border-gray-700 
                                       px-3 sm:px-6 py-2 sm:py-4 
                                       text-gray-700 dark:text-gray-200">
                            {children}
                          </td>
                        );
                      },
                      hr() {
                        return (
                          <hr className="my-4 sm:my-8 border-gray-200 dark:border-gray-700" />
                        );
                      },
                    }}
                  >
                    {displayedContent}
                  </ReactMarkdown>
                  
                  {/* Typing cursor */}
                  {isTyping && (
                    <span className="inline-block w-0.5 h-4 bg-blue-500 ml-0.5 animate-pulse" />
                  )}
                </>
              )}
            </div>
          </div>

          {/* Copy Button for Bot Messages */}
          {!isUser && !isTyping && (
            <button
              onClick={handleCopy}
              className={`mt-1.5 sm:mt-2 flex items-center gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 
                        text-[10px] sm:text-xs font-medium rounded-lg
                        opacity-0 group-hover:opacity-100 transition-all duration-200
                        active:scale-95
                        ${copied 
                          ? 'bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 border-green-200 dark:border-green-500/30' 
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-300'}
                        border`}
            >
              {copied ? (
                <>
                  <Check size={12} className="sm:w-[14px] sm:h-[14px]" />
                  <span className="hidden xs:inline">Copied!</span>
                </>
              ) : (
                <>
                  <Copy size={12} className="sm:w-[14px] sm:h-[14px]" />
                  <span className="hidden xs:inline">Copy</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// Typing Indicator Component
// ═══════════════════════════════════════════════════════════════
const TypingIndicator = () => {
  const { isDark } = useTheme();
  
  return (
    <div className="animate-fadeIn flex justify-start">
      <div className="flex gap-2 sm:gap-3 items-end">
        {/* Avatar */}
        <div className="flex-shrink-0 mb-1">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 
                           rounded-full blur-md opacity-50 animate-pulse" />
            <div className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-full 
                           bg-gradient-to-br from-blue-500 to-purple-600 
                           flex items-center justify-center shadow-lg
                           border-2 border-white dark:border-gray-800">
              <Bot size={14} className="sm:w-4 sm:h-4 text-white" />
            </div>
          </div>
        </div>
        
        {/* Typing Animation */}
        <div className="bg-white dark:bg-gray-800 
                       rounded-2xl sm:rounded-3xl rounded-bl-md 
                       shadow-lg shadow-gray-200/50 dark:shadow-none
                       border border-gray-100 dark:border-gray-700/50
                       px-4 sm:px-5 py-3 sm:py-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 
                           rounded-full animate-bounce" 
                  style={{ animationDelay: '0ms' }} />
            <span className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 
                           rounded-full animate-bounce" 
                  style={{ animationDelay: '150ms' }} />
            <span className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 
                           rounded-full animate-bounce" 
                  style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatArea;