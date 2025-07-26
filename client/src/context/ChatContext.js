import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';

const ChatContext = createContext();

// Chat actions
const CHAT_ACTIONS = {
  SET_MESSAGES: 'SET_MESSAGES',
  ADD_MESSAGE: 'ADD_MESSAGE',
  SET_TYPING: 'SET_TYPING',
  SET_CHAT_OPEN: 'SET_CHAT_OPEN',
  SET_LOADING: 'SET_LOADING',
  CLEAR_CHAT: 'CLEAR_CHAT',
  SET_QUICK_REPLIES: 'SET_QUICK_REPLIES'
};

// Chat reducer
const chatReducer = (state, action) => {
  switch (action.type) {
    case CHAT_ACTIONS.SET_MESSAGES:
      return {
        ...state,
        messages: action.payload,
        loading: false
      };
    
    case CHAT_ACTIONS.ADD_MESSAGE:
      return {
        ...state,
        messages: [...state.messages, action.payload]
      };
    
    case CHAT_ACTIONS.SET_TYPING:
      return {
        ...state,
        isTyping: action.payload
      };
    
    case CHAT_ACTIONS.SET_CHAT_OPEN:
      return {
        ...state,
        isChatOpen: action.payload
      };
    
    case CHAT_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };
    
    case CHAT_ACTIONS.CLEAR_CHAT:
      return {
        ...state,
        messages: [
          {
            id: Date.now(),
            type: 'bot',
            content: "Hello! I'm your jewelry assistant. How can I help you find the perfect piece today?",
            timestamp: new Date(),
            quickReplies: [
              'Show me gold necklaces',
              'What\'s trending?',
              'Help with ring sizes',
              'Care instructions'
            ]
          }
        ]
      };
    
    case CHAT_ACTIONS.SET_QUICK_REPLIES:
      return {
        ...state,
        quickReplies: action.payload
      };
    
    default:
      return state;
  }
};

// Initial state
const initialState = {
  messages: [
    {
      id: Date.now(),
      type: 'bot',
      content: "Hello! I'm your jewelry assistant at Sri Vasavi Jewels. How can I help you find the perfect piece today?",
      timestamp: new Date(),
      quickReplies: [
        'Show me gold necklaces',
        'What\'s trending?',
        'Help with ring sizes',
        'Care instructions'
      ]
    }
  ],
  isTyping: false,
  isChatOpen: false,
  loading: false,
  quickReplies: []
};

// Chat Provider
export const ChatProvider = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  // Load chat history on mount
  useEffect(() => {
    loadChatHistory();
  }, []);

  // Save chat history whenever messages change
  useEffect(() => {
    if (state.messages.length > 1) { // Don't save just the initial message
      localStorage.setItem('chatHistory', JSON.stringify(state.messages));
    }
  }, [state.messages]);

  // Load chat history from localStorage
  const loadChatHistory = () => {
    try {
      const savedMessages = localStorage.getItem('chatHistory');
      if (savedMessages) {
        const messages = JSON.parse(savedMessages);
        // Add timestamps if missing (for backward compatibility)
        const messagesWithTimestamps = messages.map(msg => ({
          ...msg,
          timestamp: msg.timestamp ? new Date(msg.timestamp) : new Date()
        }));
        dispatch({ type: CHAT_ACTIONS.SET_MESSAGES, payload: messagesWithTimestamps });
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  };

  // Send message to AI
  const sendMessage = async (content, type = 'user') => {
    try {
      // Add user message
      const userMessage = {
        id: Date.now(),
        type: 'user',
        content,
        timestamp: new Date()
      };
      
      dispatch({ type: CHAT_ACTIONS.ADD_MESSAGE, payload: userMessage });
      dispatch({ type: CHAT_ACTIONS.SET_TYPING, payload: true });

      // Send to AI service
      const response = await axios.post('http://localhost:4000/api/chat/message', {
        message: content,
        chatHistory: state.messages.slice(-10) // Send last 10 messages for context
      });

      dispatch({ type: CHAT_ACTIONS.SET_TYPING, payload: false });

      if (response.data.success) {
        const botMessage = {
          id: Date.now() + 1,
          type: 'bot',
          content: response.data.data.response,
          timestamp: new Date(),
          quickReplies: response.data.data.quickReplies || [],
          products: response.data.data.products || [],
          suggestions: response.data.data.suggestions || []
        };
        
        dispatch({ type: CHAT_ACTIONS.ADD_MESSAGE, payload: botMessage });
        return { success: true };
      } else {
        throw new Error(response.data.message || 'Failed to get AI response');
      }
    } catch (error) {
      dispatch({ type: CHAT_ACTIONS.SET_TYPING, payload: false });
      
      // Add error message
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: "I'm sorry, I'm having trouble responding right now. Please try again or contact our support team.",
        timestamp: new Date(),
        isError: true
      };
      
      dispatch({ type: CHAT_ACTIONS.ADD_MESSAGE, payload: errorMessage });
      return { success: false, error: error.message };
    }
  };

  // Open/close chat
  const toggleChat = () => {
    dispatch({ type: CHAT_ACTIONS.SET_CHAT_OPEN, payload: !state.isChatOpen });
  };

  const openChat = () => {
    dispatch({ type: CHAT_ACTIONS.SET_CHAT_OPEN, payload: true });
  };

  const closeChat = () => {
    dispatch({ type: CHAT_ACTIONS.SET_CHAT_OPEN, payload: false });
  };

  // Clear chat history
  const clearChat = () => {
    localStorage.removeItem('chatHistory');
    dispatch({ type: CHAT_ACTIONS.CLEAR_CHAT });
  };

  // Send quick reply
  const sendQuickReply = (reply) => {
    sendMessage(reply);
  };

  // Get unread message count (for notification badge)
  const getUnreadCount = () => {
    if (state.isChatOpen) return 0;
    
    const lastOpenTime = localStorage.getItem('lastChatOpenTime');
    if (!lastOpenTime) return state.messages.filter(m => m.type === 'bot').length;
    
    const lastOpen = new Date(lastOpenTime);
    return state.messages.filter(m => 
      m.type === 'bot' && new Date(m.timestamp) > lastOpen
    ).length;
  };

  // Mark messages as read
  const markAsRead = () => {
    localStorage.setItem('lastChatOpenTime', new Date().toISOString());
  };

  const value = {
    messages: state.messages,
    isTyping: state.isTyping,
    isChatOpen: state.isChatOpen,
    loading: state.loading,
    sendMessage,
    sendQuickReply,
    toggleChat,
    openChat,
    closeChat,
    clearChat,
    getUnreadCount,
    markAsRead
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};

// Custom hook to use chat
export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export default ChatContext;
