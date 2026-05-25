import { Moon, Sun, Languages } from 'lucide-react';

export default function Header({ isDark, setIsDark, language, setLanguage }) {
  return (
    <header className="glass-panel p-4 flex justify-between items-center z-10 relative mb-4">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white font-bold text-xl shadow-inner">
          B
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-800 dark:text-white">Boi</h1>
      </div>
      <div className="flex gap-3">
        <button 
          onClick={() => setLanguage(language === 'English' ? 'Tagalog' : 'English')}
          className="p-2 rounded-full hover:bg-gray-200/50 dark:hover:bg-gray-700/50 transition flex items-center gap-2 text-sm font-medium"
        >
          <Languages size={20} />
          <span className="hidden sm:inline">{language}</span>
        </button>
        <button 
          onClick={() => setIsDark(!isDark)}
          className="p-2 rounded-full hover:bg-gray-200/50 dark:hover:bg-gray-700/50 transition"
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </header>
  );
}