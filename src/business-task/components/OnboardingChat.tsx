import React, { useState, useEffect, useRef } from 'react';
import { Send, Rocket, ArrowRight } from 'lucide-react';
import { ChatMessage, BusinessProfile } from '../types';
import { sendOnboardingMessage, extractProfileFromHistory } from '../services/geminiService';

interface OnboardingChatProps {
  onComplete: (profile: BusinessProfile, history: ChatMessage[]) => void;
}

export const OnboardingChat: React.FC<OnboardingChatProps> = ({ onComplete }) => {
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Ref to track IME composition status (for Chinese input handling)
  const isComposing = useRef(false);

  // Initial greeting
  useEffect(() => {
    if (history.length === 0) {
      setHistory([{
        id: 'init',
        role: 'model',
        text: "Hi there! I'm your Business AI Partner. I'm here to help you turn your ideas into a solid, workable plan. To get started, tell me a bit about what you're building or thinking of starting?",
        timestamp: Date.now()
      }]);
    }
  }, []);

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
      const responseText = await sendOnboardingMessage(history, input);
      setHistory(prev => [...prev, {
        id: crypto.randomUUID(),
        role: 'model',
        text: responseText,
        timestamp: Date.now()
      }]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinish = async () => {
    setIsExtracting(true);
    try {
      const profile = await extractProfileFromHistory(history);
      onComplete(profile, history);
    } catch (e) {
      console.error(e);
      // Fallback or error handling
    } finally {
      setIsExtracting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isComposing.current) {
      e.preventDefault(); // Prevent default behavior
      handleSend();
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white w-full max-w-2xl h-[80vh] rounded-2xl shadow-xl flex flex-col border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-indigo-900 p-4 text-white flex justify-between items-center shadow-md">
           <div className="flex items-center gap-3">
             <div className="p-2 bg-white/10 rounded-full">
               <Rocket className="w-5 h-5" />
             </div>
             <div>
               <h2 className="font-bold text-lg">Business Discovery</h2>
               <p className="text-indigo-200 text-xs">Let's clarify your vision together</p>
             </div>
           </div>
           
           {history.length > 2 && (
             <button 
               onClick={handleFinish}
               disabled={isExtracting}
               className="bg-white text-indigo-900 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-indigo-50 transition-colors disabled:opacity-70"
             >
               {isExtracting ? 'Building Plan...' : 'Generate Plan'}
               {!isExtracting && <ArrowRight className="w-4 h-4" />}
             </button>
           )}
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50" ref={scrollRef}>
          {history.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`
                max-w-[85%] rounded-2xl px-5 py-4 text-sm leading-relaxed shadow-sm
                ${msg.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-br-none' 
                  : 'bg-white text-slate-800 rounded-bl-none border border-slate-200'}
              `}>
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-none px-5 py-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-slate-100">
          <div className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              onCompositionStart={() => isComposing.current = true}
              onCompositionEnd={() => isComposing.current = false}
              placeholder="Tell me about your idea..."
              className="w-full pl-4 pr-12 py-4 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none shadow-sm"
              autoFocus
            />
            <button 
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="absolute right-2 top-2 bottom-2 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <p className="text-center text-slate-400 text-xs mt-3">
            Press Enter to chat. We'll build your profile step by step.
          </p>
        </div>
      </div>
    </div>
  );
};