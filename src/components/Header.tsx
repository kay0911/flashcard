import { BrainCircuit, Library, LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useFlashcardStore } from '../store/useFlashcardStore';

export const Header = () => {
  const { user, signOut } = useAuthStore();
  const { resetApp } = useFlashcardStore();
  const location = useLocation();

  const handleSignOut = async () => {
    resetApp(); // Xóa sạch state flashcard hiện tại
    await signOut();
  };

  return (
    <header className="w-full py-4 px-6 md:px-12 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/50 backdrop-blur-md sticky top-0 z-10 border-b border-zinc-200/50 dark:border-zinc-800/50">
      <Link to="/" className="flex items-center gap-3 group">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg group-hover:shadow-indigo-600/40 transition-all">
          <BrainCircuit className="w-6 h-6 text-white" />
        </div>
        <span className="font-bold text-xl tracking-tight text-zinc-900 dark:text-zinc-100 hidden sm:block">
          Vocab<span className="text-indigo-600 dark:text-indigo-400">AI</span>
        </span>
      </Link>
      
      {user && (
        <div className="flex items-center gap-4">
          <Link 
            to="/library"
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              location.pathname === '/library' 
                ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100' 
                : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/50'
            }`}
          >
            <Library className="w-4 h-4" />
            <span className="hidden sm:inline">Thư Viện</span>
          </Link>
          
          <button
            onClick={handleSignOut}
            className="p-2 flex items-center gap-2 text-zinc-500 hover:text-red-500 transition-colors bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 shadow-sm"
            title="Đăng xuất"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      )}
    </header>
  );
};
