import { Send, Loader2 } from 'lucide-react';
import { useState } from 'react';

export default function InputArea({ onSendMessage, isTyping }) {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !isTyping) {
      onSendMessage(input);
      setInput('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="glass-panel p-2 flex gap-2 z-10 relative mt-4">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Talk to Boi..."
        className="flex-1 bg-transparent border-none outline-none px-4 py-2 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
        disabled={isTyping}
      />
      <button
        type="submit"
        disabled={!input.trim() || isTyping}
        className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg flex items-center justify-center"
      >
        {isTyping ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
      </button>
    </form>
  );
}