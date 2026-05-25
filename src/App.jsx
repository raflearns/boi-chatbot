import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import InputArea from './components/InputArea';
import { generateBoiResponse } from './lib/gemini';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [language, setLanguage] = useState('English');
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Apply theme class to HTML body
  useEffect(() => {
    if (isDark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDark]);

  // Auto-scroll
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
      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        text: "I'm having a little trouble connecting right now. Let's take a deep breath and try again in a moment.", 
        sender: 'boi', 
        isError: true 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col relative w-full ${isDark ? 'bg-gray-950' : 'bg-blue-50'} transition-colors duration-500 font-sans`}>
      {/* Animated Background Blobs */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 dark:bg-purple-900 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-3xl opacity-70 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-300 dark:bg-blue-900 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 dark:bg-pink-900 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>

      <div className="max-w-3xl mx-auto w-full h-screen p-4 flex flex-col z-10">
        <Header isDark={isDark} setIsDark={setIsDark} language={language} setLanguage={setLanguage} />
        
        {/* Chat Area */}
        <div className="flex-1 glass-panel p-4 md:p-6 overflow-y-auto flex flex-col gap-4">
          {messages.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center opacity-70">
              <div className="w-20 h-20 mb-6 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white text-4xl shadow-lg">
                B
              </div>
              <h2 className="text-2xl font-semibold mb-2">Hi, I'm Boi.</h2>
              <p className="max-w-md">I'm here to listen, chat, and keep you company. How are you feeling today?</p>
            </div>
          ) : (
            <AnimatePresence>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] p-4 rounded-2xl ${
                    msg.sender === 'user' 
                      ? 'bg-blue-500 text-white rounded-tr-sm shadow-md' 
                      : msg.isError 
                        ? 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200 border border-red-200' 
                        : 'bg-white/60 dark:bg-gray-800/60 backdrop-blur-md shadow-sm rounded-tl-sm text-gray-800 dark:text-gray-100'
                  }`}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
          
          {isTyping && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
              <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md p-4 rounded-2xl rounded-tl-sm shadow-sm flex gap-1">
                <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-75"></span>
                <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-150"></span>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <InputArea onSendMessage={handleSendMessage} isTyping={isTyping} />
      </div>
    </div>
  );
}