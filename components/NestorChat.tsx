
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getNestorResponse } from '../geminiService';

// Fix: Pervasive type resolution errors in framer-motion are bypassed by casting to any.
const motionAny: any = motion;

interface Message {
  role: 'user' | 'model';
  text: string;
}

export const NestorChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: "Hey there! I'm Nestor. I've been through the student housing jungle a few times myself. How can I help you find your feet today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    // Prepare history for API
    const history = messages.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    const response = await getNestorResponse(userMsg, history);
    setMessages(prev => [...prev, { role: 'model', text: response }]);
    setIsLoading(false);
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-brand-orange text-white rounded-2xl shadow-2xl flex items-center justify-center z-[100] hover:scale-110 transition-transform group"
      >
        <div className="relative">
          <i className={`fa-solid ${isOpen ? 'fa-xmark' : 'fa-comment-dots'} text-2xl transition-all`}></i>
          {!isOpen && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full animate-pulse"></span>
          )}
        </div>
        {/* Tooltip */}
        {!isOpen && (
           <div className="absolute right-20 bg-white text-gray-900 px-4 py-2 rounded-xl text-xs font-black shadow-xl whitespace-nowrap border border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              Ask Nestor for advice! 🦉
           </div>
        )}
      </button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motionAny.div
            initial={{ opacity: 0, scale: 0.9, y: 20, x: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20, x: 20 }}
            className="fixed bottom-24 right-6 w-[380px] h-[550px] bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-100 z-[100] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="bg-brand-blue p-6 text-white flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center border border-white/20">
                <i className="fa-solid fa-graduation-cap text-xl"></i>
              </div>
              <div>
                <h3 className="font-black text-lg leading-tight">Nestor</h3>
                <div className="flex items-center gap-1.5 opacity-80">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
                  <span className="text-[10px] font-black uppercase tracking-widest">Always here to help</span>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div 
              ref={scrollRef}
              className="flex-grow p-6 overflow-y-auto space-y-4 custom-scrollbar bg-gray-50/50"
            >
              {messages.map((m, idx) => (
                <div 
                  key={idx} 
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] p-4 rounded-2xl text-sm font-medium leading-relaxed shadow-sm ${
                    m.role === 'user' 
                      ? 'bg-brand-orange text-white rounded-tr-none' 
                      : 'bg-white text-gray-700 border border-gray-100 rounded-tl-none'
                  }`}>
                    {m.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-100 p-4 rounded-2xl rounded-tl-none shadow-sm flex gap-1">
                    <span className="w-1.5 h-1.5 bg-brand-orange rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-brand-orange rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 bg-brand-orange rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Suggestions */}
            <div className="px-6 py-2 flex gap-2 overflow-x-auto no-scrollbar whitespace-nowrap border-t border-gray-50 bg-white">
              {['Safety tips?', 'Scam warning?', 'How to book?', 'Inspect tips?'].map(s => (
                <button 
                  key={s}
                  onClick={() => setInput(s)}
                  className="bg-gray-100 text-gray-500 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-brand-orange/10 hover:text-brand-orange transition-all"
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="p-4 bg-white border-t border-gray-100">
              <div className="relative">
                <input 
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Ask me anything..."
                  className="w-full bg-gray-50 pl-5 pr-12 py-4 rounded-2xl border-2 border-transparent focus:border-brand-orange focus:bg-white outline-none font-bold text-sm transition-all"
                />
                <button 
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-brand-orange text-white rounded-xl flex items-center justify-center hover:bg-brand-orange-hover transition-all disabled:opacity-50"
                >
                  <i className="fa-solid fa-paper-plane text-xs"></i>
                </button>
              </div>
            </form>
          </motionAny.div>
        )}
      </AnimatePresence>
    </>
  );
};
