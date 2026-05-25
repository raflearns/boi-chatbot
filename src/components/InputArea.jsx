import { Send, Loader2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function InputArea({ onSendMessage, isTyping }) {
  const [input, setInput] = useState('');
  const textareaRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, [input]);

  const handleSubmit = () => {
    if (input.trim() && !isTyping) {
      onSendMessage(input.trim());
      setInput('');
      if (textareaRef.current) textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-2 z-10 relative shrink-0">
      <div className="flex items-end gap-2 bg-slate-100/50 dark:bg-slate-900/50 rounded-xl border border-slate-200/50 dark:border-slate-700/50 p-2 transition-all focus-within:ring-2 focus-within:ring-indigo-500/20">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Message Boi... (Shift + Enter for new line)"
          className="flex-1 max-h-[120px] min-h-[44px] bg-transparent border-none outline-none px-3 py-3 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 resize-none overflow-y-auto font-medium text-[15px]"
          disabled={isTyping}
          rows={1}
        />
        <motion.button
          whileHover={input.trim() && !isTyping ? { scale: 1.05 } : {}}
          whileTap={input.trim() && !isTyping ? { scale: 0.95 } : {}}
          onClick={handleSubmit}
          disabled={!input.trim() || isTyping}
          className="shrink-0 bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg flex items-center justify-center h-[44px] w-[44px] mb-[2px]"
        >
          {isTyping ? <Loader2 className="animate-spin" size={20} /> : <Send size={18} className="translate-x-[1px]" />}
        </motion.button>
      </div>
    </div>
  );
}