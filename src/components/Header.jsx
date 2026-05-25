import { Moon, Sun, Languages, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Header({ isDark, setIsDark, language, setLanguage }) {
  return (
    <header className="glass-panel rounded-2xl p-4 flex justify-between items-center z-10 relative shrink-0">
      <div className="flex items-center gap-3">
        <motion.div 
          whileHover={{ rotate: 15, scale: 1.05 }}
          className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30"
        >
          <Sparkles size={20} className="animate-pulse-slow" />
        </motion.div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-800 dark:text-white leading-none">Boi</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">Your AI Friend</p>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setLanguage(language === 'English' ? 'Tagalog' : 'English')}
          className="px-3 py-2 rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300"
        >
          <Languages size={18} />
          <span className="hidden sm:inline">{language}</span>
        </motion.button>
        
        <div className="w-[1px] h-6 bg-slate-200 dark:bg-slate-700 mx-1" />
        
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsDark(!isDark)}
          className="p-2 rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors text-slate-700 dark:text-slate-300"
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </motion.button>
      </div>
    </header>
  );
}