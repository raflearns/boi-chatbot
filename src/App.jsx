import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import InputArea from './components/InputArea';
import { generateBoiResponse } from './lib/gemini';
import { useTheme } from './hooks/useTheme';
import { cn } from './utils/cn';
import { Sparkles } from 'lucide-react';

export default function App() {
  const [isDark, setIsDark] = useTheme();
  const [language, setLanguage] = useState('English');
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async (text) => {
    const newUserMsg = { id: Date.now(), text, sender: 'user' };
    setMessages(prev => [...prev, newUserMsg]);
    setIsTyping(true);

    try {
      const response = await generateBoiResponse(messages, text, language);
      setMessages(prev => [...prev, { id: Date.now() + 1, text: response, sender: 'boi' }]);
    } catch (error) {
      const errorMessage = error.message === "API_KEY_MISSING" 
        ? "Configuration Error: The Gemini API key is missing. Please check your environment variables."
        : "I'm currently experiencing network issues. Please check your connection and try again.";
        
      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        text: errorMessage, 
        sender: 'boi', 
        isError: true 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="relative w-full h-[100dvh] flex flex-col items-center justify-center font-sans overflow-hidden">
      {/* Modern Soft Animated Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-indigo-200/40 dark:bg-indigo-900/20 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-[100px] animate-blob" />
        <div className="absolute top-[20%] right-[-10%] w-[40vw] h-[40vw] bg-purple-200/40 dark:bg-purple-900/20 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-[100px] animate-blob" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-[-20%] left-[20%] w-[60vw] h-[60vw] bg-blue-100/40 dark:bg-blue-900/20 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-[100px] animate-blob" style={{ animationDelay: '4s' }} />
      </div>

      <div className="w-full max-w-4xl h-full flex flex-col p-4 sm:p-6 z-10 gap-4">
        <Header isDark={isDark} setIsDark={setIsDark} language={language} setLanguage={setLanguage} />
        
        {/* Chat Area Container */}
        <div className="flex-1 glass-panel rounded-3xl p-4 sm:p-6 overflow-y-auto flex flex-col scroll-smooth">
          {messages.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center opacity-90 pb-10">
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="w-24 h-24 mb-6 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-2xl shadow-indigo-500/20 rotate-3 hover:rotate-6 transition-transform"
              >
                <Sparkles size={48} />
              </motion.div>
              <motion.h2 
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-3xl font-bold mb-3 tracking-tight text-slate-800 dark:text-slate-100"
              >
                How can I help you today?
              </motion.h2>
              <motion.p 
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-slate-500 dark:text-slate-400 max-w-md"
              >
                I'm Boi, your premium AI assistant. Ask me anything, share your thoughts, or just say hello.
              </motion.p>
            </div>
          ) : (
            <div className="flex flex-col gap-5 pb-4">
              <AnimatePresence initial={false}>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className={cn("flex w-full", msg.sender === 'user' ? "justify-end" : "justify-start")}
                  >
                    <div className={cn(
                      "max-w-[85%] sm:max-w-[75%] px-5 py-3.5 rounded-3xl shadow-sm text-[15px] leading-relaxed whitespace-pre-wrap",
                      msg.sender === 'user' 
                        ? "bg-indigo-600 text-white rounded-br-sm shadow-indigo-500/20" 
                        : msg.isError 
                          ? "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-500/20 rounded-bl-sm" 
                          : "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-100 dark:border-slate-700/50 rounded-bl-sm"
                    )}>
                      {msg.text}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {isTyping && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start">
                  <div className="bg-white dark:bg-slate-800 px-5 py-4 rounded-3xl rounded-bl-sm border border-slate-100 dark:border-slate-700/50 flex gap-1.5 items-center shadow-sm">
                    <span className="w-2 h-2 bg-indigo-400/80 rounded-full animate-bounce" />
                    <span className="w-2 h-2 bg-indigo-400/80 rounded-full animate-bounce delay-75" />
                    <span className="w-2 h-2 bg-indigo-400/80 rounded-full animate-bounce delay-150" />
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} className="h-1" />
            </div>
          )}
        </div>

        <InputArea onSendMessage={handleSendMessage} isTyping={isTyping} />
      </div>
    </div>
  );
}