import { useEffect } from 'react';
import { useLibraryStore } from '../store/useLibraryStore';
import { useAuthStore } from '../store/useAuthStore';
import { useFlashcardStore } from '../store/useFlashcardStore';
import { Trash2, GraduationCap, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Library = () => {
  const { user } = useAuthStore();
  const { decks, loading, fetchLibrary, deleteDeck } = useLibraryStore();
  const { resetApp } = useFlashcardStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchLibrary(user.id);
    }
  }, [user, fetchLibrary]);

  const handleStudy = (deck: any) => {
    useFlashcardStore.setState({
      step: 'study',
      cards: deck.cards.map((c: any) => ({ ...c, isFlipped: false })),
      currentIndex: 0,
      isSaved: true
    });
    navigate('/');
  };

  if (loading) {
    return (
      <div className="w-full flex justify-center items-center flex-1">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-8 flex-1">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-zinc-900 to-zinc-500 dark:from-zinc-100 dark:to-zinc-500">
          My Library
        </h1>
        <button
          onClick={() => {
            resetApp();
            navigate('/');
          }}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
        >
          + Bài viết mới
        </button>
      </div>

      {decks.length === 0 ? (
        <div className="w-full py-20 text-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl">
          <p className="text-zinc-500 dark:text-zinc-400">Bạn chưa lưu bộ từ vựng nào.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {decks.map(deck => (
            <div key={deck.id} className="bg-white dark:bg-zinc-800 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-700 shadow-sm hover:shadow-md transition-shadow group flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-lg mb-2 line-clamp-2">{deck.title}</h3>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-4">
                  {deck.cards.length} thẻ
                </p>
              </div>
              <div className="flex gap-2 mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-700/50">
                <button
                  onClick={() => handleStudy(deck)}
                  className="flex-1 flex items-center justify-center gap-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 py-2 rounded-lg font-medium hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors"
                >
                  <GraduationCap className="w-4 h-4" /> Ôn Tập
                </button>
                <button
                  onClick={() => deleteDeck(deck.id)}
                  className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  title="Xóa bộ thẻ"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
