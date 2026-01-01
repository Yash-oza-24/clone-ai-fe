import React, { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { User, Bot, Send, Sparkles, Zap, Code, Lightbulb, BookOpen, Copy, Check, TrendingUp, Rocket, Brain, Star } from 'lucide-react';

const ChatArea = ({ messages, input, setInput, onSendMessage, loading }) => {
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

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
    <div className="flex-1 flex flex-col bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-black dark:to-gray-950 relative overflow-hidden">

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto relative z-10">
        <div className="max-w-5xl mx-auto px-3 sm:px-4 lg:px-8">
          {messages.length === 0 ? (
            <WelcomeScreen onSuggestionClick={setInput} />
          ) : (
            <div className="py-4 sm:py-8 space-y-4 sm:space-y-6">
              {messages.map((msg, index) => (
                <MessageBubble key={index} message={msg} index={index} />
              ))}
              {loading && <TypingIndicator />}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Form - Responsive */}
      <div className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 sticky bottom-0 relative z-10">
        <div className="max-w-5xl mx-auto px-3 sm:px-4 lg:px-8 py-3 sm:py-4">
          <form onSubmit={handleSubmit} className="relative">
            <div className="relative">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask me anything..."
                disabled={loading}
                rows="1"
                className="w-full px-4 sm:px-5 py-3 sm:py-4 pr-12 sm:pr-14 rounded-2xl border-2 border-gray-200 dark:border-gray-700 
                         bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100
                         placeholder:text-gray-400 dark:placeholder:text-gray-500
                         focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
                         disabled:opacity-50 disabled:cursor-not-allowed
                         resize-none transition-all shadow-sm
                         font-medium text-sm sm:text-base
                         scrollbar-hide overflow-y-auto"
                style={{ minHeight: '52px', maxHeight: '200px' }}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="absolute right-2 bottom-2 p-2.5 sm:p-3 rounded-xl
                         bg-blue-600 hover:bg-blue-700 
                         dark:bg-blue-600 dark:hover:bg-blue-700
                         text-white disabled:opacity-30 disabled:cursor-not-allowed
                         transition-all shadow-sm hover:shadow-md active:scale-95
                         disabled:hover:shadow-sm disabled:active:scale-100"
              >
                {loading ? (
                  <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <Send size={16} className="sm:w-[18px] sm:h-[18px]" />
                )}
              </button>
            </div>
            
            {/* Quick Info - Responsive */}
            <div className="flex items-center justify-between mt-2 sm:mt-3 text-[10px] sm:text-xs">
              <div className="flex items-center gap-2 sm:gap-4 text-gray-500 dark:text-gray-500">
                <span className="flex items-center gap-1 sm:gap-1.5">
                  <Zap size={10} className="sm:w-3 sm:h-3 text-yellow-500" />
                  <span className="font-medium hidden xs:inline">Groq AI</span>
                </span>
                <span className="flex items-center gap-1 sm:gap-1.5">
                  <Brain size={10} className="sm:w-3 sm:h-3 text-purple-500" />
                  <span className="font-medium hidden xs:inline">Llama 3.3</span>
                </span>
              </div>
              <span className="text-gray-400 dark:text-gray-600 hidden sm:block">
                Press <kbd className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded font-mono text-[10px] border border-gray-300 dark:border-gray-700">Enter</kbd> to send
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Enhanced Welcome Screen Component (Responsive)
const WelcomeScreen = ({ onSuggestionClick }) => {
  const suggestions = [
    {
      icon: Code,
      title: "Code Assistant",
      text: "Write a Python function to sort an array",
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-500/10 to-cyan-500/10",
      borderColor: "border-blue-500/20",
      iconColor: "text-blue-500"
    },
    {
      icon: Lightbulb,
      title: "Explain Concepts",
      text: "Explain quantum computing in simple terms",
      gradient: "from-yellow-500 to-orange-500",
      bgGradient: "from-yellow-500/10 to-orange-500/10",
      borderColor: "border-yellow-500/20",
      iconColor: "text-yellow-500"
    },
    {
      icon: TrendingUp,
      title: "Tech Trends",
      text: "What are the latest web development trends?",
      gradient: "from-green-500 to-emerald-500",
      bgGradient: "from-green-500/10 to-emerald-500/10",
      borderColor: "border-green-500/20",
      iconColor: "text-green-500"
    },
    {
      icon: Rocket,
      title: "Creative Ideas",
      text: "Help me plan a trip to Japan",
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-500/10 to-pink-500/10",
      borderColor: "border-purple-500/20",
      iconColor: "text-purple-500"
    }
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-180px)] px-4 py-8 sm:py-12">
      {/* Hero Section - Responsive */}
      <div className="mb-8 sm:mb-12 text-center relative">
        {/* Animated background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 sm:w-64 h-48 sm:h-64 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        
        <div className="relative mb-6 sm:mb-8 inline-block">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl sm:rounded-3xl blur-2xl opacity-30 animate-pulse"></div>
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-500/30">
            <Sparkles size={32} className="sm:w-10 sm:h-10 text-white" />
          </div>
        </div>
        
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 dark:from-white dark:via-blue-100 dark:to-purple-100 bg-clip-text text-transparent leading-tight px-4">
          How can I assist you?
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed px-4">
          Ask me anything. I'm powered by{' '}
          <span className="font-semibold text-blue-600 dark:text-blue-400">Groq AI</span>
          {' '}with{' '}
          <span className="font-semibold text-purple-600 dark:text-purple-400">Llama 3.3 70B</span>
        </p>
      </div>

      {/* Suggestion Cards - Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full max-w-3xl mb-8 sm:mb-12">
        {suggestions.map((suggestion, index) => {
          const IconComponent = suggestion.icon;
          return (
            <button
              key={index}
              onClick={() => onSuggestionClick(suggestion.text)}
              className={`group relative p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-gradient-to-br ${suggestion.bgGradient} 
                       border-2 ${suggestion.borderColor}
                       hover:shadow-xl transition-all duration-300 text-left
                       hover:scale-[1.02] active:scale-[0.98]
                       backdrop-blur-sm overflow-hidden`}
            >
              {/* Gradient overlay on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${suggestion.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
              
              <div className="relative flex items-start gap-3 sm:gap-4">
                <div className={`p-2 sm:p-3 rounded-lg sm:rounded-xl bg-gradient-to-br ${suggestion.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}>
                  <IconComponent size={18} className="sm:w-5 sm:h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className={`text-xs sm:text-sm font-bold mb-1 sm:mb-1.5 ${suggestion.iconColor}`}>
                    {suggestion.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed line-clamp-2">
                    {suggestion.text}
                  </p>
                </div>
              </div>
              
              {/* Shine effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
            </button>
          );
        })}
      </div>

      {/* Feature Pills - Responsive */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm">
        {[
          { icon: Zap, text: 'Lightning Fast', color: 'from-yellow-500 to-orange-500' },
          { icon: Brain, text: 'Smart AI', color: 'from-purple-500 to-pink-500' },
          { icon: Star, text: 'Always Learning', color: 'from-blue-500 to-cyan-500' }
        ].map((feature, index) => {
          const FeatureIcon = feature.icon;
          return (
            <div
              key={index}
              className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
            >
              <div className={`p-0.5 sm:p-1 rounded-full bg-gradient-to-br ${feature.color}`}>
                <FeatureIcon size={10} className="sm:w-3 sm:h-3 text-white" />
              </div>
              <span className="text-gray-700 dark:text-gray-300 font-medium whitespace-nowrap">{feature.text}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Enhanced Code Block Component (Same, already good)
const CodeBlock = ({ language, value }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const customStyle = {
    margin: 0,
    borderRadius: '0 0 12px 12px',
    fontSize: '13px',
    lineHeight: '1.6',
    padding: '16px',
    background: '#1e1e1e',
  };

  return (
    <div className="relative group my-4 sm:my-6 rounded-xl overflow-hidden border border-gray-700/50 shadow-2xl">
      <div className="flex items-center justify-between px-3 sm:px-5 py-2 sm:py-3 bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-700/50">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Code size={12} className="sm:w-[14px] sm:h-[14px] text-blue-400" />
            <span className="text-[10px] sm:text-xs font-bold text-gray-300 uppercase tracking-wider">
              {language || 'code'}
            </span>
          </div>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs font-medium text-gray-300 hover:text-white 
                   bg-gray-800/50 hover:bg-gray-700 rounded-md sm:rounded-lg transition-all duration-200
                   border border-gray-700/50 hover:border-gray-600 shadow-lg"
        >
          {copied ? (
            <>
              <Check size={12} className="sm:w-[14px] sm:h-[14px] text-green-400" />
              <span className="text-green-400 hidden xs:inline">Copied!</span>
            </>
          ) : (
            <>
              <Copy size={12} className="sm:w-[14px] sm:h-[14px]" />
              <span className="hidden xs:inline">Copy</span>
            </>
          )}
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <SyntaxHighlighter
          language={language || 'text'}
          style={tomorrow}
          customStyle={customStyle}
          wrapLines={true}
          showLineNumbers={true}
          lineNumberStyle={{ 
            minWidth: '2.5em', 
            paddingRight: '1em', 
            color: '#6e7681',
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

// Enhanced Inline Code Component
const InlineCode = ({ children }) => {
  return (
    <code className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 
                   text-pink-600 dark:text-pink-400 rounded-md sm:rounded-lg text-[11px] sm:text-[13px] font-mono font-semibold
                   border border-pink-200/50 dark:border-pink-800/50">
      {children}
    </code>
  );
};

// **COMPLETELY REDESIGNED MESSAGE BUBBLE** - Modern Chat UI
const MessageBubble = ({ message, index }) => {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      className={`animate-fadeIn ${isUser ? 'flex justify-end' : 'flex justify-start'}`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className={`flex gap-2 sm:gap-3 items-end max-w-[95%] sm:max-w-[85%] md:max-w-[75%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar */}
        <div className="flex-shrink-0 mb-1">
          {isUser ? (
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center shadow-lg border border-gray-500/20">
              <User size={14} className="sm:w-4 sm:h-4 text-white" />
            </div>
          ) : (
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-sm opacity-40"></div>
              <div className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                <Bot size={14} className="sm:w-4 sm:h-4 text-white" />
              </div>
            </div>
          )}
        </div>
        
        {/* Message Content */}
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
          {/* Message Bubble */}
          <div className={`
            group relative
            ${isUser 
              ? 'bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 text-white rounded-3xl rounded-br-md shadow-lg shadow-blue-500/20' 
              : 'bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-3xl rounded-bl-md shadow-lg border border-gray-200/80 dark:border-gray-800/80'
            }
            px-3 sm:px-4 py-2.5 sm:py-3
            max-w-full
          `}>
            <div className={`markdown-content text-[13px] sm:text-[15px] leading-relaxed break-words ${isUser ? 'text-white' : 'text-gray-900 dark:text-gray-100'}`}>
              {isUser ? (
                <p className="whitespace-pre-wrap">{message.content}</p>
              ) : (
                <ReactMarkdown
                  components={{
                    code({ node, inline, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || '');
                      const codeString = String(children).replace(/\n$/, '');
                      
                      return !inline && match ? (
                        <CodeBlock
                          language={match[1]}
                          value={codeString}
                          {...props}
                        />
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
                          <span className="text-blue-500 mt-1 text-sm">•</span>
                          <span className="flex-1">{children}</span>
                        </li>
                      );
                    },
                    h1({ children }) {
                      return <h1 className="text-xl sm:text-3xl font-bold mb-3 sm:mb-4 mt-4 sm:mt-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{children}</h1>;
                    },
                    h2({ children }) {
                      return <h2 className="text-lg sm:text-2xl font-bold mb-2 sm:mb-3 mt-3 sm:mt-5 text-gray-900 dark:text-white">{children}</h2>;
                    },
                    h3({ children }) {
                      return <h3 className="text-base sm:text-xl font-bold mb-2 mt-3 sm:mt-4 text-gray-900 dark:text-white">{children}</h3>;
                    },
                    blockquote({ children }) {
                      return (
                        <blockquote className="border-l-2 sm:border-l-4 border-blue-500 dark:border-blue-600 pl-3 sm:pl-4 py-2 italic my-3 sm:my-4 bg-gradient-to-r from-blue-50 to-transparent dark:from-blue-900/20 dark:to-transparent rounded-r-lg text-sm sm:text-base">
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
                          className="text-blue-600 dark:text-blue-400 hover:underline font-semibold underline-offset-2"
                        >
                          {children}
                        </a>
                      );
                    },
                    strong({ children }) {
                      return <strong className="font-bold text-gray-900 dark:text-white">{children}</strong>;
                    },
                    table({ children }) {
                      return (
                        <div className="overflow-x-auto my-4 sm:my-6 rounded-lg sm:rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg">
                          <table className="min-w-full text-xs sm:text-sm">
                            {children}
                          </table>
                        </div>
                      );
                    },
                    thead({ children }) {
                      return <thead className="bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900">{children}</thead>;
                    },
                    th({ children }) {
                      return (
                        <th className="border-b-2 border-gray-200 dark:border-gray-700 px-3 sm:px-6 py-2 sm:py-3 text-left font-bold text-gray-900 dark:text-white">
                          {children}
                        </th>
                      );
                    },
                    td({ children }) {
                      return (
                        <td className="border-b border-gray-200 dark:border-gray-800 px-3 sm:px-6 py-2 sm:py-4 text-gray-800 dark:text-gray-200">
                          {children}
                        </td>
                      );
                    },
                    hr() {
                      return <hr className="my-4 sm:my-8 border-gray-300 dark:border-gray-700" />;
                    },
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              )}
            </div>
          </div>

          {/* Copy Button for Bot Messages */}
          {!isUser && (
            <button
              onClick={handleCopy}
              className="mt-1.5 sm:mt-2 flex items-center gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs font-medium text-gray-500 dark:text-gray-400 
                       hover:text-gray-700 dark:hover:text-gray-300 transition-all
                       opacity-0 group-hover:opacity-100 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800
                       border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
            >
              {copied ? (
                <>
                  <Check size={12} className="sm:w-[14px] sm:h-[14px] text-green-500" />
                  <span className="text-green-600 dark:text-green-400 hidden xs:inline">Copied!</span>
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

// Enhanced Typing Indicator Component (Responsive)
const TypingIndicator = () => {
  return (
    <div className="animate-fadeIn flex justify-start">
      <div className="flex gap-2 sm:gap-3 items-end max-w-[95%] sm:max-w-[85%] md:max-w-[75%]">
        {/* Avatar */}
        <div className="flex-shrink-0 mb-1">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-sm opacity-40 animate-pulse"></div>
            <div className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
              <Bot size={14} className="sm:w-4 sm:h-4 text-white" />
            </div>
          </div>
        </div>
        
        {/* Typing Animation */}
        <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-3xl rounded-bl-md shadow-lg border border-gray-200/80 dark:border-gray-800/80 px-4 sm:px-5 py-3 sm:py-4">
          <div className="flex gap-1.5">
            <span className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
            <span className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
            <span className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatArea;