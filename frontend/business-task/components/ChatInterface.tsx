import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { ChatMessage, BusinessProfile } from '../types';
import { sendMessageToGemini } from '../services/geminiService';

interface ChatInterfaceProps {
  history: ChatMessage[];
  setHistory: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  profile: BusinessProfile;
  onGenerateTasks: () => void;
  isGeneratingTasks: boolean;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  history, 
  setHistory, 
  profile,
  onGenerateTasks,
  isGeneratingTasks
}) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Ref to track IME composition status (for Chinese input handling)
  const isComposing = useRef(false);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const handleSend = async () => {
    if (!input.trim() || isComposing.current) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      text: input,
      timestamp: Date.now()
    };

    setHistory(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const responseText = await sendMessageToGemini(history, profile, input);
      
      const aiMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'model',
        text: responseText,
        timestamp: Date.now()
      };
      
      setHistory(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isComposing.current) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
        <h2 className="font-semibold text-slate-800 flex items-center gap-2">
          <Bot className="w-5 h-5 text-indigo-600" />
          AI Consultant
        </h2>
        <button 
          onClick={onGenerateTasks}
          disabled={isGeneratingTasks || history.length < 2}
          className={`text-xs font-medium px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-colors
            ${isGeneratingTasks || history.length < 2
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
              : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'}`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          {isGeneratingTasks ? 'Analyzing...' : 'Generate Tasks'}
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
        {history.length === 0 && (
          <div className="text-center text-slate-400 mt-10">
            <p>Start chatting to discuss your business ideas.</p>
            <p className="text-sm mt-2">I can help you plan your MVP, suggest marketing strategies, or advise on compliance.</p>
          </div>
        )}
        
        {history.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`
              max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed
              ${msg.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-br-none' 
                : 'bg-slate-100 text-slate-800 rounded-bl-none'}
            `}>
              {msg.text}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-100 rounded-2xl rounded-bl-none px-4 py-3 flex items-center gap-2">
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-slate-100">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onCompositionStart={() => isComposing.current = true}
            onCompositionEnd={() => isComposing.current = false}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2.5 border border-slate-300 rounded-lg bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
          />
          <button 
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="bg-indigo-600 text-white p-2.5 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};