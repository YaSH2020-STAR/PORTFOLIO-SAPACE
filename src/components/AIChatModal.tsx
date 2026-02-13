import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot } from 'lucide-react';

type Message = {
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
};

type AIChatModalProps = {
  isOpen: boolean;
  onClose: () => void;
  remainingTips: number;
  onSendMessage: () => void;
  isPremium: boolean;
  onUpgrade: () => void;
};

const STORAGE_KEY = 'chatMessages';
const LAST_RESET_KEY = 'lastMessageReset';

const AIChatModal = ({ 
  isOpen, 
  onClose, 
  remainingTips,
  onSendMessage,
  isPremium,
  onUpgrade
}: AIChatModalProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Load messages and check daily reset
  useEffect(() => {
    if (isOpen) {
      const lastReset = localStorage.getItem(LAST_RESET_KEY);
      const today = new Date().toDateString();

      // Reset messages if it's a new day
      if (lastReset !== today) {
        console.log('New day detected, resetting messages');
        localStorage.setItem(LAST_RESET_KEY, today);
        localStorage.removeItem(STORAGE_KEY);
        const initialMessage = {
          type: 'ai' as const,
          content: `${isPremium ? 'Premium access enabled' : `${remainingTips} tips remaining today`}. How can I help you with your fitness journey?`,
          timestamp: new Date()
        };
        setMessages([initialMessage]);
        localStorage.setItem(STORAGE_KEY, JSON.stringify([initialMessage]));
      } else {
        // Load existing messages
        const storedMessages = localStorage.getItem(STORAGE_KEY);
        if (storedMessages) {
          console.log('Loading stored messages');
          const parsedMessages = JSON.parse(storedMessages);
          setMessages(parsedMessages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          })));
        } else {
          const initialMessage = {
            type: 'ai' as const,
            content: `${isPremium ? 'Premium access enabled' : `${remainingTips} tips remaining today`}. How can I help you with your fitness journey?`,
            timestamp: new Date()
          };
          setMessages([initialMessage]);
          localStorage.setItem(STORAGE_KEY, JSON.stringify([initialMessage]));
        }
      }

      // Focus input after a short delay to ensure mobile keyboard works
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, isPremium, remainingTips]);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      console.log('Saving messages to localStorage:', messages);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    }
  }, [messages]);

  // Auto-scroll to bottom
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      const behavior = isLoading ? 'auto' : 'smooth';
      messagesEndRef.current.scrollIntoView({ behavior });
    }
  };

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    if (!isPremium && remainingTips === 0) {
      onUpgrade();
      return;
    }

    setIsLoading(true);
    setError(null);

    const userMessage: Message = {
      type: 'user',
      content: newMessage,
      timestamp: new Date()
    };

    // Update messages immediately with user's message
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedMessages));
    setNewMessage('');

    try {
      const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
      if (!apiKey) {
        throw new Error('OpenAI API key is not configured');
      }

      console.log('Sending request to OpenAI...'); // Debug log

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'You are a knowledgeable fitness trainer and nutritionist. Provide concise, accurate advice about workouts, nutrition, and general fitness.'
            },
            {
              role: 'user',
              content: newMessage
            }
          ],
          max_tokens: 150,
          temperature: 0.7,
        })
      });

      if (!response.ok) {
        console.error('OpenAI API error:', response.status, response.statusText);
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      console.log('OpenAI response:', data); // Debug log

      const aiResponse = data.choices[0]?.message?.content;
      
      if (!aiResponse) {
        throw new Error('No response from AI');
      }

      // Update messages with AI response
      const aiMessage: Message = {
        type: 'ai',
        content: aiResponse,
        timestamp: new Date()
      };

      const finalMessages = [...updatedMessages, aiMessage];
      setMessages(finalMessages);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(finalMessages));
      onSendMessage();
    } catch (err) {
      console.error('Chat error:', err);
      setError('Failed to get response. Please try again.');
      const errorMessage: Message = {
        type: 'ai',
        content: 'I apologize, but I encountered an error. Please try again.',
        timestamp: new Date()
      };
      const finalMessages = [...updatedMessages, errorMessage];
      setMessages(finalMessages);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(finalMessages));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="relative bg-gray-dark rounded-lg w-full max-w-2xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
          <div className="flex items-center">
            <Bot className="w-6 h-6 text-neon mr-2" />
            <h2 className="text-xl font-bold">AI Fitness Chat</h2>
          </div>
          <div className="flex items-center gap-4">
            {!isPremium && (
              <span className="text-sm text-gray-400">
                Tips Left: {remainingTips}
              </span>
            )}
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-neon"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Chat Messages */}
        <div 
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto p-4 space-y-4"
        >
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.type === 'user'
                    ? 'bg-neon text-black ml-4'
                    : 'bg-gray-700 text-white mr-4'
                }`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
                <p className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
          {error && (
            <div className="bg-red-900/50 text-red-200 p-3 rounded-lg text-center">
              {error}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-gray-700">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask your AI trainer anything..."
              className="flex-1 px-4 py-2 bg-black border border-gray-700 rounded-lg focus:ring-2 focus:ring-neon focus:border-transparent text-white"
              disabled={isLoading || (!isPremium && remainingTips === 0)}
            />
            <button 
              onClick={handleSend}
              className="btn-primary px-4"
              disabled={!isPremium && remainingTips === 0 || isLoading}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
          {!isPremium && remainingTips === 0 && (
            <p className="text-sm text-gray-400 mt-2">
              You've reached your daily limit. 
              <button 
                onClick={onUpgrade}
                className="text-neon hover:underline ml-1"
              >
                Upgrade to Premium
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIChatModal;