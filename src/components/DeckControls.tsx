import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { useFlashcardStore } from '../store/useFlashcardStore';

export const DeckControls = () => {
  const { currentIndex, cards, nextCard, prevCard, restartDeck } = useFlashcardStore();
  const total = cards.length;

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-md mt-10 pointer-events-auto">
      <div className="flex items-center justify-between w-full">
        <button
          onClick={prevCard}
          disabled={currentIndex === 0}
          className="p-3 lg:p-4 rounded-full bg-white dark:bg-zinc-800 shadow-sm border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-all disabled:opacity-30 disabled:cursor-not-allowed group"
        >
          <ChevronLeft className="w-6 h-6 text-zinc-700 dark:text-zinc-300 group-disabled:text-zinc-400" />
        </button>

        <div className="text-sm font-medium text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800/80 px-5 py-2 rounded-full border border-zinc-200 dark:border-zinc-700 shadow-inner">
          {currentIndex + 1} / {total}
        </div>

        <button
          onClick={nextCard}
          disabled={currentIndex === total - 1}
          className="p-3 lg:p-4 rounded-full bg-white dark:bg-zinc-800 shadow-sm border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-all disabled:opacity-30 disabled:cursor-not-allowed group"
        >
          <ChevronRight className="w-6 h-6 text-zinc-700 dark:text-zinc-300 group-disabled:text-zinc-400" />
        </button>
      </div>

      <button
        onClick={restartDeck}
        className="flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors mt-2 px-4 py-2"
      >
        <RotateCcw className="w-4 h-4" />
        Học lại từ đầu
      </button>
    </div>
  );
};
