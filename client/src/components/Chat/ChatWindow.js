import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useChat } from '../../context/ChatContext';
import ResponsiveImage from '../common/ResponsiveImage';

const ChatWindow = () => {
  const { 
    messages, 
    isTyping, 
    isChatOpen, 
    sendMessage, 
    sendQuickReply, 
    closeChat, 
    clearChat,
    markAsRead 
  } = useChat();
  
  const [inputMessage, setInputMessage] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Mark messages as read when chat opens
  useEffect(() => {
    if (isChatOpen) {
      markAsRead();
    }
  }, [isChatOpen, markAsRead]);

  // Focus input when chat opens
  useEffect(() => {
    if (isChatOpen && !isMinimized && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isChatOpen, isMinimized]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const message = inputMessage.trim();
    setInputMessage('');
    await sendMessage(message);
  };

  const handleQuickReply = (reply) => {
    sendQuickReply(reply);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (!isChatOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className={`bg-white rounded-lg shadow-2xl border transition-all duration-300 ${
        isMinimized ? 'w-80 h-16' : 'w-80 h-96'
      }`}>
        {/* Chat Header */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-t-lg">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <span className="text-sm font-bold">💎</span>
            </div>
            <div>
              <h3 className="font-semibold text-sm">Jewelry Assistant</h3>
              <p className="text-xs opacity-90">
                {isTyping ? 'Typing...' : 'Online'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
              title={isMinimized ? 'Expand' : 'Minimize'}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d={isMinimized ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} 
                />
              </svg>
            </button>
            
            <button
              onClick={closeChat}
              className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
              title="Close chat"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Chat Body */}
        {!isMinimized && (
          <>
            {/* Messages Area */}
            <div className="h-64 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                    {/* Message Bubble */}
                    <div className={`rounded-lg px-3 py-2 ${
                      message.type === 'user' 
                        ? 'bg-yellow-500 text-white' 
                        : message.isError 
                        ? 'bg-red-100 text-red-800 border border-red-200'
                        : 'bg-white text-gray-800 border border-gray-200'
                    }`}>
                      <p className="text-sm whitespace-pre-line">{message.content}</p>
                      
                      {/* Products Display */}
                      {message.products && message.products.length > 0 && (
                        <div className="mt-3 space-y-2">
                          {message.products.map((product) => (
                            <Link
                              key={product.id}
                              to={product.url}
                              onClick={closeChat}
                              className="block bg-gray-50 rounded-lg p-2 hover:bg-gray-100 transition-colors"
                            >
                              <div className="flex items-center space-x-2">
                                <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                                  {product.image && (
                                    <ResponsiveImage
                                      image={{ url: product.image }}
                                      alt={product.name}
                                      size="thumbnail"
                                      className="w-full h-full"
                                    />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="text-xs font-medium text-gray-900 truncate">
                                    {product.name}
                                  </h4>
                                  <p className="text-xs text-gray-500">
                                    {product.category} • {product.metal}
                                  </p>
                                  <p className="text-xs font-semibold text-yellow-600">
                                    {formatPrice(product.price)}
                                  </p>
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    {/* Quick Replies */}
                    {message.quickReplies && message.quickReplies.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {message.quickReplies.map((reply, index) => (
                          <button
                            key={index}
                            onClick={() => handleQuickReply(reply)}
                            className="text-xs bg-white border border-yellow-300 text-yellow-700 px-2 py-1 rounded-full hover:bg-yellow-50 transition-colors"
                          >
                            {reply}
                          </button>
                        ))}
                      </div>
                    )}
                    
                    {/* Timestamp */}
                    <p className={`text-xs mt-1 ${
                      message.type === 'user' ? 'text-right text-gray-500' : 'text-gray-500'
                    }`}>
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
              
              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-200 rounded-lg px-3 py-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-gray-200 bg-white rounded-b-lg">
              <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask about jewelry, prices, care tips..."
                  className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  disabled={isTyping}
                />
                
                <button
                  type="submit"
                  disabled={!inputMessage.trim() || isTyping}
                  className="bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-300 text-white rounded-full p-2 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
                
                <button
                  type="button"
                  onClick={clearChat}
                  className="text-gray-400 hover:text-gray-600 p-2 transition-colors"
                  title="Clear chat"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </form>
              
              <p className="text-xs text-gray-500 mt-2 text-center">
                Powered by Sri Vasavi Jewels AI Assistant
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ChatWindow;
